import { useState, useEffect } from 'react';
import httpCommon from '../http-common';
import "./profil.css"
import Button from 'react-bootstrap/Button';

export default function Profil({ accessToken }) {
  const [nev, setNev] = useState("");
  const [lakcim, setLakcim] = useState("");
  const [email, setEmail] = useState("");
  const [adoszam, setAdoszam] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpCommon.get("/konyvek/profil", {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        });

        const { vevo_nev, email, lakcim, adoszam } = response.data;
        setNev(vevo_nev);
        setLakcim(lakcim || "");
        setEmail(email);
        setAdoszam(adoszam || "");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
console.log("AccessToken:", accessToken);

     if (accessToken) fetchData();
  }, [accessToken]);

  return (
    <>
    <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
      <div className='fodivprofil'>
        <h2>Profil</h2>
        <p>Név: {nev} <Button className='profilgomb'>Módosítás</Button> </p>
        
        {lakcim ? <p>L akcím: {lakcim} <Button className='profilgomb'>Módosítás</Button> </p> : ""}
        <p>E-mail: {email} <Button className='profilgomb'>Módosítás</Button> </p>
        
        {adoszam ? <p> Adószám: {adoszam} <Button className='profilgomb'>Módosítás</Button> </p> : ""}
        
      </div>
    </>
  );
}
