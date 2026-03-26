import { useState , useEffect} from 'react';
import { FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./kosar.css"


export default function Kosar( {accessToken, setShowAuthPopup, setShowLoginForm} ){

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
    const vanTulcsordulas = kosar.some(item => Number(item.mennyiseg) > Number(item.raktar));

    const handleLoginClick = () => {
        setShowLoginForm(true); 
        setShowAuthPopup(true);  
    };
    
    const handleCheckout = async () => {
    const hibasTermekek = kosar.filter(item => Number(item.mennyiseg) > Number(item.raktar));

    if (hibasTermekek.length > 0) {
        const hibaUzenet = hibasTermekek
            .map(t => `${t.cim}: Csak ${t.raktar} db van raktáron (a kosaradban: ${t.mennyiseg} db)`)
            .join("\n");
        
        alert("Sajnos nem tudsz továbblépni a fizetéshez:\n\n" + hibaUzenet);
    } else {

        navigate("/fizetes");
    }
};

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
            {item.mennyiseg > item.raktaron && (
                <span style={{color: "red", fontSize: "12px"}}>
                    Csak {item.raktaron} db van raktáron!
                </span>
            )}
            <FaTrashCan id='torlesgomb' onClick={() => { const ujKosar = kosar.filter((_, i) => i !== index); setKosar(ujKosar); localStorage.setItem("kosar", JSON.stringify(ujKosar)); window.dispatchEvent(new Event("storage")); }}/>

            

            </div>
            ))
            ) : (
                <p id='hibaüzenet' style={{color:"red", fontWeight:"bold"}}>Még nincs termék a kosárban!</p>
            )}

            
        </div>
        <div className='teljesar'>
             <h4 id='rendelescim'>Rendelésed:</h4> 
            <div className='RendelesInfo'> 
                <span className='rendeles'>{mennyiseg} db termék</span> 
                <span className='rendeles'>Teljes ár: {teljesAr} Ft</span> 
                {!accessToken ? (
                    <>
                        <span style={{ color: "red", fontWeight: "bold" }}>
                            A vásárlás folytatásához bejelentkezés szükséges!<br/>
                            <a className="auth-login-link" onClick={handleLoginClick} style={{cursor:'pointer'}}>Kattints ide a bejelentkezéshez </a>
                        </span>
                        <Button disabled className='rendelesgombok'>Tovább a fizetéshez!</Button>
                    </>
                ) : kosar.length === 0 ? (
                    <>
                        <span className="rendeles-hiba">A kosár üres!</span>
                        <Button disabled className='rendelesgombok'>Tovább a fizetéshez!</Button>
                    </>
                ) : (
                    <>
                        {vanTulcsordulas && (
                            <span style={{ color: "red", fontWeight: "bold", display: "block", marginBottom: "10px" }}>
                                Figyelem: Néhány termékből nincs ennyi raktáron!
                            </span>
                        )}
                        <Button 
                            className='rendelesgombok' 
                            variant={vanTulcsordulas ? "danger" : "primary"} 
                            onClick={handleCheckout}>
                            Tovább a fizetéshez!
                        </Button>
                    </>
                )}
                {
                    
                }
                <Button 
                    variant="outline-secondary"
                    className='rendelesgombok' 
                    onClick={() => navigate("/")}
                >
                    Vásárlás folytatása
                </Button>

                </div> 
            </div>
        </div>
        </>
    )
}