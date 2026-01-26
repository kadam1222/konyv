import { useState, useEffect } from "react";
import httpCommon from "../http-common";



export default function AdminModositasok( {accessToken}){
    const [osszesRendeles, setOsszesRendeles] = useState([])

   useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await httpCommon.get("/konyvek/adminmodosit", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setOsszesRendeles(response.data)
        } catch (err) {
            console.error(err)
        }
    }
    if (accessToken) {
        fetchData()  
    }
}, [accessToken])

    return(
        <>
        {osszesRendeles.map((o_r, index) =>(
            <>
            <span>{o_r.cim}, {o_r.email}, {o_r.keletkezes} <button>Rendelés törlése</button> <button>Rendelés módosítása</button></span>
            </>
        ))}
        </>
    )
}