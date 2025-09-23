import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";


export const GetCivilServants = async () =>{
    const res = await axios.get(`${URL_API_ADMIN}/civil-servants`);
    return res.data;
};