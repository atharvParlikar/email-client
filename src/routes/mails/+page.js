import axios from "axios";

export async function load() {
  try {
    let mails = await axios.get('http://localhost:3000/mails/latest:20/header');

    mails = mails.data;
    if (mails) {
      return { mails };
    }
    return { status: 404 };
  } catch (err) {
    console.log(`[error] ${err.message}`);
  }
}