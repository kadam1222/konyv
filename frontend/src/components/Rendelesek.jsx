import { useState, useEffect } from "react";
import httpCommon from "../http-common";

export default function Rendelesek({accessToken, setAccessToken}){
    const [rendeleseim, setRendeleseim] = useState([]);
    useEffect (() =>{
        const fetchData = async() =>{
        try{
           const response = await httpCommon.get("/konyvek/rendelesek", {
            headers: {
                Authorization: `Bearer ${accessToken}`, 

            }
            });
            setRendeleseim(response.data)
        }
        catch(err){
            console.error("Error fetching data:", err);
        }
    }
    fetchData();
}, [accessToken]);
    return(
        <>
        <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
        <div className='fodivrendeles'>
        <h2>Rendeléseim</h2>
        <div>
            {rendeleseim.map((r,index) =>(
                <>
                <div key={index}>
                    {console.log(r.cim)}
                    {r.cim}
                </div>
                </>
            ))}
        </div>
      </div>
        </>
    )

}