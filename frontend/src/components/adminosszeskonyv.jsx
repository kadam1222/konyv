import { useState, useEffect } from "react";
import httpCommon from "../http-common";

export default function AdminBook( {accessToken}){
    const [osszesKonyv, setOsszesKonyv] = useState([])
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

    useEffect(() => {
    if (accessToken) {
        setOsszesKonyv([]);
        setPage(1);
        setHasMore(true);
        fetchData(1); 
    }
    }, [accessToken])

    const handleToggleInput = (isbn, konyv) => {
        setShowInput(prev => ({ ...prev, [isbn]: !prev[isbn] }));

        if (!editedKonyvek[isbn]) {
            const talaltNyelv = nyelvek.find(ny => ny.nyelv_nev === konyv.nyelv_nev);
            const talaltKiado = kiado.find(k => k.kiado_nev === konyv.kiado_nev);
            const talaltBorito = borito.find(b => b.borito_nev === konyv.borito_tipus);
            const talaltKategoria = kategoria.find(k => k.kat_nev === konyv.kat_nev);
            const talaltTipus = tipus.find(t => t.tipus_nev === konyv.tipus_nev);
            const talaltIllusztracio = illusztráció.find(i => i.illusztracio === konyv.illusztracio_leiras);

            const getIdsFromNames = (nameString, allOptions, nameKey) => {
                if (!nameString) return [];
                return nameString
                    .split(',') 
                    .map(n => n.trim()) 
                    .map(name => allOptions.find(opt => opt[nameKey] === name)?.id) 
                    .filter(id => id !== undefined); 
            };

            setEditedKonyvek(prev => ({
                ...prev,
                [isbn]: { 
                    ...konyv,
                    nyelv_id: talaltNyelv ? talaltNyelv.id : "",
                    kiado_id: talaltKiado ? talaltKiado.id : "",
                    borito_id: talaltBorito ? talaltBorito.id : "",
                    kategoria_id: talaltKategoria ? talaltKategoria.id : "",
                    tipus_id: talaltTipus ? talaltTipus.id : "",
                    illusztracio: talaltIllusztracio ? talaltIllusztracio.id : "",
                    
                    szerzo_ids: getIdsFromNames(konyv.szerzok, szerzok, "szerzo_nev"),
                    fordito_ids: getIdsFromNames(konyv.forditok, forditok, "fordito_nev"),
                    illusztrator_ids: getIdsFromNames(konyv.illusztratorok, illusztrátorok, "illusztrator"),
                    
                    leiras: konyv.leiras || ""
                } 
            }));
        }
    };

const MultiSelectDropdown = ({ label, options, selectedIds, onToggle, nameKey }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label><b>{label}</b></label>
            <div  onClick={() => setIsOpen(!isOpen)}  style={{ border: '1px solid #ccc', padding: '8px', cursor: 'pointer', backgroundColor: '#fff', minHeight: '35px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedIds.length === 0 ? "Válassz..." : `Kiválasztva: ${selectedIds.length} db`}
            </div>

            {isOpen && (
                <div style={{ position: 'absolute', zIndex: 10, backgroundColor: '#fff', border: '1px solid #ccc', width: '100%', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
                    {options.map(opt => (
                        <div key={opt.id} style={{ padding: '5px 10px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => onToggle(opt.id)}>
                            <input  type="checkbox"  checked={selectedIds.includes(opt.id)} readOnly style={{ marginRight: '10px' }} />
                            {opt[nameKey]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

    const handleChange = (isbn, field, value) => {
        setEditedKonyvek(prev => {
            const currentBook = prev[isbn] || {}; 
            return {
                ...prev,
                [isbn]: { ...currentBook, [field]: value}
            };
        });
    };

    const toggleSelection = (isbn, field, id) => {
        setEditedKonyvek(prev => {
            const currentList = prev[isbn][field] || [];
            const newList = currentList.includes(id) ? currentList.filter(item => item !== id) : [...currentList, id]; 
            return {
                ...prev, [isbn]: { ...prev[isbn], [field]: newList }
            };
        });
    };

    const fetchData = async (pageNum) => {
        if(loading || !hasMore) return;
        try {
            const response = await httpCommon.get(`/konyvek/adminosszeskonyv?page=${pageNum}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response.data.length === 0) {
                setHasMore(false);
                return;
            }
            setOsszesKonyv(prev => {
            const ujKonyvek = response.data.filter(
                newBook => !prev.some(oldBook => oldBook.ISBN === newBook.ISBN)
            );
            return [...prev, ...ujKonyvek];
        });
        } catch (err) {
            console.error(err)
        }
        finally {
        setLoading(false);
    }
    }


    useEffect(() => {
        if (!hasMore || loading || !accessToken) return;
        const handleScroll = () => {
            if ( window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            setPage(prev => {
                const next = prev + 1;
                fetchData(next);
                return next;
            });
        }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    }, [hasMore, loading, accessToken]);

    const konyvTorles = async ( ISBN ) => {
        try{
            const response = await httpCommon.delete("/konyvek/konyvtorol", 
                {
                data: { ISBN },    
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setOsszesKonyv(prev =>
                prev.filter(k => k.ISBN !== ISBN)
            )
        }
        catch(err){
            console.error(err)
        }
    }

    const konyvmodositas = async (ISBN) => {
        const edited = editedKonyvek[ISBN];
        if (!edited) return;
        try {
            const { tipus_nev, nyelv_nev, kiado_nev, borito_tipus, kat_nev, illusztracio_leiras, szerzok, forditok, illusztratorok, szerzo_ids, illusztrator_ids, fordito_ids, ...tisztaAdatok } = edited;
            const payload = { REGIISBN: ISBN, ...tisztaAdatok, szerzo_ids: szerzo_ids || [], illusztrator_ids: illusztrator_ids || [], fordito_ids: fordito_ids || [] };

            await httpCommon.put("/konyvek/konyvmodositas", payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            alert("Sikeres módosítás!");
            setShowInput(prev => ({ ...prev, [ISBN]: false }));
            setOsszesKonyv([])
            setPage(1);
            setHasMore(true)
            fetchData(1) 
            
        } catch (err) {
            console.error("Hiba küldéskor:", err);
        }
    };

    const Fetchmodositas = async (endpoint,setter) =>{
        try {
              const response = await httpCommon.get(`/konyvek/${endpoint}`);
              setter(response.data);
            } 
        catch (err) {
              console.error(`Error fetching ${endpoint}:`, err);
              setError(err.message);
            }
    }

   useEffect(() => {
    if (accessToken) {
        Fetchmodositas('nyelv',setNyelvek);
        Fetchmodositas('kiadok',setKiado);
        Fetchmodositas('borito',setBorito);
        Fetchmodositas('illusztracio',setIllusztráció);
        Fetchmodositas('szerzok',setSzerzok);
        Fetchmodositas('illusztratorok',setIllusztrátorok);
        Fetchmodositas('forditok',setForditok);
        Fetchmodositas('kategoria',setKategoria);
        Fetchmodositas('tipus',setTipus);
    }
    }, [accessToken])

    return(
        <>
        {osszesKonyv.map((K, index) =>(
            <div key={K.ISBN} style={{ marginBottom: "20px" }}>
                <span style={{marginBottom:"10px"}}>Cím: {K.cim}<br/> 
                    ISBN: {K.ISBN} <br/> 
                    nyelv_nev: {K.nyelv_nev} <br/> 
                    kiado_nev: {K.kiado_nev} <br/> 
                    borito_tipus:  {K.borito_tipus} <br/>
                    kat_nev:  {K.kat_nev} <br/>
                    ar:  {K.ar} <br/>
                    illusztracio_leiras:  {K.illusztracio_leiras} <br/>
                    Leírás: {K.leiras ? K.leiras.substring(0, 100) + '...' : 'Nincs leírás'} <br/>
                    Szerzők:  {K.szerzok} <br/>
                    Típus: {K.tipus_nev} <br/>
                    {K.forditok ? `fordítok: ${K.forditok}`  : null}
                    {K.illusztratorok ? `illusztratorok:  ${K.illusztratorok}`  : null}
                </span>
            <button onClick={() => konyvTorles(K.ISBN)}>Könyv törlése</button>
            <button onClick={() => handleToggleInput(K.ISBN, K)}>Könyv módosítása</button>

            {showInput[K.ISBN] && editedKonyvek[K.ISBN] &&(
                <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
                    <input placeholder="ISBN" value={editedKonyvek[K.ISBN].ISBN} onChange={(e) => handleChange(K.ISBN, "ISBN", e.target.value)}/>
                    <input placeholder="Cím" value={editedKonyvek[K.ISBN].cim} onChange={(e) => handleChange(K.ISBN, "cim", e.target.value)}/>
                    <input placeholder="Ár" value={editedKonyvek[K.ISBN].ar} onChange={(e) => handleChange(K.ISBN, "ar", e.target.value)}/>

                    <div>
                            <label>Nyelv: </label>
                                <select value={editedKonyvek[K.ISBN].nyelv_id || ""} onChange={(e) => handleChange(K.ISBN, "nyelv_id", e.target.value)} >
                                    {nyelvek.map(ny =>(
                                        <option key={ny.id} value={ny.id}>{ny.nyelv_nev}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Kiadó: </label>
                                <select value={editedKonyvek[K.ISBN].kiado_id || ""} onChange={(e) => handleChange(K.ISBN, "kiado_id", e.target.value)} >
                                    {kiado.map(k =>(
                                        <option key={k.id} value={k.id}>{k.kiado_nev}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Borító típus: </label>
                                <select value={editedKonyvek[K.ISBN].borito_id || ""} onChange={(e) => handleChange(K.ISBN, "borito_id", e.target.value)}>
                                    {borito.map(b =>(
                                        <option key={b.id} value={b.id}>{b.borito_nev}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Kategória: </label>
                                <select value={editedKonyvek[K.ISBN].kategoria_id || ""} onChange={(e) => handleChange(K.ISBN, "kategoria_id", e.target.value)}>
                                    {kategoria.map(k =>(
                                        <option key={k.id} value={k.id}>{k.kat_nev}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Illusztráció: </label>
                                <select value={editedKonyvek[K.ISBN].illusztracio || ""} onChange={(e) => handleChange(K.ISBN, "illusztracio", e.target.value)}>
                                    {illusztráció.map(i =>(
                                        <option key={i.id} value={i.id}>{i.illusztracio}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Típus: </label>
                                <select value={editedKonyvek[K.ISBN].tipus_id || ""}  onChange={(e) => handleChange(K.ISBN, "tipus_id", e.target.value)}>
                                    {tipus.map(t =>(
                                        <option key={t.id} value={t.id}>{t.tipus_nev}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Leírás: </label>
                                <textarea   style={{ width: "100%", minHeight: "100px", display: "block" }} value={editedKonyvek[K.ISBN].leiras || ""} onChange={(e) => handleChange(K.ISBN, "leiras", e.target.value)}/>
                            </div>
                            <div>
                                <MultiSelectDropdown label="Szerzők:" options={szerzok}
                                    selectedIds={editedKonyvek[K.ISBN].szerzo_ids || []}
                                    nameKey="szerzo_nev"
                                    onToggle={(id) => toggleSelection(K.ISBN, "szerzo_ids", id)}
                                />
                            </div>
                            <div>
                                <MultiSelectDropdown label="Illusztrátorok:" options={illusztrátorok}
                                    selectedIds={editedKonyvek[K.ISBN].illusztrator_ids || []}
                                    nameKey="illusztrator"
                                    onToggle={(id) => toggleSelection(K.ISBN, "illusztrator_ids", id)}
                                />
                            </div>
                            <div>
                                <MultiSelectDropdown label="Fordítók:" options={forditok}
                                    selectedIds={editedKonyvek[K.ISBN].fordito_ids || []}
                                    nameKey="fordito_nev"
                                    onToggle={(id) => toggleSelection(K.ISBN, "fordito_ids", id)}
                                />
                            </div>  
                        <button onClick={() => konyvmodositas(K.ISBN)}>Módosítás</button>
                </div>
            )}
            </div>
        ))}
        </>
    )
}