import React, { useState, useEffect } from "react";
import httpCommon from "../http-common";

const MultiSelectDropdown = ({ label, options, selectedIds, onToggle, nameKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label><b>{label}</b></label>
            <div onClick={() => setIsOpen(!isOpen)} style={{ border: '1px solid #ccc', padding: '8px', cursor: 'pointer', backgroundColor: '#fff', minHeight: '35px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedIds.length === 0 ? "Válassz..." : `Kiválasztva: ${selectedIds.length} db`}
            </div>
            {isOpen && (
                <div style={{ position: 'absolute', zIndex: 10, backgroundColor: '#fff', border: '1px solid #ccc', width: '100%', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
                    {options.map(opt => (
                        <div key={opt.id} style={{ padding: '5px 10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => onToggle(opt.id)}>
                            <input type="checkbox" checked={selectedIds.includes(opt.id)} readOnly style={{ marginRight: '10px' }} />
                            {opt[nameKey]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function AdminAdatFelvetel({ accessToken, onSiker }) {
    const initialSate = {
        termekek: {
            cim: "", ISBN: "", kiado_id: "", nyelv_id: "", ar: "", 
            oldalak_szama: "", kiadas_eve: new Date().getFullYear(),
            kategoria_id: "", tipus_id: "", borito_id: "", illusztracio: "", leiras: ""
        },
        szerzoIds: [],
        fordito_ids: [],
        illusztrator_ids: []
    };
    
    const [ujKonyv, setUjKonyv] = useState(initialSate);

    const [options, setOptions] = useState({
        nyelvek: [], kiadok: [], boritok: [], illusztraciok: [],
        szerzok: [], illusztratorok: [], forditok: [], kategoriak: [], tipusok: []
    });

    useEffect(() => {
        const fetchAll = async () => {
            const endpoints = {
                nyelvek: 'nyelv', kiadok: 'kiadok', boritok: 'borito',
                illusztraciok: 'illusztracio', szerzok: 'szerzok',
                illusztratorok: 'illusztratorok', forditok: 'forditok',
                kategoriak: 'kategoria', tipusok: 'tipus'
            };
            const temp = {};
            for (const [key, url] of Object.entries(endpoints)) {
                const res = await httpCommon.get(`/konyvek/${url}`);
                temp[key] = res.data;
            }
            setOptions(temp);
        };
        if (accessToken) fetchAll();
    }, [accessToken]);


    const handleMultiToggle = (field, id) => {
        setUjKonyv(prev => {
            const currentList = prev[field];
            const newList = currentList.includes(id) ? currentList.filter(i => i !== id) : [...currentList, id];
            return { ...prev, [field]: newList };
        });
    };

    const handleSubmit = async () => {
        const tisztaAdatok = { ...ujKonyv };
        const szamMezok = ["kiado_id", "nyelv_id", "ar", "oldalak_szama", "kategoria_id", "tipus_id", "borito_id", "illusztracio"];
        
        szamMezok.forEach(mezo => {
            if (tisztaAdatok.termekek[mezo] === "" || tisztaAdatok.termekek[mezo] === undefined) {
                tisztaAdatok.termekek[mezo] = null;
            } else {
                tisztaAdatok.termekek[mezo] = Number(tisztaAdatok.termekek[mezo]);
            }
        });

        try {
            await httpCommon.post("/konyvek/adatHozzaad", tisztaAdatok, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            alert("Könyv sikeresen felvéve!");
            setUjKonyv(initialSate);
        } catch (err) {
            console.error("Backend hiba:", err.response?.data || err.message);
            alert("Hiba történt! Ellenőrizd a konzolt.");
        }
    };

    const handleFieldChange = (field, value) => {
    // Listázzuk ki, mely mezőknek KELL számnak lenniük az adatbázisban
    const szamMezok = ["kiado_id", "nyelv_id", "ar", "oldalak_szama", "kategoria_id", "tipus_id", "borito_id", "illusztracio"];

    let veglegesErtek = value;

    if (szamMezok.includes(field)) {
        // Ha üres, legyen null, egyébként alakítsuk számmá
        veglegesErtek = value === "" ? null : Number(value);
    }

    setUjKonyv(prev => ({
        ...prev,
        termekek: { ...prev.termekek, [field]: veglegesErtek }
    }));
};
    const [borito, setBorito] = useState("");
    const [kiado, setKiado] = useState("");
    const [szerzo, setSzerzo] = useState("");
    const [fordito, setFordito] = useState("");
    const [illusztracio, setIllusztracio] = useState("");
    const [illusztrator, setIllusztrator] = useState("");
    const [nyelv, setNyelv] = useState("");
    const [kategoriaLista, setKategoriaLista] = useState([]);
    const [kategoria, setKategoria] = useState("");
    const [fokat, setFokat] = useState("");



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

    const kategoriaMentes = async () => {
        if (!kategoria) return alert("A kategória neve nem lehet üres!");
        try {
            const payload = {
                kat_nev: kategoria,
                katazon: fokat === "" ? null : Number(fokat) 
            };

            await httpCommon.post("/konyvek/adatHozzaad", payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            alert("Kategória mentve!");
            setKategoria("");
            setFokat("");
            fetchKategoriak(); 
            if (onSiker) onSiker(); 
        } catch (err) {
            alert("Hiba történt a mentés során!");
        }
    };

    const fetchKategoriak = async () => {
        try {
            const response = await httpCommon.get("/konyvek/kategoria");
            setKategoriaLista(response.data);
        } catch (err) {
            console.error("Hiba a kategóriák betöltésekor:", err);
        }
    };

    useEffect(() => {
        fetchKategoriak();
    }, []);

    return (
        <>
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

            <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #28a745", backgroundColor: "#f9fff9" }}>
                <h4>Új kategória felvétele</h4>
                
                <div style={{ marginBottom: "10px" }}>
                    <label>Kategória neve: </label>
                    <input 
                        placeholder="pl. Sci-fi" 
                        value={kategoria} 
                        onChange={(e) => setKategoria(e.target.value)} 
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Főkategória (ha alkategóriát hozol létre): </label>
                    <select value={fokat} onChange={(e) => setFokat(e.target.value)}>
                        <option value="">Nincs (Ez egy főkategória lesz)</option>
                        {kategoriaLista.map(kat => (
                            <option key={kat.id} value={kat.id}>
                                {kat.kat_nev} (ID: {kat.id})
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    style={{ backgroundColor: "#28a745", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
                    onClick={kategoriaMentes}
                >
                    Kategória mentése
                </button>
            </div>
        </div>

        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", border: "1px solid #ccc" }}>
            <h2>Új könyv hozzáadása</h2>

            <input style={s.input} placeholder="ISBN" value={ujKonyv.termekek.ISBN} onChange={e => handleFieldChange("ISBN", e.target.value)} />
            <input style={s.input} placeholder="Cím" value={ujKonyv.termekek.cim} onChange={e => handleFieldChange("cim", e.target.value)} />
            <input style={s.input} type="number" placeholder="Ár" value={ujKonyv.termekek.ar} onChange={e => handleFieldChange("ar", e.target.value)} />
            <input style={s.input} type="number" placeholder="Oldalak száma" value={ujKonyv.termekek.oldalak_szama} onChange={e => handleFieldChange("oldalak_szama", e.target.value)} />

            <div style={s.row}>
                <label>Nyelv: </label>
                <select value={ujKonyv.termekek.nyelv_id} onChange={e => handleFieldChange("nyelv_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.nyelvek.map(ny => <option key={ny.id} value={ny.id}>{ny.nyelv_nev}</option>)}
                </select>
            </div>

            <div style={s.row}>
                <label>Kiadó: </label>
                <select value={ujKonyv.termekek.kiado_id} onChange={e => handleFieldChange("kiado_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.kiadok.map(k => <option key={k.id} value={k.id}>{k.kiado_nev}</option>)}
                </select>
            </div>

            <div style={s.row}>
                <label>Kategória: </label>
                <select value={ujKonyv.termekek.kategoria_id} onChange={e => handleFieldChange("kategoria_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.kategoriak.map(k => <option key={k.id} value={k.id}>{k.kat_nev}</option>)}
                </select>
            </div>

            <div style={s.row}>
                <label>Borító: </label>
                <select value={ujKonyv.termekek.borito_id} onChange={e => handleFieldChange("borito_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.boritok.map(b => <option key={b.id} value={b.id}>{b.borito_nev}</option>)}
                </select>
            </div>

            <div style={s.row}>
                <label>Típus: </label>
                <select value={ujKonyv.termekek.tipus_id} onChange={e => handleFieldChange("tipus_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.tipusok.map(t => <option key={t.id} value={t.id}>{t.tipus_nev}</option>)}
                </select>
            </div>
            
            <div style={s.row}>
                <label>Illusztráció típusa: </label>
                <select 
                    value={ujKonyv.termekek.illusztracio || ""} 
                    onChange={e => handleFieldChange("illusztracio", e.target.value)}
                >
                    <option value="">Nincs / Nem ismert</option>
                    {options.illusztraciok.map(i => (
                        <option key={i.id} value={i.id}>
                            {i.illusztracio}
                        </option>
                    ))}
                </select>
            </div>

            <MultiSelectDropdown label="Szerzők:" options={options.szerzok} selectedIds={ujKonyv.szerzoIds} nameKey="szerzo_nev" onToggle={id => handleMultiToggle("szerzoIds", id)} />
            <MultiSelectDropdown label="Fordítók:" options={options.forditok} selectedIds={ujKonyv.fordito_ids} nameKey="fordito_nev" onToggle={id => handleMultiToggle("fordito_ids", id)} />
            <MultiSelectDropdown label="Illusztrátorok:" options={options.illusztratorok} selectedIds={ujKonyv.illusztrator_ids} nameKey="illusztrator" onToggle={id => handleMultiToggle("illusztrator_ids", id)} />

            <textarea style={{ width: "100%", height: "80px" }} placeholder="Leírás..." value={ujKonyv.termekek.leiras} onChange={e => handleFieldChange("leiras", e.target.value)} />

            <button style={s.submitBtn} onClick={handleSubmit}>KÖNYV RÖGZÍTÉSE</button>
        </div>
    </>
    );
}

const s = {
    input: { display: "block", width: "100%", marginBottom: "10px", padding: "8px" },
    row: { marginBottom: "10px", display: "flex", justifyContent: "space-between" },
    submitBtn: { width: "100%", padding: "12px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }
};