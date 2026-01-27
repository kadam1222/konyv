import "./Segitseg.css"
import Card from 'react-bootstrap/Card';

export default function Segitseg(){
    return(
        <>
        <a 
          href='/' 
          style={{ textDecoration:"none", fontSize:"16px" }} 
          className="termek-vissza"
        >
          ← Vissza
        </a>

        <Card   
          className="faq-container"
        >
          <Card.Header 
            as="h5" 
            style={{ backgroundColor:"#c3af89", color:"#ffffff" }}
          >
            ❓ Segítség / GYIK
          </Card.Header>

          <Card.Body>
            <div className="faq-item">
              <h4>✏️ Tudom módosítani a rendelésem leadás után?</h4>
              <p>
                A rendelés leadása után rövid ideig még van lehetőség módosításra.
                Amennyiben szeretnél változtatni (pl. cím, mennyiség),
                kérjük, <strong>minél hamarabb vedd fel velünk a kapcsolatot</strong>
                az elérhetőségeink egyikén.
              </p>
            </div>

            <div className="faq-item">
              <h4>🚚 Mikorra érkezik meg a rendelésem?</h4>
              <p>
                A rendelések feldolgozása általában <strong>1–2 munkanapot</strong>
                vesz igénybe. A szállítás ezt követően
                <strong> 2–5 munkanapon belül</strong> történik meg.
              </p>
            </div>

            <div className="faq-item">
              <h4>💳 Milyen fizetési módok érhetők el?</h4>
              <p>Bankkártyás fizetés, Utánvét, Előre utalás.</p>
            </div>

            <div className="faq-item">
              <h4>🔁 Mi a teendő, ha szeretném visszaküldeni a terméket?</h4>
              <p>
                A kézhezvételtől számított <strong>14 napon belül</strong>
                indoklás nélkül elállhatsz a vásárlástól.
                A részleteket az <strong>ÁSZF</strong> menüpontban találod.
              </p>
            </div>
          </Card.Body>
        </Card>
        </>
    )
}
