import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import httpCommon from '../http-common';
import { useState , useEffect, useRef, useCallback } from 'react';
import "./fooldal.css"

function Fooldal({ talalatok }) { 

  const [adatok, setAdatok] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();

  // ❗ Ha érkezik új keresési eredmény → scroll kikapcs, lista törlődik
  useEffect(() => {
    if (talalatok !== null) {
      setAdatok([]);  
      setHasMore(false);
    }
  }, [talalatok]);

  // 🔥 Infinite scroll betöltés
  const fetchData = async (pagenum) => {
    if (talalatok !== null) return; // ha keresel → nincs scroll

    try {
      setLoading(true);
      const response = await httpCommon.get(`/konyvek?page=${pagenum}&limit=10`);
      const uj = response.data;

      if (uj.length === 0) {
        setHasMore(false);
      } else {
        setAdatok(prev => [...prev, ...uj]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Lapozás trigger
  useEffect(() => {
    if (talalatok === null) {
      fetchData(page);
    }
  }, [page, talalatok]);

  // IntersectionObserver → lap aljára érve új oldal
  const lastItemRef = useCallback(
    (node) => {
      if (loading || !hasMore || talalatok !== null) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, talalatok]
  );

  // ❗ Ha van keresési találat → azt mutasd
  const lista = talalatok !== null ? talalatok : adatok;

  return (
    <div className='fodiv'>
      {lista.map((t, index) => {
        const isLast = index === lista.length - 1;

        return (
          <Card
            style={{ width: '18rem' }}
            key={t.ISBN}
            ref={isLast && talalatok === null ? lastItemRef : null}
            className='kartya'
          >
            <Card.Img 
              variant="top" 
              src={`/kepek/${t.ISBN}.jpg`} 
              className='termek_kep'
            />

            <Card.Body style={{padding:"1rem"}}>
              <Card.Title>{t.cim}</Card.Title>
              <Card.Subtitle>{t.szerzok}</Card.Subtitle>
              <Card.Text>
                {t.leiras ? t.leiras.substring(0, 100) + "..." : "Nincs leírás"}
                {t.borito_tipus}
              </Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
              <ListGroup.Item>{t.kiado_nev}</ListGroup.Item>
              <ListGroup.Item>{t.kiadas_eve}</ListGroup.Item>
              <ListGroup.Item>{t.ar} KWD</ListGroup.Item>
            </ListGroup>

            <Card.Footer>
              <Button variant="primary">Kosárba rakom</Button>
            </Card.Footer>
          </Card>
        );
      })}

      {loading && talalatok === null && <p>Loading...</p>}
      {!hasMore && talalatok === null && <p>Nincs több találat</p>}
    </div>
  );
}

export default Fooldal;
