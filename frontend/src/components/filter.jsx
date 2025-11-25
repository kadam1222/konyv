import './filter.css'
import { useState,useEffect } from 'react';
import httpCommon from '../http-common';


export default function Filters(){
    const [kategoriak, setKategoriak] = useState([]);
    const [kiadok, setKiadok] = useState([]);
    const [nyelv, setNyelv] = useState([]);
    const [borito, setBorito] = useState([]);
    const [error,setError] = useState();
    
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
        fetchData("kategoria", setKategoriak);
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
            <div className="category">
                <h3>Kategóriák: </h3>
                {kategoriak.map((t, index) => (
                    <>
                    {t.katazon && <span key={index}>{t.kat_nev}<br /></span>}
                    </>
                    
                ))}
            </div>
            <div className="borito">
                <h3>Borító: </h3>
                {borito.map((t, index) => (
                    <span key={index}>{t.borito_nev}<br /></span>
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

