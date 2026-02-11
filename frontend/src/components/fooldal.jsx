import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import httpCommon from '../http-common';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './fooldal.css';

function Fooldal({
  talalatok,
  setTalalatok,
  searchQuery,
  searchPage,
  setSearchPage,
  hasMoreSearch,
  setHasMoreSearch,
  page,
  setPage,
  hasMore,
  setHasMore,
  activeCategory,
  activeFilters
}) {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const navigate = useNavigate();

const lista = Array.from(
  new Map((Array.isArray(talalatok) ? talalatok : [])
    .map(item => [item.ISBN, item])
  ).values()
);

const safeFilters = activeFilters || {};

useEffect(() => {
  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: (searchQuery || activeCategory || Object.values(safeFilters).some(f => f)) ? searchPage : page, 
        limit: 10 
      });

      if (searchQuery) params.set("cim", searchQuery); 
      if (activeCategory) params.set("kat", activeCategory);

      Object.entries(safeFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });

      const endpoint = (searchQuery || activeCategory || Object.values(safeFilters).some(f => f)) 
        ? `/konyvek/search?${params.toString()}` 
        : `/konyvek?${params.toString()}`;

      const res = await httpCommon.get(endpoint);
      const uj = Array.isArray(res.data) ? res.data : [];


      const currentPage = (searchQuery || activeCategory || Object.values(safeFilters).some(f => f)) ? searchPage : page;
      
      setTalalatok(prev => currentPage === 1 ? uj : [...prev, ...uj]);
      
      if (searchQuery || activeCategory || Object.values(safeFilters).some(f => f)) {
        setHasMoreSearch(uj.length === 10);
      } else {
        setHasMore(uj.length === 10);
      }
    } catch (err) {
      console.error("Hiba a lekérésnél:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [searchQuery, activeCategory, safeFilters, page, searchPage]);



const lastItemRef = useCallback(
  (node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        if (searchQuery || activeCategory || Object.values(safeFilters).some(f => f)) {
          if (hasMoreSearch) setSearchPage(prev => prev + 1);
        } else {
          if (hasMore) setPage(prev => prev + 1);
        }
      }
    });

    if (node) observerRef.current.observe(node);
  },
  [loading, hasMore, hasMoreSearch, searchQuery, activeCategory, safeFilters]
);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className='fodiv'>
        {lista.map((t, index) => {
          const isLast = index === lista.length - 1;
          return (
            <Card
              border='secondary'
              style={{ width: '18rem' }}
              key={`${t.ISBN}-${index}`}
              ref={isLast ? lastItemRef : null}
              className='kartya'
            >
              <Card.Img
                onClick={() => navigate(`/termek/${t.ISBN}`)}
                variant='top'
                src={`/kepek/${t.ISBN}.jpg`}
                className='termek_kep'
              />
              <Card.Body
                onClick={() => navigate(`/termek/${t.ISBN}`)}
                style={{ padding: '1rem' }}
              >
                <Card.Title>{t.cim}</Card.Title>
                <Card.Subtitle>{t.szerzok}</Card.Subtitle>
                <Card.Text>
                  {t.leiras ? t.leiras.substring(0, 100) + '...' : 'Nincs leírás'}
                </Card.Text>
              </Card.Body>
              <ListGroup className='list-group-flush'>
                <ListGroup.Item>{t.kiado_nev}</ListGroup.Item>
                <ListGroup.Item>{t.kiadas_eve}</ListGroup.Item>
                <ListGroup.Item>{t.ar} Ft</ListGroup.Item>
              </ListGroup>
              <Card.Footer>
                <Button
                  className='Kosargomb'
                  onClick={() => {
                    const kosar = JSON.parse(localStorage.getItem('kosar')) || [];
                    const letezo = kosar.find(item => item.ISBN === t.ISBN);
                    if (letezo) letezo.mennyiseg += 1;
                    else kosar.push({ ...t, mennyiseg: 1 });
                    localStorage.setItem('kosar', JSON.stringify(kosar));
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new Event("storage"));
                    }
                    
                  }}
                  variant='primary'
                >
                  Kosárba rakom
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
      {loading && <p className='uzenet'>Loading...</p>}
      {(!hasMore && !(searchQuery || activeCategory || Object.values(safeFilters).some(f => f))) && (
        <p className='uzenet'>Nincs több találat!</p>
      )}
      {(!hasMoreSearch && (searchQuery || activeCategory || Object.values(safeFilters).some(f => f))) && (
        <p className='uzenet' id='nincstalalat'>
          Nincs több találat!
        </p>
      )}
    </div>
  );
}

export default Fooldal;
