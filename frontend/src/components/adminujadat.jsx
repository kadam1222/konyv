import { useState, useEffect } from "react";
import httpCommon from "../http-common";

export default function AdminModositasok( {accessToken}){

    const [nyelvek, setNyelvek] = useState([]);
    const [kiado, setKiado] = useState([]);
    const [borito, setBorito] = useState([]);
    const [illusztráció, setIllusztráció] = useState([]);
    const [szerzok, setSzerzok] = useState([]);
    const [illusztrátorok, setIllusztrátorok] = useState([]);
    const [forditok, setForditok] = useState([]);
    const [kategoria, setKategoria] = useState([]);
    const [tipus, setTipus] = useState([]);

    const fetchData = async () => {
    if (loading) return;
    try {
      const response = await httpCommon.get(
        `/konyvek/adatHozzaad`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }

  };

    return(
        <>
        <h1>Új borító felvétele:</h1>
        <input placeholder="pl. keménytáblás"></input>
        </>
    )
}