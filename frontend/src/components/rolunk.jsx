
import Card from 'react-bootstrap/Card';

export default function Rolunk(){
    return(
        <>
        <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
        <Card style={{marginLeft: "250px", marginRight:"250px", borderColor: "#dbc38c", marginBottom:"30px",marginTop:"30px" }}>
      <Card.Header as="h5" style={{backgroundColor:"#c3af89",color:"#ffffff"}}>Rólunk</Card.Header>
      <Card.Body>
        <Card.Text style={{ color: "#3a3a3a" }}>
          <span style={{ color: "#3f382eff" }}> A Bolt azért jött létre, hogy a könyvek szeretetét minél több emberhez eljuttassa. Kínálatunkban megtalálhatók klasszikus és kortárs művek, ismeretterjesztő könyvek, valamint fiatalok és gyerekek számára szóló olvasmányok is. Fontos számunkra a minőség, az olvasás öröme és a személyes élmény, ezért igyekszünk gondosan válogatott könyveket és segítőkész kiszolgálást biztosítani vásárlóink számára. Célunk, hogy mindenki megtalálja nálunk a számára leginspirálóbb olvasnivalót.</span>
        </Card.Text>
      </Card.Body>
    </Card>
    </>
    )
}