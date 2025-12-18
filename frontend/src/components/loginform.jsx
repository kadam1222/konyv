import { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import httpCommon from "../http-common";
export default function LoginForm( { setAccessToken, onClose  } ){
    const [email, setEmail] = useState("");
    const [jelszo, setJelszo] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await httpCommon.post(
      "/auth/login",
      { email, jelszo },
      { withCredentials: true } 
    );

    setAccessToken(res.data.accessToken);
    onClose();

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

    return(
    <Form onSubmit={handleSubmit}>
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

      <Button variant="primary" type="submit">
        Bejelentkezés
      </Button>
    </Form>
    )
}