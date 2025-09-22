import axios from "axios";

const API_URL = "https://localhost:44314/api/admin"

export const GetCivilServants = async () =>{
    const res = await axios.get(`${API_URL}/civil-servants`);
    return res.data;
};