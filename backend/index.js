import express from 'express';
import cors from 'cors';
import { simpleParser } from 'mailparser';
import Imap from 'node-imap';
import dotenv from 'dotenv';

dotenv.config();
const { IMAP_PASSWORD } = process.env;

const app = express();
app.use(cors());
const port = 3000;

const config = {
  user: 'atharvparlikar@gmail.com',
  password: IMAP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
};


async function getEmails(range, body) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, mailbox) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        if (!['', 'header', 'text'].map(t => body === t || body === t.toUpperCase()).reduce((acc, curr) => acc || curr, false)) {
          reject(new Error("Invalid email-body parameter"));
          return;
        }

        const total = mailbox.messages.total;
        if (range.split(':')[0] === "latest") {
          range = `${total - parseInt(range.split(":")[1])}:${total}`;
        }

        const fetchOptions = {
          markSeen: false,
          bodies: body.toLowerCase() === 'header' ? "HEADER.FIELDS (DATE TO FROM SUBJECT)" : body.toUpperCase(),
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
          const parsedEmails = {};
          let uid = total - emails.length + 1;
          for (const email of emails) {
            parsedEmails[uid] = await simpleParser(email);
            uid++;
          }
          resolve(parsedEmails);
        });
      });
    });

    imap.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    imap.connect();
  });
}

// API endpoint to retrieve emails
app.get('/test', async (req, res) => {
  const emails = await getEmails('latest:20', '');
  console.log(emails); 
  res.json(emails);
});

app.get('/mails/:range/:body?', async (req, res) => {
  let {range, body} = req.params;
  if (body === undefined) body = '';
  const emails = await getEmails(range, body);
  res.json(emails);
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});