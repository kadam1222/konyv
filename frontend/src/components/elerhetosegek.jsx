
import Card from 'react-bootstrap/Card';

export default function Elerhetosegek(){
    return(
    <>
    <a href='/' style={{textDecoration:"none",fontSize:"16px"}} className="termek-vissza">← Vissza</a>
    <Card style={{marginLeft: "250px", marginRight:"250px", borderColor: "#dbc38c", marginBottom:"30px",marginTop:"30px" }}>
      <Card.Header as="h5" style={{backgroundColor:"#c3af89",color:"#ffffff"}}>Elérhetőségek</Card.Header>
      <Card.Body>
        <Card.Text style={{ color: "#3a3a3a" }}>
          <strong>E-mail cím:</strong>
          <span style={{ color: "#6e604bff" }}> bolt@Gmail.com</span>
        </Card.Text>
        <Card.Text>
            <strong>Telefonszám:</strong> 
            <span style={{ color: "#6e604bff" }}> 0670001251</span>
        </Card.Text>
      </Card.Body>
    </Card>
    </>
    )
    
}