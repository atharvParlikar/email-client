import axios from "axios";

export async function load() {
  let mails = await axios.get('http://localhost:3000/emails/latest:20');
  mails = mails.data;
  if (mails) {
    return {mails};
  }
  return {status: 404};
}