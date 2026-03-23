import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import "./fizetes.css"
import http_common from "../http-common"
import { useNavigate } from "react-router-dom";


export default function Fizetes( {accessToken}){
    const [nev, setNev] = useState("");
    const [email, setEmail] = useState("");
    const [mennyiseg,setMennyiseg] = useState("");
    const [adoszam ,setAdoszam] = useState("")
    const [lakcim,setLakcim] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [teljesites_kelte, setTeljesites_kelte] =useState(null)
    const [kosar, setKosar] = useState(
        JSON.parse(localStorage.getItem("kosar")) || []
    );

    useEffect(()=>{
            setMennyiseg(kosar.reduce((sum, item) => sum + item.ar * item.mennyiseg,
        0))
        }
    
    ,[kosar]);

    const teljesAr = kosar.reduce(
        (sum, item) => sum + item.ar * item.mennyiseg,
        0
    ) + (shippingMethod === "1" ? 500 : 0);
    
useEffect(() => {
    if (!accessToken) return;

    http_common.get("/konyvek/profil", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => {
         console.log("Profil adatok:", res.data); 
      setNev(res.data.vevo_nev || "");
      setEmail(res.data.email || "");
      
    })
    .catch(err => {
      console.error("Felhasználó adat lekérése sikertelen:", err);
    });
  }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
         if(!paymentMethod || !shippingMethod || kosar.length === 0){
            setError("Kérlek válassz fizetési és szállítási módot, és legyenek termékek a kosárban!");
            return;
        }
        const kuldendoDatum = (paymentMethod === "1") ? null : new Date().toISOString().split('T')[0];
        setLoading(true);
        setError("");
        setSuccess("");

        try{
            const response = await http_common.post(
                "/konyvek/szamla",
                {
                    fizetesi_mod: paymentMethod,
                    szallitas_mod: shippingMethod,
                    termekek: kosar.map(item => ({
                        ISBN: item.ISBN,
                        darab: item.mennyiseg,
                        ar:item.ar,
                        cim: item.cim
                    })),
                    nev,
                    email,
                    lakcim: lakcim,
                    teljesites_kelte: kuldendoDatum,
                    adoszam: adoszam
                },
                {
                    headers: {
                        Authorization: accessToken ? `Bearer ${accessToken}` : "",
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess(`Sikeres rendelés! Számla ID: ${response.data.szamla_id}`);
            localStorage.removeItem("kosar");
            setKosar([]);
            window.dispatchEvent(new Event("storage"));
           navigate("/koszonjuk");

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Hiba a rendelés leadásakor");
        }finally{
            setLoading(false);
            
        }
    };
    return(

    <div style={{display:"flex", gap:"40px" , alignItems:"flex-start"}}>
        
        {success && <p style={{color:"green"}}>{success}</p>}
    <div className="fizetesfodiv">
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="formBasiclakcím">
            <Form.Label>Név:</Form.Label>
            <Form.Control type="text" value={nev || ""} onChange={(e) => setNev(e.target.value)} placeholder="pl. : Kiss Lajos" disabled/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} placeholder="pl. : example@gmail.com"  disabled/>
        </Form.Group>



        <Form.Group className="mb-3" controlId="formBasiclakcím">
            <Form.Label>Lakcím</Form.Label>
            <Form.Control type="text" value={lakcim || ""}  onChange={(e) => setLakcim(e.target.value)} placeholder="pl. : 1011 Budapest Fő utca 2..." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicadoszam">
            <Form.Label>Adószám</Form.Label>
            <Form.Control type="number" placeholder="12345678-2-10" value={adoszam || ""}  onChange={(e) => setAdoszam(e.target.value)} />
            <Form.Text className="text-muted">
            CSAK cégek számára!
            </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Label>Fizetési mód</Form.Label>
            <Form.Check type="radio" label="Bankkártya" value="3" checked={paymentMethod === "3"} onChange={(e) => setPaymentMethod(e.target.value)} />
            <Form.Check type="radio" label="Utánvét" value="1" checked={paymentMethod === "1"} onChange={(e) => setPaymentMethod(e.target.value)}/>
            <Form.Check type="radio" label="Előre utalás" value="2" checked={paymentMethod === "2"} onChange={(e) => setPaymentMethod(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Label>Szállítási mód</Form.Label>
            <Form.Check type="radio" label="Házhoz szállítás (+500 Ft) " value="1" checked={shippingMethod === "1" } onChange={(e) => setShippingMethod(e.target.value)}/>
            <Form.Check type="radio" label="Személyes átvétel (INGYENES)" value="2" checked={shippingMethod === "2"} onChange={(e) => setShippingMethod(e.target.value)}/>
        </Form.Group>

{error && <p style={{color:"red"}}>{error}</p>}
<Button id="fizetesleadasagomb" className='rendelesgombok' type="submit" disabled={loading}>
    {loading ? "Feldolgozás..." : <strong>Vásárlás!</strong>} 
</Button>

    </Form>
    </div>

    <div className='teljesarfizetes'> <h4 id='rendelescim'>Rendelésed:</h4> 
            <div className='RendelesInfo'> 
                {kosar.map((item)=>(
                    <p key={item.ISBN}>{item.mennyiseg} x {item.cim}</p>
                ))}
                <span className='rendeles'>Teljes ár: {teljesAr} Ft</span> 
                <Button style={{marginBottom:"5px"}} className='rendelesgombok' onClick={()=>{navigate("/")}}>Vásárlás folytatása!</Button>
            </div> 
    </div>
    </div>
    )
}