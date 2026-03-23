import './filter.css';
import { useState, useEffect } from 'react';
import httpCommon from '../http-common';
import { useSearchParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Filters({ onSearch, talalatok, activeFilters, setActiveFilters, searchQuery, activeCategory }) {
  const [kiadok, setKiadok] = useState([]);
  const [nyelvek, setNyelvek] = useState([]);
  const [boritok, setBoritok] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    kiado: '',
    nyelv: '',
    borito: '',
    tipus: '',
    armin: '',
    armax: ''
  });

  useEffect(() =>{
    const fetchDynamicFilters = async () =>{
      try{
        const response = await httpCommon.get('/konyvek/elerheto-szurok', {
          params: { 
            cim: searchQuery, 
            kat: activeCategory 
          }
        });
        const { kiadok, nyelvek, boritok, tipusok } = response.data;
        
        setKiadok(kiadok);
        setNyelvek(nyelvek);
        setBoritok(boritok);
        setTipusok(tipusok);
      }
      catch(err){
        console.error(err)
      }
    }
    fetchDynamicFilters();
  }, [searchQuery, activeCategory])

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      kiado: params.kiado || '',
      nyelv: params.nyelv || '',
      borito: params.borito || '',
      tipus: params.tipus || '',
      armin: params.armin || '',
      armax: params.armax || ''
    });
  }, [searchParams]);

  const handleSelectFilter = (key, value) => {
  setFilters(prev => ({
    ...prev,
    [key]: prev[key] === value ? '' : value 
  }));
};

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();

    if (searchQuery) newParams.set("search", searchQuery);
    if (activeCategory) newParams.set("kat", activeCategory);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    setSearchParams(newParams);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    const empty = {
      kiado: '',
      nyelv: '',
      borito: '',
      tipus: '',
      armin: '',
      armax: ''
    };
    setFilters(empty);
    setActiveFilters(empty);
    onSearch(searchQuery, 1, activeCategory, empty);
    setSearchParams(activeCategory ? { kat: activeCategory } : {});
  };

  return (
    <div className="filter_fodiv">
        <div className="filter_buttons">
            <Button className="apply-filters-btn" onClick={handleApplyFilters}>
                Szűrés
            </Button>
            <Button className="clear-filters-btn" onClick={handleClearFilters}>
                Szűrők törlése
            </Button>
      </div>
      <div className="selected_filters">
        {Object.entries(filters).map(([key, value]) =>
          value ? (
            <span
              key={key}
              className="selected_filter_tag"
              onClick={() => handleSelectFilter(key, '')}
            >
              {value} ×
            </span>
          ) : null
        )}
      </div>

     <h3>Kiadó:</h3>
      <div className="filter_options">
        {kiadok.map((k, index) => (
          <span
            key={index}
            className={`kat ${filters.kiado === k ? 'active' : ''}`}
            onClick={() => handleSelectFilter('kiado', k)}
          >
            {k}
          </span>
        ))}
      </div>

      <h3>Nyelv:</h3>
  <div className="filter_options">
  {nyelvek.map((n, index) => (
    <span
      key={index}
      className={`kat ${filters.nyelv === n ? 'active' : ''}`}
      onClick={() => handleSelectFilter('nyelv', n)}
    >
      {n}
    </span>
  ))}
</div>

 <h3>Borító:</h3>
<div className="filter_options">
  {boritok.map((b, index) => (
    <span
      key={index}
      className={`kat ${filters.borito === b ? 'active' : ''}`}
      onClick={() => handleSelectFilter('borito', b)}
    >
      {b}
    </span>
  ))}
</div>
  <h3>Típus:</h3>
  <div className="filter_options">
    {tipusok && tipusok.map((t, index) => (
      <span
        key={index}
        className={`kat ${filters.tipus === t ? 'active' : ''}`}
        onClick={() => handleSelectFilter('tipus', t)}
      >
        {t}
      </span>
    ))}
      </div>
    </div>
  );
}
