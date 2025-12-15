import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpCommon from "../http-common";

export default function Termek() {
  const { isbn } = useParams();
  const [adatok, setAdatok] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isbn) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await httpCommon.post("/konyvek/ISBN", {
          ISBN: isbn
        });

        if (mounted) {
          setAdatok(response.data);
        }
      } catch (err) {
        console.error("Termék betöltési hiba:", err);
        if (mounted) {
          setError("Nem sikerült betölteni a terméket.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [isbn]);


  if (loading) {
    return <p style={{ textAlign: "center" }}>Betöltés...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!adatok) {
    return <p style={{ textAlign: "center" }}>Nincs ilyen termék.</p>;
  }

  return (
    <div className="termek-container">
      <a href="/">Vissza</a>
      <h2>{adatok.cim}</h2>
      <img src={`/kepek/${adatok.ISBN}.jpg`}></img>
      <p><strong>Szerző(k):</strong> {adatok.szerzok}</p>
      <p>{adatok.leiras}</p>

      <div className="termek-meta">
        <p><strong>ISBN:</strong> {adatok.ISBN}</p>
        <p><strong>Borító:</strong> {adatok.borito_tipus}</p>
        <p><strong>Kiadó:</strong> {adatok.kiado_nev}</p>
        <p><strong>Nyelv:</strong> {adatok.nyelv_nev}</p>
        <p><strong>Kiadás éve:</strong> {adatok.kiadas_eve}</p>
        <p><strong>Ár:</strong> {adatok.ar} Ft</p>
      </div>
    </div>
  );
}
