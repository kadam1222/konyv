import React, { useState } from "react";
import httpCommon from "../http-common";

export default function AdminAdatFelvetel({ accessToken, onSiker }) {
    // Külön state-ek a mezőknek
    const [borito, setBorito] = useState("");
    const [kiado, setKiado] = useState("");
    const [szerzo, setSzerzo] = useState("");
    const [fordito, setFordito] = useState("");
    const [illusztracio, setIllusztracio] = useState("");
    const [illusztrator, setIllusztrator] = useState("");
    const [nyelv, setNyelv] = useState("");
    const [kategoria, setKategoria] = useState("");
    const [fokat, setFokat] = useState("");

    // Közös mentő függvény
    const mentés = async (kulcs, ertek, setter) => {
        if (!ertek) return alert("Üres mező!");
        try {
            await httpCommon.post("/konyvek/adatHozzaad", { [kulcs]: ertek }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            alert("Sikeres mentés!");
            setter("");
            if (onSiker) onSiker(); 
        } catch (err) {
            alert("Hiba történt!");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Gyors adatfelvétel</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>Új borító felvétele: </label>
                <input 
                    placeholder="pl. keménytáblás" 
                    value={borito}
                    onChange={(e) => setBorito(e.target.value)} 
                />
                <button onClick={() => mentés("borito", borito, setBorito)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új kiadó felvétele: </label>
                <input 
                    placeholder="pl. Európa Kiadó" 
                    value={kiado}
                    onChange={(e) => setKiado(e.target.value)} 
                />
                <button onClick={() => mentés("kiado", kiado, setKiado)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új szerző felvétele: </label>
                <input 
                    placeholder="pl. J.K. Rowling" 
                    value={szerzo}
                    onChange={(e) => setSzerzo(e.target.value)} 
                />
                <button onClick={() => mentés("szerzo", szerzo, setSzerzo)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új fordító felvétele: </label>
                <input 
                    placeholder="pl. Acsai Roland" 
                    value={fordito}
                    onChange={(e) => setFordito(e.target.value)} 
                />
                <button onClick={() => mentés("fordito", fordito, setFordito)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új illusztráció felvétele: </label>
                <input 
                    placeholder="pl. Színes Képekkel, Fotókkal" 
                    value={illusztracio}
                    onChange={(e) => setIllusztracio(e.target.value)} 
                />
                <button onClick={() => mentés("illusztracio", illusztracio, setIllusztracio)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új Illusztrátor felvétele: </label>
                <input 
                    placeholder="pl. Alice Oseman" 
                    value={illusztrator}
                    onChange={(e) => setIllusztrator(e.target.value)} 
                />
                <button onClick={() => mentés("illusztrator", illusztrator, setIllusztrator)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új nyelv felvétele: </label>
                <input 
                    placeholder="pl. Magyar" 
                    value={nyelv}
                    onChange={(e) => setNyelv(e.target.value)} 
                />
                <button onClick={() => mentés("nyelv", nyelv, setNyelv)}>Hozzáad</button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Új kategória felvétele: </label>
                <input 
                    placeholder="pl. Magyar" 
                    value={nyelv}
                    onChange={(e) => setNyelv(e.target.value)} 
                />
                <button onClick={() => mentés("nyelv", nyelv, setNyelv)}>Hozzáad</button>
            </div>
        </div>
    );
}