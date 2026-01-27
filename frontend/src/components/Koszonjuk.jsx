import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import "./koszonjuk.css"

export default function Koszonjuk(){
    const navigate = useNavigate()
    
    return(
        <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h1><strong>Köszönjük a vásárlást!</strong></h1>
            <Button className='koszonjukgomb' onClick={() => {navigate("/")}}>Vissza a főoldalra</Button>
        </div>
    )
}