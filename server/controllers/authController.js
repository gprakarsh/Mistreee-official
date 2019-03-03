const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
require('dotenv').config()
const emailExistence = require('email-existence')
// const logo = require('./../../src/assets/tabIcon.png')

module.exports = {
    register: async (req, res) => {
        let { name, address, isadmin, ismechanic, number, username, password, email, url } = req.body
        const { session } = req
        const db = req.app.get('db')

        const usernamesCheck1 = await db.auth.getUsernames1(username)
        const usernamesCheck2 = await db.auth.getUsernames2(username)

        let response = true
        emailExistence.check(email, function (error, res) {
            response = res
        })

        if (!response) {
            res.status(510).send('Invalid Email Address')
            return
        }
        console.log('hit')

        if (usernamesCheck1.length !== 0 || usernamesCheck2.length !== 0) {
            res.status(409).send('Username Already Taken')
            return
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        if (!url) {
            url = null
        }

        let newUser = await db.auth.register([name, address, isadmin, ismechanic, number, username, hash, email, url])
        newUser = newUser[0]

        
        delete newUser.password
        session.user = { ...newUser };

        res.status(201).send(session.user)
    },
    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')
        const { session } = req
        let user = await db.auth.login(username)
        
        user = user[0]
        if (!user) {
            user = await db.auth.emailLogin(username)
            user = user[0]
            if (!user) {
                user = await db.auth.candidateLogin(username)
                user = user[0]
                if (!user) {
                    user = await db.auth.candidateEmailLogin(username)
                    user = user[0]
                    if (!user) {
                        return res.status(404).send('Username/Email does not exist')
                    }
                }
            }
        }

        

        const foundUser = bcrypt.compareSync(password, user.password)

        if (foundUser) {
            delete user.password
            session.user = user

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = mm + '/' + dd + '/' + yyyy;

            const addStat = await db.auth.addStat(today)
            if (addStat.length !== 0) {
                let logins = addStat[0].logins + 1;
                const addStat1 = await db.auth.addStat1([today, logins])
            }
            else {
                const addStat2 = await db.auth.addStat2([today, 1])
            }

            res.status(200).send(session.user)
        }
        else {
            res.status(401).send('Incorrect Password! Try Again')
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    getInfo: (req, res) => {
        const { user } = req.session;
        if (user) {
            res.status(200).send(user);
        } else {
            res.sendStatus(401);
        }
    },
    apply: async (req, res) => {
        const { name, address, number, username, password, reason, items, email, url } = req.body
        const { session } = req
        const db = req.app.get('db')

        const usernamesCheck1 = await db.auth.getUsernames1(username)
        const usernamesCheck2 = await db.auth.getUsernames2(username)

        let response = true
        emailExistence.check(email, function (error, res) {
            response = res
        })

        if (!response) {
            res.status(510).send('Invalid Email Address')
            return
        }
        console.log('hit')

        if (usernamesCheck1.length !== 0 || usernamesCheck2.length !== 0) {
            res.status(409).send('Username Already Taken')
            return
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        let prospMech = await db.auth.apply([name, address, number, username, hash, reason, items, email, url])
        prospMech = prospMech[0]
        console.log({prospMech})

        delete prospMech.password
        session.user = { ...prospMech }
        res.status(201).send(session.user)

        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'mistreeeofficial@gmail.com',
                pass: process.env.PASSWORD
            }
        });
        let mailOptions = {
            from: '"Mistreee" <mistreeeofficial@gmail.com>', // sender address
            to: prospMech.email, // list of receivers
            subject: 'Application received', // Subject line
            text: 'Application received', // plain text body
            html: `<div>
                        <p style="font-size:20px;">Dear ${prospMech.name},</p>
                        <p style="font-size:18px;">We have received your application!</p>
                        <p> Please expect the decision to appear on the following email address within 2-3 days.</p>
                        <b>Email Address: ${prospMech.email}</b>
                        <p style="margin-bottom:0;">Warm Regards,<p>
                        <p style="margin:0;">Prakarsh Gupta,<p>                      
                        <p style="margin:0;">(Head of Recruting Department - Mistreee)<p>
                    </div>`// html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });



    }

}    
