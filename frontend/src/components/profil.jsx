import { useState, useEffect } from 'react';
import httpCommon from '../http-common';
import "./profil.css"
import Button from 'react-bootstrap/Button';
import { IoPersonSharp } from "react-icons/io5";

export default function Profil({ accessToken , setAccessToken}) {
  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [modositNev, setModositNev] = useState(true);
  const [modositEmail, setModositEmail] = useState(true);
  const [ujnev, setUjnev] = useState("");
  const [ujemail,setUjemail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpCommon.get("/konyvek/profil", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setNev(response.data.vevo_nev);
        setEmail(response.data.email);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (accessToken) fetchData();
  }, [accessToken]);

    const modositas = async () => {
      try {
       const response = await httpCommon.put(
          "/konyvek/modosit",
          {
            felhasznalonev: ujnev.trim() !== "" ? ujnev : nev,
            valtoztatemail: ujemail.trim() !== "" ? ujemail : email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          
        );

        await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        
        setAccessToken("");
       window.location.href = "/";
        setNev("");
        setEmail("");
        setUjnev("");
        setUjemail("");
        setModositNev(true);
        setModositEmail(true);

      } catch (error) {
        console.error("Sikertelen módosítás:", error);
      }
    };
  return (
    <div className="profil-container">
      <a href='/' className="termek-vissza" style={{ textDecoration:"none", fontSize:"16px" }} >← Vissza a főoldalra</a>
      
      <div className='profil-card'>
        <div className="profil-header">
          <div className="avatar-circle"><IoPersonSharp /> </div>
          <h2>Felhasználói Profil</h2>
        </div>

        <div className="profil-body">
          <div className="info-group">
            <label>Teljes név</label>
            {modositNev ? (
              <div className="display-row"> <span>{nev}</span> <Button className="profilgomb" onClick={() => setModositNev(false)}>Módosítás</Button> </div>
            ) : (
              <div className="input-row">
                <input type='text' value={ujnev} placeholder={nev} onChange={(e) => setUjnev(e.target.value)}/>
                <div className="action-btns">
                  <Button className="profilgomb mentés" onClick={modositas}>Mentés</Button>
                  <Button className="profilgomb mégse" onClick={() => { setModositNev(true); setUjnev(""); }}>Mégse</Button>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="info-group">
            <label>Email cím</label>
            {modositEmail ? (
              <div className="display-row"> <span>{email}</span> <Button className="profilgomb" onClick={() => setModositEmail(false)}>Módosítás</Button></div>
            ) : (
              <div className="input-row">
                <input type='text' value={ujemail} placeholder={email} onChange={(e) => setUjemail(e.target.value)} />
                <div className="action-btns">
                  <Button className="profilgomb mentés" onClick={modositas}>Mentés</Button>
                  <Button className="profilgomb mégse" onClick={() => { setModositEmail(true); setUjemail(""); }}>Mégse</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
