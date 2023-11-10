# 📧 Email Client for hackers

![screenshot](https://gcdnb.pbrd.co/images/mLTqClcMlu1s.png?o=1)

This email client is specifically made for software engineers and Linux nerds.

## 📁 Repository Structure

- ~/src/ : This folder contains the frontend code, written in svelte.
- ~/backend/ : This folder contains all the backend code, for now consisting in only one file index.js

## 🚀 Backend API endpoints

| Endpoint                                           | Method | Path                 | Description                                                                                                                                                                                                                                             |
| -------------------------------------------------- | ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retrieve Emails                                    | POST   | /mails/:range/:body? | Retrieves emails based on the specified range and optional body parameters. The range parameter is required, and the body parameter is optional. If not provided, it defaults to an empty string. The request body should include the folder parameter. |
| Send Email                                         | POST   | /send/               | Sends an email with the specified "to" address, subject, and text. If successful, it returns a success message; otherwise, it returns an error message. The request body should include the "to," "subject," and "text" parameters.                     |
| Retrieve Folders                                   | GET    | /folders             | Retrieves a list of folders. It returns a JSON array containing the available folders.                                                                                                                                                                  |
| Retrieve Total Number of Emails in Specific Folder | POST   | /total               | Retrieves the total number of emails in a specific folder. The request body should include the "folder" parameter.                                                                                                                                      |
| Delete Emails                                      | POST   | /delete              | Deletes emails specified in the request body. The request body should include "mails" (emails to delete) and "box" (folder from which to delete). If successful, it returns a success message; otherwise, it returns a failure message.                 |

## ⚒️ Development

This is a passion project of mine, basically creating a perfect email client for my needs so the development will probably never end. I plan to create a Desktop Applicaiton in Electron.js after the basic functionality is complete.

## 🌟 Getting started

1. Clone the repo<br>`git clone https://github.com/atharvparlikar/email-client`
2. Rename .env.example to .env<br>`mv .env.example .env`
3. Add the IMAP_PASSWORD in .env (get it from [here](https://myaccount.google.com/apppasswords))
4. Install the packages<br>`bun install` or `yarn`
5. Start the frontend<br>`bun dev` or `yarn dev`
6. Start the backend<br>`bun backend` or `yarn backend`

## ✨ Features

- [x] Send Emails
- [x] Receive Emails
- [x] Reply to Emails
- [x] Delete Emails
- [x] Send emails in Markdown mode
- [ ] Vim mode for email composition
- [ ] Customizable UI
- [ ] Email Deletion with imap-queries
  - [ ] Mass un-subscribe
