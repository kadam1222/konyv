import { useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export default function LoginForm(){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return(
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email cím</Form.Label>
        <Form.Control type="email" placeholder="Email..." />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Jelszó</Form.Label>
        <Form.Control type="password" placeholder="Jelszó..." />
      </Form.Group>
      <Button variant="primary" type="submit">
        Bejelentkezés
      </Button>
    </Form>
    )
}