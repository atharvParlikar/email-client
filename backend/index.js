const express = require('express');
const cors = require("cors")
const { simpleParser } = require('mailparser');
const Imap = require('node-imap');

const app = express();
app.use(cors());
const port = 3000;

const config = {
  user: 'atharvparlikar@gmail.com',
  password: 'foaesytlacijvfge',
  host: 'imap.gmail.com',
  port: 993, 
  tls: true,
};

// API endpoint to retrieve emails
app.get('/mails/:range/:body?', (req, res) => {
  // Connection configuration
  const imap = new Imap(config);

  // Event handler for successful connection
  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, mailbox) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Internal Server Error
        return;
      }

      let {range, body} = req.params;


      body = body || "";

      if (!['', 'header', 'text'].map(t => body === t || body === t.toUpperCase()).reduce((acc, curr) => acc || curr, false)) {
        res.json({
          error: "invalid email-body params"
        });
      }

      const total = mailbox.messages.total;
      if (range.split(':')[0] === "latest") {
        range = `${total - parseInt(range.split(":")[1])}:${total}`
      }
      
      console.log(range)

      const fetchOptions = {
        markSeen: false,
        bodies: body.toLowerCase() === 'header'  ? "HEADER.FIELDS (TO FROM SUBJECT)" : body.toUpperCase(),
        struct: true,
      };

      const fetch = imap.seq.fetch(`${range}`, fetchOptions);

      const emails = [];

      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          let body = '';
          stream.on('data', (chunk) => {
            body += chunk.toString('utf8');
          });

          stream.on('end', () => {
            emails.push(body);
          });
        });
      });

      fetch.once('end', async () => {
        imap.end();
        const parsedEmails = [];
        let uid = total - emails.length + 1;
        for (const email of emails) {
          parsedEmails.push({
            uid,
            mail:await simpleParser(email)
          });
          uid++;
        }
        res.json(parsedEmails); // Send the retrieved emails as a JSON response
      });
    });
  });

  // Event handler for connection errors
  imap.on('error', (err) => {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  });

  // Connect to the IMAP server
  imap.connect();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});