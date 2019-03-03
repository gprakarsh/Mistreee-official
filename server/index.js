require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { json } = require('body-parser')
const massive = require('massive')
const aws = require('aws-sdk')
const path = require('path')
const axios = require('axios')
const socket = require('socket.io');
const ssl = require('./setSocketListeners')
const stripe = require("stripe")(process.env.STRIPEKEY);



const ac = require('./controllers/authController')
const ic = require('./controllers/infoController')

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, S3_BUCKET} = process.env

const app = express()

app.use( express.static( `${__dirname}/../build` ) )
app.use(json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))


massive(CONNECTION_STRING).then((db) => {
  app.set('db', db)
  console.log('Database Connected')
  const io = socket(app.listen(SERVER_PORT, () => { console.log(`Magic at ${SERVER_PORT}`) }))

  io.on('connection', socket => {
    ssl.setSocketListeners(socket, db, io)
  })
})


app.post('/api/payment', function(req, res, next){
  //convert amount to pennies
  console.log(req.body)
  const amountArray = req.body.amount.toString().split('');
  const pennies = [];
  for (var i = 0; i < amountArray.length; i++) {
    if(amountArray[i] === ".") {
      if (typeof amountArray[i + 1] === "string") {
        pennies.push(amountArray[i + 1]);
      } else {
        pennies.push("0");
      }
      if (typeof amountArray[i + 2] === "string") {
        pennies.push(amountArray[i + 2]);
      } else {
        pennies.push("0");
      }
    	break;
    } else {
    	pennies.push(amountArray[i])
    }
  }
  const convertedAmt = parseInt(pennies.join(''));
  console.log({convertedAmt})
  const charge = stripe.charges.create({
  amount: convertedAmt, // amount in cents, again
  currency: 'usd',
  source: req.body.token.id,
  description: 'Test charge-Mistreee Official'
}, function(err, charge) {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(200);
  // if (err && err.type === 'StripeCardError') {
  //   // The card has been declined
  // }
});
});

app.post(`/auth/register`, ac.register)
app.post(`/auth/apply`, ac.apply)
app.post(`/auth/login`, ac.login)
app.post(`/auth/logout`, ac.logout)
app.get(`/auth/user`, ac.getInfo)

app.get(`/api/apps`, ic.getApps)
app.put(`/api/approve`, ic.approve)
app.put(`/api/disapprove`, ic.disapprove)
app.get(`/api/items`, ic.getItems)
app.get(`/api/timeslots`, ic.getTimeslots)
app.post(`/api/confirmAppointment`, ic.confirmAppointment)
app.get(`/api/pendingReq`, ic.getPendingReq)
app.get(`/api/confirmReq`, ic.getConfirmReq)
app.get(`/api/mech/serviceReq`, ic.serviceReq)
app.get(`/api/mech/confirm`, ic.confirmRequest)
app.get(`/api/mech/appointments`, ic.getMechAppointments)
app.delete(`/api/deleteAccount`, ic.deleteAccount)
app.put(`/api/updateAccount`, ic.updateAccount)
app.get(`/api/stats/donut`, ic.getUserCount)
app.get(`/api/stats/line`, ic.getLoginsCount)

app.get(`/api/ifixit`, async (req, res) => {
  const response = await axios.get(`https://www.ifixit.com/api/2.0/guides/1`)
  res.send(response.data)
})

//just a simple get endpoint, make sure it matches what you have on your front end. We'll write out the function here instead of putting it inside of a controller. 
app.get('/sign-s3', (req, res) => {

  //set the config object that we're going to send - make sure your region matches the region code you specified when you created your bucket, and then put your access key and secret access key on the object as well

  aws.config = {
    region: 'us-east-1',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }

  // we're using a function invoked from aws, grabbing our filename and filetype
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  // and using these as a s3Params object that we are going to send to amazon (that function is accessible on the new s3 object instance we created)
  // add your bucket name, add the key as the fileName, how long the request will be active for (in seconds), filetype, and ACL as 'public-read'
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  // now that we have our params configured, lets call the getSignedURL function (also lives on the s3 instance) tell it to 'putObject', provide the params, and as soon as that's run, it will execute a callback function we provide it.
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    // We can build our own URL here, as this is the format of the URL. Send back data if nothing erred. This data is Amazons go ahead to post something. We'll create an object called returnData, and then send that back to the front end! 
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    return res.send(returnData)
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});