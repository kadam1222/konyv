import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import httpCommon from '../http-common';
import { useState , useEffect } from 'react';
import "./fooldal.css"

function Fooldal({ talalatok }) { 

  const [adatok, setAdat] = useState([]);

  const fetchData = async () => {
    try{ 
      const response = await httpCommon.get('/konyvek');
      setAdat(response.data);
    }
    catch(error){
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(()=>{      
    fetchData();
  }, []);

  const megjelenoLista = talalatok !== null ? talalatok : adatok;

  return (
    <div className='fodiv'>
      {megjelenoLista.map((t, index) => (
        <Card style={{ width: '18rem' }} key={index} className='kartya'>
          <Card.Img variant="top" src={`/kepek/${t.ISBN}.jpg`} className='termek_kep'/>
          <Card.Body>
            <Card.Title>{t.cim}</Card.Title>
            <Card.Subtitle>{t.szerzok}</Card.Subtitle>
            <Card.Text>{t.leiras.substring(0,100) + "..."}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{t.kiado_nev}</ListGroup.Item>
            <ListGroup.Item>{t.kiadas_eve}</ListGroup.Item>
            <ListGroup.Item>{t.ar} KWD</ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Button variant="primary">Kosárba rakom</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Fooldal;
