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

    const handleToggleInput = (isbn, konyv) => {
        setShowInput(prev => ({
            ...prev,
            [isbn]: !prev[isbn]
        }));

        if (!editedKonyvek[isbn]) {
            setEditedKonyvek(prev => ({
                ...prev,
                [isbn]: { ...konyv } 
            }));
        }
    };

    const handleChange = (isbn, field, value) => {
        setEditedKonyvek(prev => ({
            ...prev,
            [isbn]: {
                ...prev[isbn],
                [field]: value
            }
        }));
    };

    const fetchData = async () => {
        try {
            const response = await httpCommon.get("/konyvek/adminosszeskonyv", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setOsszesKonyv(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    

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
    if (!edited) {
        alert("Nincs szerkesztett adat ehhez a könyvhöz!");
        return;
    }

    try {
        const szerzo_ids = edited.szerzo_ids || []; // ha nincs, üres tömb
        const illusztrator_ids = edited.illusztrator_ids || [];
        const fordito_ids = edited.fordito_ids || [];

        const payload = {
            REGIISBN: ISBN,
            ...edited,
            szerzo_ids,
            illusztrator_ids,
            fordito_ids
        };

        await httpCommon.put("/konyvek/konyvmodositas", payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        setOsszesKonyv(prev =>
            prev.map(k => (k.ISBN === ISBN ? edited : k))
        );

        alert("Könyv frissítve!");
    } catch (err) {
        console.error(err);
        alert("Hiba történt a módosítás során!");
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
        fetchData() 
        Fetchmodositas('nyelv',setNyelvek);
        Fetchmodositas('kiadok',setKiado);
        Fetchmodositas('borito',setBorito);
        Fetchmodositas('illusztracio',setIllusztráció);
        Fetchmodositas('szerzok',setSzerzok);
        Fetchmodositas('illusztratorok',setIllusztrátorok);
        Fetchmodositas('forditok',setForditok);
        Fetchmodositas('kategoria',setKategoria);
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
                    szerzok:  {K.szerzok} <br/>
                    {K.forditok ? `fordítok: ${K.forditok}`  : null}
                    {K.illusztratorok ? `illusztratorok:  ${K.illusztratorok}`  : null}
                </span>
            <button onClick={() => konyvTorles(K.ISBN)}>Könyv törlése</button>
            <button onClick={() => handleToggleInput(K.ISBN)}>Könyv módosítása</button>

            {showInput[K.ISBN] && editedKonyvek[K.ISBN] &&(
                <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
                    <input placeholder="ISBN" value={editedKonyvek[K.ISBN].ISBN} onChange={(e) => handleChange(K.ISBN, "ISBN", e.target.value)}/>
                    <input placeholder="Cím" value={editedKonyvek[K.ISBN].cim} onChange={(e) => handleChange(K.ISBN, "cim", e.target.value)}/>
                    <input placeholder="Ár" value={editedKonyvek[K.ISBN].ar} onChange={(e) => handleChange(K.ISBN, "ar", e.target.value)}/>

                    <div>
                                <label>Nyelv: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].nyelv_nev}
                                    onChange={(e) => handleChange(K.ISBN, "nyelv_nev", e.target.value)} >
                                    {nyelvek.map(ny =>(
                                        <option key={ny.id} value={ny.nyelv_nev}>{ny.nyelv_nev}</option>
                                    ))}

                                </select>
                            </div>

                            <div>
                                <label>Kiadó: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kiado_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kiado_nev", e.target.value)} >
                                    {kiado.map(k =>(
                                        <option key={k.id} value={k.kiado_nev}>{k.kiado_nev}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Borító típus: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].borito_tipus}
                                    onChange={(e) => handleChange(K.ISBN, "borito_tipus", e.target.value)}>
                                    {borito.map(b =>(
                                        <option key={b.id} value={b.borito_nev}>{b.borito_nev}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Kategória: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kat_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kat_nev", e.target.value)}>
                                    {kategoria.map(k =>(
                                        <option key={k.id} value={k.kat_nev}>{k.kat_nev}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Illusztráció: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kat_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kat_nev", e.target.value)}>
                                    {illusztráció.map(i =>(
                                        <option key={i.id} value={i.illusztracio}>{i.illusztracio}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Szerzők: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kat_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kat_nev", e.target.value)}>
                                    {szerzok.map(sz =>(
                                        <option key={sz.id} value={sz.szerzo_nev}>{sz.szerzo_nev}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Illusztrátorok: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kat_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kat_nev", e.target.value)}>
                                    {illusztrátorok.map(i =>(
                                        <option key={i.id} value={i.illusztrator}>{i.illusztrator}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Fordítók: </label>
                                <select
                                    value={editedKonyvek[K.ISBN].kat_nev}
                                    onChange={(e) => handleChange(K.ISBN, "kat_nev", e.target.value)}>
                                    {forditok.map(f =>(
                                        <option key={f.id} value={f.fordito_nev}>{f.fordito_nev}</option>
                                    ))}
                                </select>
                            </div>
                        <button onClick={() => konyvmodositas()}>Módosítás</button>
                </div>
            )}
            </div>
        ))}
        </>
    )
}