import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';
import "./adminujadat.css"
import { Form, InputGroup } from "react-bootstrap";

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
    const uploadImage = async (isbnValue) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        await httpCommon.post(`/upload/${isbnValue}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log("Kép sikeresen feltöltve.");
    } catch (err) {
        console.error("Képfeltöltési hiba:", err);
        throw new Error("A könyv mentve, de a kép feltöltése sikertelen volt.");
    }
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
            setSelectedFile(file);
            setMessage("Kép kiválasztva.");
        } else {
            setMessage("Hiba: Csak .jpg formátum engedélyezett!");
            e.target.value = null;
            setSelectedFile(null);
        }
    }
};

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
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
        if (!ujKonyv.termekek.ISBN) return alert("Az ISBN megadása kötelező!");
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
            await httpCommon.post("/admin/adatHozzaad", tisztaAdatok, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (selectedFile) {
            await uploadImage(ujKonyv.termekek.ISBN);
        }
            alert("Könyv sikeresen felvéve!");
            setUjKonyv(initialSate);
        } catch (err) {
            console.error("Backend hiba:", err.response?.data || err.message);
            alert("Hiba történt! Ellenőrizd a konzolt.");
        }
    };

    const handleFieldChange = (field, value) => {
    const szamMezok = ["kiado_id", "nyelv_id", "ar", "oldalak_szama", "kategoria_id", "tipus_id", "borito_id", "illusztracio"];

    let veglegesErtek = value;

    if (szamMezok.includes(field)) {
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
            await httpCommon.post("/admin/adatHozzaad", { [kulcs]: ertek }, {
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

            await httpCommon.post("/admin/adatHozzaad", payload, {
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
        <div id="fohozzadasdiv">
        <div className="admin-card quick-add" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2 className="admin-title">Gyors adatfelvétel</h2>
            <div className="quick-list">

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új borító felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. keménytáblás" value={borito}onChange={(e) => setBorito(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("borito", borito, setBorito)}>Hozzáad</Button>
                </div>
                
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új kiadó felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. Európa Kiadó" value={kiado} onChange={(e) => setKiado(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("kiado", kiado, setKiado)}>Hozzáad</Button>
                </div>
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új szerző felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. J.K. Rowling"  value={szerzo} onChange={(e) => setSzerzo(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("szerzo", szerzo, setSzerzo)}>Hozzáad</Button>
                </div>
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új fordító felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. Acsai Roland" value={fordito} onChange={(e) => setFordito(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("fordito", fordito, setFordito)}>Hozzáad</Button>
                </div>
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új illusztráció felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. Színes Képekkel, Fotókkal" value={illusztracio} onChange={(e) => setIllusztracio(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("illusztracio", illusztracio, setIllusztracio)}>Hozzáad</Button>
                </div>
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új illusztrátor felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. Alice Oseman" value={illusztrator} onChange={(e) => setIllusztrator(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("illusztrator", illusztrator, setIllusztrator)}>Hozzáad</Button>
                </div>
            </div>

            <div className="quick-input-group" style={{ marginBottom: "15px" }}>
                <label className="quick-label">Új nyelv felvétele: </label>
                <div className="custom-input-group">
                    <input className="quick-input" placeholder="pl. Magyar" value={nyelv} onChange={(e) => setNyelv(e.target.value)} />
                    <Button className="quick-add-btn" variant="success" onClick={() => mentés("nyelv", nyelv, setNyelv)}>Hozzáad</Button>
                </div>
            </div>

            <div className="category-divider">
                <h4>Új kategória felvétele</h4>
                
                <div style={{ marginBottom: "10px" }}>
                    <label>Kategória neve: </label>
                    <input 
                        className="quick-input w-100 mb-2"
                        placeholder="pl. Sci-fi" 
                        value={kategoria} 
                        onChange={(e) => setKategoria(e.target.value)} 
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Főkategória (ha alkategóriát hozol létre): </label>
                    <select className="quick-input w-100 mb-2" style={{width:"240px"}} value={fokat} onChange={(e) => setFokat(e.target.value)}>
                        <option value="">Nincs (Ez egy főkategória lesz)</option>
                        {kategoriaLista.map(kat => (
                            <option key={kat.id} value={kat.id}>
                                {kat.kat_nev} (ID: {kat.id})
                            </option>
                        ))}
                    </select>
                </div>

                <Button className="category-save-btn" variant="success" onClick={kategoriaMentes}>Kategória mentése</Button>
                </div>
            </div>
        </div>

        <div className="admin-card book-add">
            <h2 className="admin-title">Új könyv hozzáadása</h2>
            
            <div className="book-form-grid">
            
                <div className="form-group span-2">
                    <label>Könyv címe</label>
                    <input className="book-input title-input" placeholder="Cím" value={ujKonyv.termekek.cim} onChange={e => handleFieldChange("cim", e.target.value)} />
                </div>

                <div className="form-group">
                    <label>ISBN azonosító</label>
                    <input className="book-input" placeholder="ISBN" value={ujKonyv.termekek.ISBN} onChange={e => handleFieldChange("ISBN", e.target.value)} />
                </div>
                
                <div className="form-group">
                    <label>Ár (Ft)</label>
                    <input className="book-input" type="number" placeholder="Ár" value={ujKonyv.termekek.ar} onChange={e => handleFieldChange("ar", e.target.value)} />
                </div>
            
                <div className="form-group">
                    <label>Oldalak száma</label>
                    <input className="bemenőadat" type="number" placeholder="Oldalak száma" value={ujKonyv.termekek.oldalak_szama} onChange={e => handleFieldChange("oldalak_szama", e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Kiadás éve</label>
                    <input  className="book-input"  type="number"  value={ujKonyv.termekek.kiadas_eve} onChange={e => handleFieldChange("kiadas_eve", e.target.value)}  />
                </div>        
            

            <div className="form-group" >
                <label>Nyelv: </label>
                <select className="book-input" value={ujKonyv.termekek.nyelv_id} onChange={e => handleFieldChange("nyelv_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.nyelvek.map(ny => <option key={ny.id} value={ny.id}>{ny.nyelv_nev}</option>)}
                </select>
            </div>

            <div className="form-group" >
                <label>Kiadó: </label>
                <select className="book-input" value={ujKonyv.termekek.kiado_id} onChange={e => handleFieldChange("kiado_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.kiadok.map(k => <option key={k.id} value={k.id}>{k.kiado_nev}</option>)}
                </select>
            </div>

            <div className="form-group" >
                <label>Kategória: </label>
                <select className="book-input" value={ujKonyv.termekek.kategoria_id} onChange={e => handleFieldChange("kategoria_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.kategoriak.map(k => <option key={k.id} value={k.id}>{k.kat_nev}</option>)}
                </select>
            </div>

            <div className="form-group" >
                <label>Borító: </label>
                <select className="book-input" value={ujKonyv.termekek.borito_id} onChange={e => handleFieldChange("borito_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.boritok.map(b => <option key={b.id} value={b.id}>{b.borito_nev}</option>)}
                </select>
            </div>

            <div className="form-group" >
                <label>Típus: </label>
                <select className="book-input" value={ujKonyv.termekek.tipus_id} onChange={e => handleFieldChange("tipus_id", e.target.value)}>
                    <option value="">Válassz...</option>
                    {options.tipusok.map(t => <option key={t.id} value={t.id}>{t.tipus_nev}</option>)}
                </select>
            </div>
            
            <div className="form-group" >
                <label>Illusztráció típusa: </label>
                <select className="book-input" value={ujKonyv.termekek.illusztracio || ""} onChange={e => handleFieldChange("illusztracio", e.target.value)}>
                    <option value="">Nincs / Nem ismert</option>
                    {options.illusztraciok.map(i => (
                        <option key={i.id} value={i.id}>
                            {i.illusztracio}
                        </option>
                    ))}
                </select>
            </div>
            </div>

            <div className="multi-select-container">
                <MultiSelectDropdown label="Szerzők:" options={options.szerzok} selectedIds={ujKonyv.szerzoIds} nameKey="szerzo_nev" onToggle={id => handleMultiToggle("szerzoIds", id)} />
                <MultiSelectDropdown label="Fordítók:" options={options.forditok} selectedIds={ujKonyv.fordito_ids} nameKey="fordito_nev" onToggle={id => handleMultiToggle("fordito_ids", id)} />
                <MultiSelectDropdown label="Illusztrátorok:" options={options.illusztratorok} selectedIds={ujKonyv.illusztrator_ids} nameKey="illusztrator" onToggle={id => handleMultiToggle("illusztrator_ids", id)} />
            </div>
            
            <div className="form-group mt-3">
                <label>Rövid leírás / Fülszöveg</label>
                <textarea className="book-input textarea-input" style={{ width: "100%", height: "80px" }} placeholder="Leírás..." value={ujKonyv.termekek.leiras} onChange={e => handleFieldChange("leiras", e.target.value)} />
            </div>

            
                <div className="upload-section">
                    <label className="upload-label">Borítókép feltöltése (csak .jpg)</label>

                    <div className="upload-controls">
                        <input 
                            type="file" 
                            accept=".jpg,.jpeg" 
                            onChange={handleFileChange} 
                            className="file-input-custom"
                        />
                        {message && <span className={`upload-msg ${message.includes("Hiba") ? "err" : "succ"}`}>{message}</span>}
                    </div>
                </div>

                    <button className="main-submit-btn" variant="success" onClick={handleSubmit}>Könyv rögzítése</button>
                </div>
        </div>
    );
}