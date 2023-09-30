import express from 'express';
import cors from 'cors';
import { simpleParser } from 'mailparser';
import Imap from 'node-imap';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const { IMAP_PASSWORD } = process.env;

const app = express();
app.use(cors());
app.use(express.json())
const port = 3000;

const config = {
  user: 'atharvparlikar@gmail.com',
  password: IMAP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
};


const dlog = (s) => console.log(`[🐞 DEBUG] ${s}`)

async function getEmails(range, body, folder) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once('ready', () => {
      dlog("imap is ready");
      imap.openBox(folder, false, (err, mailbox) => {
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
        console.log('total: ', total);
        const rangeStart = total - parseInt(range.split(":")[1]);

        if (range.split(':')[0] === "latest") {
          range = `${rangeStart < 0 ? 1 : rangeStart}:${total}`;
        }
        console.log("range: ", range);

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
            console.log("emails size: ", emails.length);
          });
        });

        fetch.once('end', async () => {
          imap.end();
          console.log(emails.length);
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




async function getTotalMails(folder) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once('ready', () => {

      imap.openBox(folder, false, (err, mailbox) => {
        if (err) reject(err);
        else {
          resolve(mailbox.messages.total);
        }
      });

    });

    imap.on('error', (err) => {
      reject(err);
    })

    imap.connect();
  });

}

async function getFolders() {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once('ready', function() {
      imap.getBoxes(function(err, boxes) {
        if (err) {
          imap.end();
          reject(err);
        } else {
          // const folderNames = Object.keys(boxes);
          imap.end();
          resolve(Object.keys(boxes['[Gmail]'].children));
        }
      });
    });

    imap.once('error', function(err) {
      imap.end();
      reject(err);
    });

    imap.connect();
  });
}


async function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email service provider (e.g., Gmail, Yahoo, etc.)
    auth: {
      user: config.user, // Your email address
      pass: config.password, // Your email password or application-specific password
    },
  });

  const mailOptions = {
    from: config.user,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return {
        error: err
      };
    } else {
      return {
        message: info
      }
    }
  });
}


// API endpoint to retrieve emails
app.post('/mails/:range/:body?', async (req, res) => {
  dlog("got a request on POST:/mails")
  let { range, body } = req.params;
  let { folder } = req.body;
  if (body === undefined) body = '';
  const emails = await getEmails(range, body, folder);
  res.json(emails);
});

app.post("/send/", async (req, res) => {
  const { to, subject, text } = req.body;
  const sent = await sendMail(to, subject, text);
  if (Object.hasOwnProperty('error')) res.json({ error: sent.error });
  else res.json({ message: sent });
})

// API endpoint to retrieve folders
app.get("/folders", async (req, res) => {
  res.json(await getFolders());
})


// API endpoint to retrieve total number of emails in specific folder
app.post('/total', async (req, res) => {
  const { folder } = req.body;
  dlog("got request");
  dlog(`folder ${folder}`);
  const total = await getTotalMails(folder);
  res.json(total);
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
