const nodeMailer = require('nodemailer')
require('dotenv').config()
const accountSid = 'AC8efad7938dffb983f943e297fb6c12c2';
const authToken = 'f9cc58d99da0a09207f945889de64e26';
const emailExistence = require('email-existence')
const axios = require(`axios`)


// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);



module.exports = {
    getApps: async (req, res) => {
        const db = req.app.get('db')
        let apps = await db.info.apps()
        delete apps.password
        res.send(apps)
    },
    approve: async (req, res) => {
        console.log('approval hit')
        const { app_id } = req.body
        console.log({ app_id })
        const db = req.app.get('db')

        let mech = await db.info.approval.getInfo([app_id])
        mech = mech[0]
        console.log({ mech })

        let deletor = await db.info.approval.delete([app_id])
        console.log('deleted application')

        const { name, address, number, username, password, items, email, url } = mech

        let newMech = await db.auth.register([name, address, false, true, number, username, password, email, url])
        newMech = newMech[0]
        const { id } = newMech
        console.log({ newMech_id: id })

        let allItems = await db.info.getItems()

        for (let i = 0; i < items.length; i++) {
            let itemExists = allItems.some(val => val['item'] = items[i])
            if (itemExists) {
                let list = await db.info.getMechList(items[i])
                console.log(list)
                if (list.length !== 0) {
                    list = list[0].mech_id
                    list.push(id)
                }
                let update1 = await db.info.approval.updateMechList([list, items[i]])
            }
            else {
                let arr = [id]
                let addItem = await db.info.approval.addItemAndMech([items[i], arr])
            }
        }

        res.sendStatus(200)

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
            to: newMech.email, // list of receivers
            subject: 'Application Decision', // Subject line
            text: 'Application Decision', // plain text body
            html: '<div><h2>Congratulations! You are one of us now! <h2><p>Login using your username/email as soon as possible to get started.</p></div>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });


        console.log('sent res after approval')
    },
    disapprove: async (req, res) => {
        const { app_id } = req.body
        const db = req.app.get('db')

        let app = await db.info.getApp([app_id])
        app = app[0]

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
            to: app.email, // list of receivers
            subject: 'Application Decision', // Subject line
            text: 'Application Decision', // plain text body
            html: '<div><p>We regret to inform you that you will not be joining the Mistreee family despite your great application due to the extremely competitive applications received recently.</div>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });


        let disapprover = await db.info.disapproval([app_id])


        res.sendStatus(200)
    },
    getItems: async (req, res) => {
        const db = req.app.get('db')

        let items = await db.info.getItems()

        res.status(200).send(items)
    },
    getTimeslots: async (req, res) => {
        // const { item } = req.query
        const db = req.app.get('db')


        let timeslots = await db.info.getTimeslots()

        res.status(200).send(timeslots)
    },
    confirmAppointment: async (req, res) => {
        const { id, timeslot, item } = req.body

        console.log({timeslot})

        const db = req.app.get('db')

        let tsId = await db.info.getTsId([timeslot])
        console.log({tsId})

        tsId = tsId[0].id

        const request = await db.info.requestService([id, tsId, item])

        res.sendStatus(200)
    },
    getPendingReq: async (req, res) => {
        const { id } = req.query
        console.log(id)
        const db = req.app.get('db')

        let pendingReq = await db.info.getPendingReq(parseInt(id))

        res.status(200).send(pendingReq)
    },
    getConfirmReq: async (req, res) => {
        const { id } = req.query
        const db = req.app.get('db')

        let confirmReq = await db.info.getConfirmReq(id)

        for (let i = 0; i < confirmReq.length; i++) {
            let { mech_id } = confirmReq[i]
            let mech = await db.info.getMechDetails(mech_id)
            confirmReq[i].mechDetails = mech[0]
        }


        res.status(200).send(confirmReq)
    },
    serviceReq: async (req, res) => {
        const { id } = req.query
        const db = req.app.get('db')

        let itemsMech = await db.info.getItemsMech()

        itemsMech = itemsMech.filter(item => {
            return item.mech_id.includes(parseInt(id))
        })

        let items = []
        itemsMech.forEach(item => {
            items.push(item.item)
        })

        let appointments = await db.info.mechAppointments(parseInt(id))
        console.log(appointments)

        let serviceReq = []
        let timeArr = []


        for (let i = 0; i < items.length; i++) {
            let req = await db.info.serviceReq(items[i])
            if (req.length !== 0) {
                serviceReq.push(req[0])
                timeArr.push(req[0].time)
            }
        }

        for (let i = 0; i < serviceReq.length; i++) {
            for (let j = 0; j < appointments.length; j++) {
                if (timeArr[i] === appointments[j].time) {
                    serviceReq.splice(i, 1)
                }
            }
        }

        let mechAddress = await db.info.getMech(parseInt(id))
        mechAddress = mechAddress[0].address.split(' ').join('+')
        let distances = []
        for (let i = 0; i < serviceReq.length; i++) {
            let req = serviceReq[i]
            let address = req.address.split(' ').join('+')
            const res = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${mechAddress}&destination=${address}&key=${process.env.REACT_APP_GOOGLEAPIKEY}`)

            let distance = res.data.routes[0].legs[0].distance.text
            distances.push(distance)

        }

        // console.log({ distances, serviceReq })


        res.status(200).send({ distances, serviceReq })
    },
    confirmRequest: async (req, res) => {
        const db = req.app.get('db')
        const { id, mech_id } = req.query
        const confirm = await db.info.confirmAppointment([id, mech_id])
        let user_id = await db.info.getUserId(id)
        user_id = user_id[0].user_id
        let mechDetails = await db.info.getMechDetails(mech_id)
        mechDetails = mechDetails[0]
        let userDetails = await db.info.getMechDetails(user_id)
        userDetails = userDetails[0]


        client.messages.create(
            {
                to: userDetails.number,
                from: '+19737187495',
                body: `Good news! Your request to repair has been approved. ${mechDetails.name} is your assigned mechanic. Please feel free to contact your assigned mechanic at ${mechDetails.number} or ${mechDetails.email}`,
            },
            (err, message) => {
                console.log(err);
            }
        );

        res.sendStatus(200)
    },
    getMechAppointments: async (req, res) => {
        const db = req.app.get('db')
        const { id } = req.query

        let appointments = await db.info.mechAppointments(parseInt(id))



        res.status(200).send(appointments)
    },
    deleteAccount: async (req, res) => {
        const db = req.app.get('db')
        const { id } = req.query

        let deleteAccount = await db.info.deleteAccount(parseInt(id))

        res.sendStatus(200)
    },
    updateAccount: async (req, res) => {
        const db = req.app.get('db')
        const { id, name, address, number, username, email } = req.body
        let { url } = req.body
        if (!url) {
            url = null
        }

        let uniqueOrNot = await db.info.uniqueOrNot([username, id])

        if (uniqueOrNot.length !== 0) {
            res.status(409).send('Username is already taken. Please update to a unique username.')
            return
        }

        let response = true
        emailExistence.check(email, function (error, res) {

            response = res
        })

        console.log(response)
        if (!response) {
            res.status(510).send('Invalid Email Address')
            return
        }

        let updateAccount = await db.info.updateAccount([id, name, address, number, username, email, url])

        res.sendStatus(200)
    },
    getUserCount: async (req, res) => {
        const db = req.app.get('db')


        let userCount = await db.info.userCount()
        userCount = parseInt(userCount[0].count)
        let mechCount = await db.info.mechCount()
        mechCount = parseInt(mechCount[0].count)


        let userPercentage = userCount / (userCount + mechCount) * 100
        let mechPercentage = mechCount / (userCount + mechCount) * 100

        res.send({ userPercentage, mechPercentage })
    },

    getLoginsCount: async (req, res) => {
        const db = req.app.get('db')

        let stats = await db.info.loginsCount()


        res.send(stats)
    }

}