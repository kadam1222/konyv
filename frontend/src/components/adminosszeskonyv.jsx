import { useState, useEffect, useCallback, useRef } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';
import "./rendelesek.css";
import "./adminosszeskonyv.css";

export default function AdminBook({ accessToken }) {
    const [osszesKonyv, setOsszesKonyv] = useState([]);
    const [showInput, setShowInput] = useState({});
    const [editedKonyvek, setEditedKonyvek] = useState({});
    

    const [nyelvek, setNyelvek] = useState([]);
    const [kiado, setKiado] = useState([]);
    const [borito, setBorito] = useState([]);
    const [illusztráció, setIllusztráció] = useState([]);
    const [szerzok, setSzerzok] = useState([]);
    const [illusztrátorok, setIllusztrátorok] = useState([]);
    const [forditok, setForditok] = useState([]);
    const [kategoria, setKategoria] = useState([]);
    const [tipus, setTipus] = useState([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const observerRef = useRef();

    useEffect(() => {
        const fetchEverything = async () => {
            if (!accessToken) return;
            setLoading(true);
            let allFetchedBooks = [];
            let currentPage = 1;
            let keepFetching = true;

            try {
                while (keepFetching) {
                    const response = await httpCommon.get(`/admin/adminosszeskonyv?page=${currentPage}&limit=10`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    const data = response.data;

                    if (data && data.length > 0) {
                        allFetchedBooks = [...allFetchedBooks, ...data];
                        if (data.length < 10) {
                            keepFetching = false;
                        } else {
                            currentPage++;
                        }
                    } else {
                        keepFetching = false;
                    }
                }
                const uniqueBooks = Array.from(new Map(allFetchedBooks.map(item => [item.ISBN, item])).values());
                setOsszesKonyv(uniqueBooks);

            } catch (err) {
                console.error("Hiba a teljes lista letöltésekor:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEverything();
    }, [accessToken]);


    useEffect(() => {
        if (accessToken) {
            const Fetchmodositas = async (endpoint, setter) => {
                try {
                    const response = await httpCommon.get(`/konyvek/${endpoint}`);
                    setter(response.data);
                } catch (err) { console.error(`Error fetching ${endpoint}:`, err); }
            };

            Fetchmodositas('nyelv', setNyelvek);
            Fetchmodositas('kiadok', setKiado);
            Fetchmodositas('borito', setBorito);
            Fetchmodositas('illusztracio', setIllusztráció);
            Fetchmodositas('szerzok', setSzerzok);
            Fetchmodositas('illusztratorok', setIllusztrátorok);
            Fetchmodositas('forditok', setForditok);
            Fetchmodositas('kategoria', setKategoria);
            Fetchmodositas('tipus', setTipus);
        }
    }, [accessToken]);


    const handleToggleInput = (isbn, konyv) => {
        setShowInput(prev => ({ ...prev, [isbn]: !prev[isbn] }));

        if (!editedKonyvek[isbn]) {
            const getIdsFromNames = (nameString, allOptions, nameKey) => {
                if (!nameString) return [];
                return nameString.split(',').map(n => n.trim())
                    .map(name => allOptions.find(opt => opt[nameKey] === name)?.id)
                    .filter(id => id !== undefined);
            };

            setEditedKonyvek(prev => ({
                ...prev,
                [isbn]: { 
                    ...konyv,
                    nyelv_id: nyelvek.find(ny => ny.nyelv_nev === konyv.nyelv_nev)?.id || "",
                    kiado_id: kiado.find(k => k.kiado_nev === konyv.kiado_nev)?.id || "",
                    borito_id: borito.find(b => b.borito_nev === konyv.borito_tipus)?.id || "",
                    kategoria_id: kategoria.find(k => k.kat_nev === konyv.kat_nev)?.id || "",
                    tipus_id: tipus.find(t => t.tipus_nev === konyv.tipus_nev)?.id || "",
                    illusztracio: illusztráció.find(i => i.illusztracio === konyv.illusztracio_leiras)?.id || "",
                    szerzo_ids: getIdsFromNames(konyv.szerzok, szerzok, "szerzo_nev"),
                    fordito_ids: getIdsFromNames(konyv.forditok, forditok, "fordito_nev"),
                    illusztrator_ids: getIdsFromNames(konyv.illusztratorok, illusztrátorok, "illusztrator"),
                    leiras: konyv.leiras || ""
                }
            }));
        }
    };

    const handleChange = (isbn, field, value) => {
        setEditedKonyvek(prev => ({
            ...prev,
            [isbn]: { ...prev[isbn], [field]: value }
        }));
    };

    const toggleSelection = (isbn, field, id) => {
        setEditedKonyvek(prev => {
            const currentList = prev[isbn][field] || [];
            const newList = currentList.includes(id) ? currentList.filter(item => item !== id) : [...currentList, id];
            return { ...prev, [isbn]: { ...prev[isbn], [field]: newList } };
        });
    };

    const konyvTorles = async (ISBN) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a könyvet?")) return;
        try {
            await httpCommon.delete("/admin/konyvtorol", {
                data: { ISBN },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setOsszesKonyv(prev => prev.filter(k => k.ISBN !== ISBN));
        } catch (err) { console.error(err); }
    };

    const konyvmodositas = async (ISBN) => {
        const edited = editedKonyvek[ISBN];
        if (!edited) return;
        try {
            const { tipus_nev, nyelv_nev, kiado_nev, borito_tipus, kat_nev, illusztracio_leiras, szerzok, forditok, fordítok, illusztratorok, szerzo_ids, illusztrator_ids, fordito_ids, ...tisztaAdatok } = edited;
            
            const payload = { 
                REGIISBN: ISBN, 
                ...tisztaAdatok, 
                illusztracio: tisztaAdatok.illusztracio === "" ? null : tisztaAdatok.illusztracio,
                szerzo_ids: szerzo_ids || [], 
                illusztrator_ids: illusztrator_ids || [], 
                fordito_ids: fordito_ids || [] 
            };

            await httpCommon.put("/admin/konyvmodositas", payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            alert("Sikeres módosítás!");
            setShowInput(prev => ({ ...prev, [ISBN]: false }));

            window.location.reload(); 
        } catch (err) {
            console.error("Hiba:", err);
            alert("Hiba történt a módosítás során.");
        }
    };

    const filteredKonyvek = osszesKonyv.filter((K) => {
        const term = searchTerm.toLowerCase();
        return (
            (K.cim?.toLowerCase() || "").includes(term) ||
            (K.ISBN?.toString() || "").includes(term) ||
            (K.szerzok?.toLowerCase() || "").includes(term)
        );
    });

    return (
        <>
            <div style={{ position: "sticky", top: 70, backgroundColor: "#f4f4f4", padding: "15px", zIndex: 100, borderBottom: "2px solid #ddd", marginBottom: "20px" }}>
                <input type="text" placeholder="Keresés cím, ISBN vagy szerző alapján..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }} />
                <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
                    Találatok (betöltött): {filteredKonyvek.length} db
                </p>
            </div>

            {filteredKonyvek.map((K, index) => {
                const isLastElement = filteredKonyvek.length === index + 1;
                return (
                    <div className="order" key={K.ISBN} ref={isLastElement ? lastItemRef : null} style={{ marginBottom: "20px" }}>
                        <span style={{ marginBottom: "10px" }}>
                            Cím: {K.cim}<br />
                            ISBN: {K.ISBN} <br />
                            Nyelv: {K.nyelv_nev} <br />
                            Kiadó: {K.kiado_nev} <br />
                            Borító: {K.borito_tipus} <br />
                            Kategória: {K.kat_nev} <br />
                            Ár: {K.ar} Ft<br />
                            Illusztráció: {K.illusztracio_leiras} <br />
                            Leírás: {K.leiras ? K.leiras.substring(0, 100) + '...' : 'Nincs leírás'} <br />
                            Szerzők: {K.szerzok} <br />
                            Típus: {K.tipus_nev} <br />
                            Raktáron: {K.raktar}
                            {K.fordítok && `Fordítók: ${K.fordítok}`} <br />
                            {K.illusztratorok && `Illusztrátorok: ${K.illusztratorok}`}

                        </span>

                        <div style={{ marginTop: "15px" }}>
                            <Button variant="danger" style={{ marginRight: "15px" }} onClick={() => konyvTorles(K.ISBN)}>Könyv törlése</Button>
                            <Button variant="primary" onClick={() => handleToggleInput(K.ISBN, K)}>Könyv módosítása</Button>
                        </div>

                        {showInput[K.ISBN] && editedKonyvek[K.ISBN] && (
                            <div className="edit-form-container" style={{ marginTop: "20px", padding: "15px", borderTop: "1px dashed #ccc" }}>
                                <div className="order">
                                    <input className="adminosszesinputok" placeholder="ISBN" value={editedKonyvek[K.ISBN].ISBN} onChange={(e) => handleChange(K.ISBN, "ISBN", e.target.value)} />
                                    <input className="adminosszesinputok" placeholder="Cím" value={editedKonyvek[K.ISBN].cim} onChange={(e) => handleChange(K.ISBN, "cim", e.target.value)} />
                                    <input className="adminosszesinputok" placeholder="Ár" value={editedKonyvek[K.ISBN].ar} onChange={(e) => handleChange(K.ISBN, "ar", e.target.value)} /> Ft
                                </div>

                                <div className="order">
                                    <label><strong>Nyelv:</strong></label>
                                    <select value={editedKonyvek[K.ISBN].nyelv_id || ""} onChange={(e) => handleChange(K.ISBN, "nyelv_id", e.target.value)}>
                                        {nyelvek.map(ny => <option key={ny.id} value={ny.id}>{ny.nyelv_nev}</option>)}
                                    </select>
                                </div>

                                <div className="order">
                                    <label><strong>Kiadó:</strong></label>
                                    <select value={editedKonyvek[K.ISBN].kiado_id || ""} onChange={(e) => handleChange(K.ISBN, "kiado_id", e.target.value)}>
                                        {kiado.map(k => <option key={k.id} value={k.id}>{k.kiado_nev}</option>)}
                                    </select>
                                </div>

                                <div className="order">
                                    <label><strong>Borító:</strong></label>
                                    <select value={editedKonyvek[K.ISBN].borito_id || ""} onChange={(e) => handleChange(K.ISBN, "borito_id", e.target.value)}>
                                        {borito.map(b => <option key={b.id} value={b.id}>{b.borito_nev}</option>)}
                                    </select>
                                </div>

                                <div className="order">
                                    <label><strong>Kategória:</strong></label>
                                    <select value={editedKonyvek[K.ISBN].kategoria_id || ""} onChange={(e) => handleChange(K.ISBN, "kategoria_id", e.target.value)}>
                                        {kategoria.map(k => <option key={k.id} value={k.id}>{k.kat_nev}</option>)}
                                    </select>
                                </div>

                                <div className="order">
                                    <label><strong>Típus:</strong></label>
                                    <select value={editedKonyvek[K.ISBN].tipus_id || ""} onChange={(e) => handleChange(K.ISBN, "tipus_id", e.target.value)}>
                                        {tipus.map(t => <option key={t.id} value={t.id}>{t.tipus_nev}</option>)}
                                    </select>
                                </div>

                                <div className="order">
                                    <label><strong>Raktáron:</strong></label>
                                    <input type="number" value={editedKonyvek[K.ISBN].raktar} min={0} onChange={(e)=> handleChange(K.ISBN, "raktar", e.target.value)}></input>
                                </div>

                                <div className="order">
                                    <label><strong>Leírás:</strong></label>
                                    <textarea style={{ width: "100%", minHeight: "100px" }} value={editedKonyvek[K.ISBN].leiras || ""} onChange={(e) => handleChange(K.ISBN, "leiras", e.target.value)} />
                                </div>

                                <MultiSelectDropdown label="Szerzők:" options={szerzok} selectedIds={editedKonyvek[K.ISBN].szerzo_ids || []} nameKey="szerzo_nev" onToggle={(id) => toggleSelection(K.ISBN, "szerzo_ids", id)} />
                                <MultiSelectDropdown label="Illusztrátorok:" options={illusztrátorok} selectedIds={editedKonyvek[K.ISBN].illusztrator_ids || []} nameKey="illusztrator" onToggle={(id) => toggleSelection(K.ISBN, "illusztrator_ids", id)} />
                                <MultiSelectDropdown label="Fordítók:" options={forditok} selectedIds={editedKonyvek[K.ISBN].fordito_ids || []} nameKey="fordito_nev" onToggle={(id) => toggleSelection(K.ISBN, "fordito_ids", id)} />

                                <Button variant="success" className="mt-3" onClick={() => konyvmodositas(K.ISBN)}>Módosítás mentése</Button>
                            </div>
                        )}
                    </div>
                );
            })}

            {loading && <p style={{ textAlign: "center", padding: "20px" }}><b>Könyvek betöltése...</b></p>}
            {!hasMore && <p style={{ textAlign: "center", color: "gray", padding: "20px" }}>Nincs több megjeleníthető könyv.</p>}
        </>
    );
}

const MultiSelectDropdown = ({ label, options, selectedIds, onToggle, nameKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="order" style={{ position: 'relative', marginBottom: '10px' }}>
            <label><b>{label}</b></label>
            <div onClick={() => setIsOpen(!isOpen)} style={{ border: '1px solid #ccc', padding: '8px', cursor: 'pointer', backgroundColor: '#fff', minHeight: '35px' }}>
                {selectedIds.length === 0 ? "Válassz..." : `Kiválasztva: ${selectedIds.length} db`}
            </div>
            {isOpen && (
                <div style={{ position: 'absolute', zIndex: 1000, backgroundColor: '#fff', border: '1px solid #ccc', width: '100%', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    {options.map(opt => (
                        <div key={opt.id} style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => onToggle(opt.id)}>
                            <input type="checkbox" checked={selectedIds.includes(opt.id)} readOnly style={{ marginRight: '10px' }} />
                            {opt[nameKey]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};