import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Form } from "react-bootstrap";

export default function AdminSegedAdatTorles({ accessToken, onSiker }) {
    const tipusok = {
        szerzo: { label: "Szerzők", endpoint: "szerzok", nameKey: "szerzo_nev" },
        kiado: { label: "Kiadók", endpoint: "kiadok", nameKey: "kiado_nev" },
        nyelv: { label: "Nyelvek", endpoint: "nyelv", nameKey: "nyelv_nev" },
        borito: { label: "Borítók", endpoint: "borito", nameKey: "borito_nev" },
        kategoriak: { label: "Kategóriák", endpoint: "kategoria", nameKey: "kat_nev" },
        fordito: { label: "Fordítók", endpoint: "forditok", nameKey: "fordito_nev" },
        illusztrator: { label: "Illusztrátorok", endpoint: "illusztratorok", nameKey: "illusztrator" },
        illusztracio: { label: "Illusztráció típusok", endpoint: "illusztracio", nameKey: "illusztracio" }
    };

    const [valasztottKulcs, setValasztottKulcs] = useState("szerzo");
    const [adatok, setAdatok] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAdatok = async () => {
        setLoading(true);
        try {
            const res = await httpCommon.get(`/konyvek/${tipusok[valasztottKulcs].endpoint}`);
            setAdatok(res.data);
        } catch (err) {
            console.error("Hiba a letöltéskor:", err);
            setAdatok([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) fetchAdatok();
    }, [valasztottKulcs, accessToken]);

    const handleTorles = async (id, nev) => {
    if (window.confirm(`Biztosan törölni szeretnéd: ${nev}?`)) {
        try {
            const payload = { [valasztottKulcs]: id };

            await httpCommon.delete("/admin/deleteAdat", {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: payload 
            });

            alert("Sikeres törlés!");
            fetchAdatok();
            if (onSiker) onSiker();
        } catch (err) {
            console.error("Törlési hiba:", err);
            alert("Hiba! Valószínűleg kényszerfeltétel hiba (az adat használatban van).");
        }
    }
};

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#dfcdb4" }}>
            <h4>Kis adatok törlése</h4>
            
            <Form.Group className="mb-3">
                <Form.Label>Válaszd ki mit szeretnél törölni:</Form.Label>
                <Form.Select style={{backgroundColor: "#ceb795"}} value={valasztottKulcs} onChange={(e) => setValasztottKulcs(e.target.value)}>
                    {Object.entries(tipusok).map(([kulcs, adatok]) => (
                        <option key={kulcs} value={kulcs}>{adatok.label}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #eee" }}>
                <Table striped bordered hover size="sm" variant="light">
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
                        <tr>
                            <th>Név</th>
                            <th style={{ width: "80px" }}>Művelet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="2">Betöltés...</td></tr>) : adatok.length > 0 ? (
                            adatok.map((item) => (
                                <tr style={{backgroundColor: "#dfcdb4"}} key={item.id}>
                                    <td>{item[tipusok[valasztottKulcs].nameKey]}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleTorles(item.id, item[tipusok[valasztottKulcs].nameKey])} > Törlés </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="2">Nincs adat.</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}