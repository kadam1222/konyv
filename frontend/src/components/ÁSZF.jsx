import Card from 'react-bootstrap/Card';
export default function Ászf(){
    return(
        <>
        <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
        <Card style={{marginLeft: "250px", marginRight:"250px", borderColor: "#dbc38c", marginBottom:"30px",marginTop:"30px" }}>
            <Card.Header as="h5" style={{backgroundColor:"#c3af89",color:"#ffffff"}}>Általános Szerződési Feltételek</Card.Header>
            <Card.Body>
                <Card.Text style={{ color: "#3a3a3a" }}>
                    <h4>1. Bevezetés</h4>

                    <span style={{ color: "#6e604bff" }}> Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a BookBar (továbbiakban: Szolgáltató) és a vásárló (továbbiakban: Vásárló) között létrejövő adásvételi szerződés feltételeit tartalmazza.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>2. A szerződés tárgya</h4>

                    <span style={{ color: "#6e604bff" }}>A Szolgáltató könyvek és kapcsolódó termékek értékesítését végzi. A Vásárló a megrendelés leadásával elfogadja jelen ÁSZF-et.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>3. Árak és fizetés</h4>

                    <span style={{ color: "#6e604bff" }}>Az árak forintban értendők és tartalmazzák az áfát. A Szolgáltató fenntartja az árváltoztatás jogát. A fizetés történhet készpénzzel, bankkártyával vagy online fizetési móddal.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>4. Szállítás és átvétel</h4>

                    <span style={{ color: "#6e604bff" }}>A megrendelt termékek személyesen átvehetők vagy kiszállításra kerülnek a Vásárló által megadott címre. A szállítási határidő tájékoztató jellegű.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>5. Elállási jog</h4>

                    <span style={{ color: "#6e604bff" }}>A Vásárlót jogszabály szerint megilleti az elállás joga. Az elállási jog részleteiről a hatályos jogszabályok rendelkeznek.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>6. Panaszkezelés</h4>

                    <span style={{ color: "#6e604bff" }}>A Vásárló panaszát írásban vagy személyesen jelezheti. A Szolgáltató törekszik a panaszok mielőbbi kivizsgálására és rendezésére.</span>
                </Card.Text>
                <Card.Text style={{ color: "#3a3a3a" }}>
                <h4>7. Záró rendelkezések</h4>

                    <span style={{ color: "#6e604bff" }}>Jelen ÁSZF-ben nem szabályozott kérdésekben a magyar jog az irányadó.</span>
                </Card.Text>
            </Card.Body>
        </Card>
        </>
    )
}