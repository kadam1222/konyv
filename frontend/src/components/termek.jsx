import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpCommon from "../http-common";
import "./termek.css"

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
  <div className="termek-page">
    <div className="termek-card">

      <div className="termek-image">
        <img
          src={`/kepek/${adatok.ISBN}.jpg`}
          alt={adatok.cim}
        />
      </div>

      <div className="termek-content">

        <a href="/" className="termek-vissza">← Vissza</a>

        <h1>{adatok.cim}</h1>
        <h4 className="szerzonevek">{adatok.szerzok}</h4>

        <p className="termek-leiras">
          { adatok.leiras ? adatok.leiras : "Nincs leírás"}
        </p>

        <div className="termek-meta">
          <span><strong>ISBN:</strong> {adatok.ISBN}</span>
          <span><strong>Borító:</strong> {adatok.borito_tipus}</span>
          <span><strong>Kiadó:</strong> {adatok.kiado_nev}</span>
          <span><strong>Nyelv:</strong> {adatok.nyelv_nev}</span>
          <span><strong>Kiadás éve:</strong> {adatok.kiadas_eve}</span>
          {adatok.illusztratorok ? <span><strong>Illusztrátor(ok):</strong> {adatok.illusztratorok}</span> : ""}
          {adatok.forditok ? <span><strong>Fordító(k):</strong> {adatok.forditok}</span> : ""}
        </div>

        <div className="termek-footer">
          <div className="termek-ar">{adatok.ar} Ft</div>
          <button className="termek-kosar"  onClick={() => {
                  const kosar = JSON.parse(localStorage.getItem("kosar")) || [];
                  const letezo = kosar.find(item => item.ISBN === adatok.ISBN);
                  if (letezo) {
                    letezo.mennyiseg += 1;
                  } else {
                    kosar.push({ ...adatok, mennyiseg: 1 });
                  }

                  localStorage.setItem("kosar", JSON.stringify(kosar));
                  window.dispatchEvent(new Event("storage"));
                }}>Kosárba</button>
        </div>

      </div>
    </div>
  </div>
);

}
