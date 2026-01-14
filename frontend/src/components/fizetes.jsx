import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import "./fizetes.css"

export default function Fizetes(){
    
    const [mennyiseg,setMennyiseg] = useState()
    const [paymentMethod, setPaymentMethod] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    
    useEffect(()=>{
            setMennyiseg(kosar.length)
        }
    
    ,[]);

    const [kosar, setKosar] = useState(
        JSON.parse(localStorage.getItem("kosar")) || []
    );

    const teljesAr = kosar.reduce(
        (sum, item) => sum + item.ar * item.mennyiseg,
        0
    );
    

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Payment method:", paymentMethod);
        console.log("Shipping method:", shippingMethod);
    };

    return(
    <div style={{display:"flex", gap:"40px" , alignItems:"flex-start"}}>
    <div className="fizetesfodiv">
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="formBasiclakcím">
            <Form.Label>Név:</Form.Label>
            <Form.Control type="text" disabled />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="pl. : example@gmail.com"  disabled/>
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>



        <Form.Group className="mb-3" controlId="formBasiclakcím">
            <Form.Label>Lakcím</Form.Label>
            <Form.Control type="text" placeholder="pl. : 1011 Budapest Fő utca 2..." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicadoszam">
            <Form.Label>Adószám</Form.Label>
            <Form.Control type="number" placeholder="12345678-2-10" />
            <Form.Text className="text-muted">
            CSAK cégek számára!
            </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Label>Fizetési mód</Form.Label>
            <Form.Check type="radio" label="Bankkártya" value="Bankkártya" checked={paymentMethod === "Bankkártya"} onChange={(e) => setPaymentMethod(e.target.value)} />
            <Form.Check type="radio" label="Utánvét" value="Utánvét" checked={paymentMethod === "Utánvét"} onChange={(e) => setPaymentMethod(e.target.value)}/>
            <Form.Check type="radio" label="Előre utalás" value="Előre utalás" checked={paymentMethod === "Előre utalás"} onChange={(e) => setPaymentMethod(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Label>Szállítási mód</Form.Label>
            <Form.Check type="radio" label="Házhoz szállítás (+500 Ft) " value="házhozszállítás" checked={shippingMethod === "házhozszállítás"} onChange={(e) => setShippingMethod(e.target.value)}/>
            <Form.Check type="radio" label="Személyes átvétel (INGYENES)" value="személyesátvétel" checked={shippingMethod === "személyesátvétel"} onChange={(e) => setShippingMethod(e.target.value)}/>
        </Form.Group>

        <Button variant="primary" type="submit">
            Vásárlás!
        </Button>
    </Form>
    </div>

    <div className='teljesar'> <h4 id='rendelescim'>Rendelésed:</h4> 
            <div className='RendelesInfo'> 
                <span className='rendeles'>{mennyiseg} db termék</span> 
                <span className='rendeles'>Teljes ár: {teljesAr} Ft</span> 
                {kosar.length > 0 ? <Button className='rendelesgombok' onClick={() => {navigate("/fizetes")}}>Tovább a fizetéshez!</Button> : <Button disabled className='rendelesgombok'>Tovább a fizetéshez!</Button>}
                <Button style={{marginBottom:"5px"}} className='rendelesgombok' onClick={()=>{navigate("/")}}>Vásárlás folytatása!</Button>
            </div> 
    </div>
    </div>
    )
}