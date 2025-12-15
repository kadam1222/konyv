import { useState,useEffect } from "react";
import httpCommon from "../http-common";

export default function Termek({ ISBN }){
    const [adatok,setAdatok] = useState([])

    useEffect(()=>{
        if (!ISBN) return
        let aktiv = true
        const fetchData = async () => {
        try { 
          const response = await httpCommon.post("/konyvek/ISBN", {ISBN});
          if (aktiv) {
            setAdatok(response.data);
            console.log(adatok)
          }

        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

        fetchData()
        return() =>{
            aktiv = false
        }
    }, [ISBN]
)
    
    return(
        <div>
           <div>{adatok.cim}</div>
           <div>{adatok.szerzok}</div>
           <div>{adatok.leiras}</div>
           <div>
            <span>ISBN:{adatok.ISBN}</span>
            {adatok.borito_tipus && <span>Borító típusa:{adatok.borito_tipus}</span>}
            {adatok.fordítok && <span>Fordítók: {adatok.fordítok}</span>}
            {adatok.illusztracio_leiras && <span>Illusztráció: {adatok.illusztracio_leiras}</span>}
            {adatok.illusztratorok && <span>Illusztrátor: {adatok.illusztratorok}</span>}
            <span>Kategória: {adatok.kat_nev}</span>
            <span>Kiadás éve: {adatok.kiadas_eve}</span>
            <span>Kiadó: {adatok.kiado_neve}</span>
            <span>Nyelv: {adatok.nyelv_nev}</span>
           </div>
        </div>
    )
}