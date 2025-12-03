import './filter.css'
import { useState,useEffect } from 'react';
import httpCommon from '../http-common';
import { useSearchParams } from "react-router-dom";


export default function Filters( { onSearch, talalatok }){
    const [kiadok, setKiadok] = useState([]);
    const [nyelv, setNyelv] = useState([]);
    const [borito, setBorito] = useState([]);
    const [error,setError] = useState();
    const [formData, setFormData] = useState({
        borito: "",
        armin: "",
        armax: "",
        kiado: "",
        nyelv: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();
  const handleFilter = (kiado, nyelv, borito) => {
    let lista = talalatok ?? []; 

    if (!lista.length) return; 

    if (borito) {
      lista = lista.filter(k => k.borito_nev === borito);
    }

    if (kiado) {
      lista = lista.filter(k => k.kiado_nev.toLowerCase().includes(kiado.toLowerCase()));
    }

    if (nyelv) {
      lista = lista.filter(k => k.nyelv_nev.toLowerCase().includes(nyelv.toLowerCase()));
    }

    onSearch(lista); 
  };
    
    const fetchData = async (nev, setter) =>{
        try{ 
            const response = await httpCommon.get(`/konyvek/${nev}`);
            setter(response.data)
        }
        catch(error){
            setError(error.message);
            console.error('Error fetching data: ', error);
        }
    }
    
    useEffect(() => {
        const borito = searchParams.get("borito") || "";
        const nyelv = searchParams.get("nyelv") || "";  
        const kiado = searchParams.get("kiado") || ""; 
        setFormData({kiado,nyelv,borito})
        fetchData("kiadok", setKiadok);
        fetchData("nyelv", setNyelv);
        fetchData("borito", setBorito);
    }, []);

    
    
    return(
        <>
        <div className="filter_fodiv">
            <div className="selected_filter">

            </div>
            <div className="sort_by">
                <h3>Rendezés szerint:</h3>
                <select>
                    <option value="Relevancia">Relevancia</option>
                    <option value="Ár (csökennő)">Ár (csökennő)</option>
                    <option value="Ár (növekvő)">Ár (növekvő)</option>
                    <option value="Kiadás éve (növekvő)">Kiadás éve (növekvő)</option>
                    <option value="Kiadás éve (csökkenő)">Kiadás éve (csökkenő)</option>
                </select>
            </div>
            <div className="borito">
                <h3>Borító: </h3>
                {borito.map((t, index) => (
                    <span onClick={() => handleFilter("","",t.borito_nev)} key={index} style={{cursor: "pointer"}}>{t.borito_nev}<br /></span>
                ))}
            </div>
            <div className="ar">
                <h3>Ár: </h3>
                <div className='arak_range'>
                    <input type='number' className='min-max_ar'></input><span>Ft</span> - <input type='number' className='min-max_ar'></input><span>Ft</span>
                </div>
            </div>
            <div className="kiadok">
                <h3>Kiadó: </h3>
                {kiadok.map((t, index) => (
                    <span key={index}>{t.kiado_nev}<br /></span>
                ))}
            </div>
            <div className="language">
                <h3>Nyelv: </h3>
                {nyelv.map((t, index) => (
                    <>
                   <span key={index}>{t.nyelv_nev}<br /></span>
                    </>
                    
                ))}
            </div>
            
        </div>
        </>
    )
}

