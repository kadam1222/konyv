import { useState, useEffect } from "react";
import httpCommon from "../http-common";



export default function AdminModositasok( {accessToken}){
    const [osszesRendeles, setOsszesRendeles] = useState([])

    useEffect(() =>{
        const fetchData = async () =>{
            try{
            const response = await httpCommon.get("/konyvek/adminmodosit", {
                headers :{
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            console.log(response.data)
            setOsszesRendeles(response.data)
        }
        catch(err){
            throw err
        }
       if (accessToken) fetchData() 
    }},[accessToken])
    return(
        <>
        {osszesRendeles.map((o_r, index) =>(
            <>
            <span>{o_r.cim}</span>
            </>
        ))}
        </>
    )
}