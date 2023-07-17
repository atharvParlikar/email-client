import axios from 'axios'

export const load = async ({ fetch, params }) => {
    const email = await axios.get(`http://localhost:3000/mails/${params.uid}`);
    console.log(email.data[0]);
    return email.data[0];
}