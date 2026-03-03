import { useState , useEffect} from 'react';
import { FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./kosar.css"


export default function Kosar( {accesToken} ){

    const [mennyiseg,setMennyiseg] = useState()
    const navigate = useNavigate();


    const [kosar, setKosar] = useState(
        JSON.parse(localStorage.getItem("kosar")) || []
    );

    useEffect(()=>{
        setMennyiseg(kosar.length)
    }

    ,[kosar]);

    const teljesAr = kosar.reduce(
        (sum, item) => sum + item.ar * item.mennyiseg,
        0
    );

    return(
        <>
        <h1 className='cim'>Kosár Tartalma:</h1>
        <div style={{display:'flex', justifyContent:"center"}}>
            
                <div className='kosarfodiv'>
                {kosar.length > 0 ? (
        
        kosar.map((item, index) => (
            <div className="termekek" key={item.ISBN}>
            <img src={`/kepek/${item.ISBN}.jpg`} />

            <div className="Termekinfo">
                <h4 id='konyvcim'>{item.cim}</h4>
                <span>{item.szerzok}</span><br />
                <span>{item.ar} Ft</span><br />
            </div>

            <input type="number" min={1} value={item.mennyiseg} onChange={(e) => 
            { 
                const ujMennyiseg = Number(e.target.value); const ujKosar = [...kosar]; ujKosar[index].mennyiseg = ujMennyiseg; setKosar(ujKosar); localStorage.setItem("kosar", JSON.stringify(ujKosar));
                window.dispatchEvent(new Event("storage"));
            }} />
            <span style={{margin:"auto",marginLeft:"0px",marginRight:"15px"}}>db</span>
            <FaTrashCan id='torlesgomb' onClick={() => { const ujKosar = kosar.filter((_, i) => i !== index); setKosar(ujKosar); localStorage.setItem("kosar", JSON.stringify(ujKosar)); window.dispatchEvent(new Event("storage")); }}/>

            

            </div>
            ))
            ) : (
                <p id='hibaüzenet' style={{color:"red", fontWeight:"bold"}}>Még nincs termék a kosárban!</p>
            )}

            
        </div>
        <div className='teljesar'> <h4 id='rendelescim'>Rendelésed:</h4> 
            <div className='RendelesInfo'> 
                <span className='rendeles'>{mennyiseg} db termék</span> 
                <span className='rendeles'>Teljes ár: {teljesAr} Ft</span> 
                {kosar.length > 0 && accesToken ? <Button className='rendelesgombok' onClick={() => {navigate("/fizetes")}}>Tovább a fizetéshez!</Button> : <><span style={{color:"red"}}><strong>A vásárlás folytatásához kötelező a regisztráció!</strong></span><Button disabled className='rendelesgombok'>Tovább a fizetéshez!</Button></>}
                <Button style={{marginBottom:"5px"}} className='rendelesgombok' onClick={()=>{navigate("/")}}>Vásárlás folytatása!</Button>
                </div> 
            </div>
        </div>
        </>
    )
}