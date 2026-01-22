import { useState, useEffect } from 'react';
import httpCommon from '../http-common';
import "./profil.css"
import Button from 'react-bootstrap/Button';

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
        const { token, user  } = response.data;
        if (token) setAccessToken(token);
        if (user) {
              setNev(user.vevo_nev);
              setEmail(user.email);
            } else {
              setNev(ujnev.trim() !== "" ? ujnev : nev);
              setEmail(ujemail.trim() !== "" ? ujemail : email);
            }
        setUjnev("");
        setUjemail("");
        setModositNev(true);
        setModositEmail(true);

      } catch (error) {
        console.error("Sikertelen módosítás:", error);
      }
    };
  return (
    <>
    <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
      <div className='fodivprofil'>
        <h2>Profil</h2>
        {modositNev ? <p>Név: {nev} <Button className='profilgomb' onClick={() => setModositNev(!modositNev) }>Módosítás</Button></p>: 
        <p>Név:<input type='text' value={ujnev}  placeholder={nev} onChange={(e) => setUjnev(e.target.value)}/> <Button className='profilgomb' onClick={modositas }>Módosítás</Button> </p>
        }
        {modositEmail ? <p>Email: {email} <Button className='profilgomb' onClick={() => setModositEmail(!modositEmail) }>Módosítás</Button></p>: 
        <p>Email:<input type='text' value={ujemail} placeholder={email} onChange={(e) => setUjemail(e.target.value)}/> <Button className='profilgomb' onClick={modositas}>Módosítás</Button> </p>
        }
        
      </div>
    </>
  );
}
