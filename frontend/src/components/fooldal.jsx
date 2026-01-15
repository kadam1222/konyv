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

  const fetchData = async (pagenum) => {
    try {
      setLoading(true);
      const response = await httpCommon.get(`/konyvek?page=${pagenum}&limit=10`);
      const uj = Array.isArray(response.data) ? response.data : [];

      setHasMoreSearch(uj.length === 10);
      setTalalatok(prev => {
        const combined = [...prev, ...uj];
        return Array.from(new Map(combined.map(item => [item.ISBN, item])).values());
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchData = async (query, pagenum, category, filters) => {
    if (!query && !category && !filters) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pagenum, limit: 10 });

      if (category) params.set('kat', category);
      if (query) {
        params.set('cim', query);
        params.set('szerzo', query);
      }

      if (filters) {
        if (filters.kiado) params.set('kiado', filters.kiado);
        if (filters.nyelv) params.set('nyelv', filters.nyelv);
        if (filters.borito) params.set('borito', filters.borito);
        if (filters.tipus) params.set('tipus', filters.tipus);
        if (filters.armin) params.set('armin', filters.armin);
        if (filters.armax) params.set('armax', filters.armax);
      }

      const response = await httpCommon.get(`/konyvek/search?${params.toString()}`);
      const uj = Array.isArray(response.data) ? response.data : [];

      setHasMoreSearch(uj.length === 10);

      setTalalatok(prev => {
        const combined = [...prev, ...uj];
        return Array.from(new Map(combined.map(item => [item.ISBN, item])).values());
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const fetchResults = async () => {
    if (!searchQuery && !activeCategory && !Object.values(safeFilters).some(f => f)) {
      try {
        setLoading(true);
        const res = await httpCommon.get(`/konyvek?page=${page}&limit=10`);
        const uj = Array.isArray(res.data) ? res.data : [];
        setTalalatok(prev => [...prev, ...uj]);
        setHasMore(uj.length === 10);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ page: searchPage, limit: 10 });
      if (searchQuery) params.set("cim", searchQuery) && params.set("szerzo", searchQuery);
      if (activeCategory) params.set("kat", activeCategory);
      Object.entries(safeFilters).forEach(([k,v]) => v && params.set(k,v));

      const res = await httpCommon.get(`/konyvek/search?${params.toString()}`);
      const uj = Array.isArray(res.data) ? res.data : [];

      setTalalatok(prev => searchPage === 1 ? uj : [...prev, ...uj]);
      setHasMoreSearch(uj.length === 10);
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
