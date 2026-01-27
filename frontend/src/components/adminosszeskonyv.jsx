import { useState, useEffect } from "react";
import httpCommon from "../http-common";



export default function AdminBook( {accessToken}){
    const [osszesKonyv, setOsszesKonyv] = useState([])

    const fetchData = async () => {
        try {
            const response = await httpCommon.get("/konyvek/adminosszeskonyv", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setOsszesKonyv(response.data)
        } catch (err) {
            console.error(err)
        }
    }

   useEffect(() => {
    if (accessToken) {
        fetchData()  
    }

    
}, [accessToken])



    return(
        <>
        {osszesKonyv.map((K, index) =>(
            <>
            <span style={{marginBottom:"10px"}}>Cím: {K.cim}<br/> 
            ISBN: {K.ISBN} <br/> 
            nyelv_nev: {K.nyelv_nev} <br/> 
            kiado_nev: {K.kiado_nev} <br/> 
            borito_tipus:  {K.borito_tipus} <br/>
            kat_nev:  {K.kat_nev} <br/>
            ar:  {K.ar} <br/>
            illusztracio_leiras:  {K.illusztracio_leiras} <br/>
            szerzok:  {K.szerzok} <br/>
            fordítok:  {K.fordítok} <br/>
            illusztratorok:  {K.illusztratorok} <br/>
            </span>

            </>
        ))}
        </>
    )
}