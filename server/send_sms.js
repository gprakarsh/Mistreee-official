const accountSid = 'AC8efad7938dffb983f943e297fb6c12c2';
const authToken = 'f9cc58d99da0a09207f945889de64e26';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages.create(
  {
    to: '+12019533594',
    from: '+19737187495',
    body: 'What up?',
  },
  (err, message) => {
    console.log(err);
  }
);