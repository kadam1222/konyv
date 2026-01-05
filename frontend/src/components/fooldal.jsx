import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import httpCommon from '../http-common';
import { useState , useEffect, useRef, useCallback } from 'react';
import "./fooldal.css"
import Termek from './termek.jsx';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Fooldal({ talalatok, searchQuery, searchPage, setSearchPage, hasMoreSearch, setTalalatok, page, setPage, hasMore, setHasMore , setHasMoreSearch, kivalasztottisbn, setKivalasztottisbn}) { 
  const [adatok, setAdatok] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const observerRef = useRef();
  const navigate = useNavigate();
    



  const fetchData = async (pagenum) => {
    try {
      setLoading(true);
      const response = await httpCommon.get(`/konyvek?page=${pagenum}&limit=10`);
      const uj = response.data;

      if (uj.length === 0) setHasMore(false);
        setAdatok(prev => {
        const combined = [...prev, ...uj];
        const unique = Array.from(new Map(combined.map(item => [item.ISBN, item])).values());
    return unique;
});
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally { setLoading(false); }
  };

  const fetchSearchData = async (query, pagenum) => {
    if(!query || !hasMoreSearch) return;
    try {
      setLoading(true);
      const response = await httpCommon.get(`/konyvek/fokereso?page=${pagenum}&limit=10&cim=${query}&szerzo=${query}`);
      const uj = response.data;

      if(uj.length === 0) setHasMoreSearch(false);
      setTalalatok(prev => {
      const combined = [...prev, ...uj];
      const unique = Array.from(new Map(combined.map(item => [item.ISBN, item])).values());
      return unique;
  });
    } catch(err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { if(!searchQuery) fetchData(page); }, [page, searchQuery]);
  useEffect(() => {
  if (searchQuery) {
    setTalalatok([]);
    setSearchPage(1);
    setHasMoreSearch(true);
  }
}, [searchQuery]);

  useEffect(() => { 
    if(searchQuery) {
      fetchSearchData(searchQuery, searchPage); 
    }
  }, [searchPage]);
  

  const lastItemRef = useCallback((node) => {
    if (loading) return;
    if(observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && !loading ){
        if(searchQuery){
          if(hasMoreSearch) setSearchPage(prev => prev + 1);
        } else {
          if(hasMore) setPage(prev => prev + 1);
        }
      }
    });

    if(node) observerRef.current.observe(node);
  }, [loading, hasMore, hasMoreSearch, searchQuery]);

  const handleKattint = async (ISBN) => {
      setSearchParams({ ISBN : ISBN });
  
      try {
       await http.get("/konyvek/", {
          params: { ISBN: ISBN }
      });
      } catch (error) {
        console.error("Hiba a kategória szűrésnél:", error);
      }
    };

  const lista = talalatok.length > 0 ? talalatok : adatok;


  return (
    <div style={{textAlign: "center"}}>
    <div className='fodiv'>
      {lista.map((t, index) => {
        const isLast = index === lista.length - 1;
        return (
          <Card border='secondary' style={{ width: '18rem' }} key={`${t.ISBN}-${index}`} ref={isLast ? lastItemRef : null} className='kartya'>
            <Card.Img onClick={() => navigate(`/termek/${t.ISBN}`) } variant="top" src={`/kepek/${t.ISBN}.jpg`} className='termek_kep' />
            <Card.Body onClick={() => navigate(`/termek/${t.ISBN}`) } style={{padding:"1rem"}}>
              <Card.Title >{t.cim}</Card.Title>
              <Card.Subtitle>{t.szerzok}</Card.Subtitle>
              <Card.Text>{t.leiras ? t.leiras.substring(0, 100)+"..." : "Nincs leírás"}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>{t.kiado_nev}</ListGroup.Item>
              <ListGroup.Item>{t.kiadas_eve}</ListGroup.Item>
              <ListGroup.Item>{t.ar} Ft</ListGroup.Item>
            </ListGroup>
            <Card.Footer>
              <Button onClick={() => ""} variant="primary">Kosárba rakom</Button>
            </Card.Footer>
          </Card>
        );
      })}
      
    </div>
      {kivalasztottisbn && {handleKattint} && <Termek ISBN={kivalasztottisbn}/>}
      {loading && <p className='uzenet'>Loading...</p>}
      {(!hasMore && !searchQuery) && <p className='uzenet'>Nincs több találat!</p>}
      {(!hasMoreSearch && searchQuery) && <p className='uzenet' id='nincstalalat'>Nincs több találat!</p>}
    </div>
  );
}

export default Fooldal;