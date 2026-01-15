import { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import httpCommon from "../http-common";
import "./registerform.css"
export default function RegisterForm( { onClose, switchToLogin } ){
    const [nev,setNev] = useState("")
    const [email, setEmail] = useState("");
    const [jelszo, setJelszo] = useState("");
    const [error, setError] = useState("");
    
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!nev || !email || !jelszo) {
  setError("Kérlek tölts ki minden mezőt!");
  return;
}

  try {
    await httpCommon.post(
      "/auth/register",
      { nev, email, jelszo },
      { withCredentials: true } 
    );
    alert("Sikeres regisztráció!");
    onClose();

  } catch (err) {
    console.error(err.response?.data || err.message);
    setError(err.response?.data?.message || "Hiba a regisztráció során");
  }
};

    return(
    <Form onSubmit={handleSubmit} className="register-form">
        <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Név</Form.Label>
        <Form.Control
          type="text"
          placeholder="Név..."
          value={nev}
          onChange={(e) => setNev(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email cím</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Jelszó</Form.Label>
        <Form.Control
          type="password"
          placeholder="Jelszó..."
          value={jelszo}
          onChange={(e) => setJelszo(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button variant="primary" type="submit" id="regisztraciogomb">
        Regisztracio
      </Button>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Már van fiókod?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={switchToLogin}
        >
          Jelentkezz be
        </span>
      </p>
    </Form>
    )
}