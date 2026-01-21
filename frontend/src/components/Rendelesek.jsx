import { useState, useEffect } from "react";


export default function Rendelesek({accessToken}){
    const [rendeleseim, setRendeleseim] = useState([]);
    useEffect (() =>{
        const fetchData = async() =>{
        try{
           const response = await httpCommon.get("/konyvek/rendelesek", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            })
            setRendeleseim(response.data)
        }
        catch(err){
            throw err
        }
    }
    if (accessToken) fetchData();
}, [accessToken]);
    return(
        <>
        <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
        <div className='fodivrendeles'>
        <h2>Rendeléseim</h2>
        <div>
            {rendeleseim.map((index, r) =>(
                <>
                <div key={index}>
                    {r.ISBN}
                </div>
                </>
            ))}
        </div>
      </div>
        </>
    )

}