import { useState, useEffect } from 'react';
import httpCommon from '../http-common';

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
    <div>
      <h2>Profil</h2>
      <p>Név: {nev}</p>
      <p>Lakcím: {lakcim}</p>
      <p>E-mail: {email}</p>
      <p>Adószám: {adoszam}</p>
    </div>
  );
}
