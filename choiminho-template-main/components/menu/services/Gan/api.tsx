import axios from "axios"


const SERVER = 'http://127.0.0.1:8000'
const headers = {
    "Content-Type" : "application/json",
    Authorization: "JWT fefege...",
}

export const step1Api = async (
    imgUrl : string
) => {
    await axios.post(`${SERVER}/images/upload`, imgUrl, {headers})
}