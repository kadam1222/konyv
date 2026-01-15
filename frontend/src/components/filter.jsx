import './filter.css';
import { useState, useEffect } from 'react';
import httpCommon from '../http-common';
import { useSearchParams } from 'react-router-dom';

export default function Filters({ onSearch, talalatok, activeFilters, setActiveFilters, searchQuery, activeCategory }) {
  const [kiadok, setKiadok] = useState([]);
  const [nyelvek, setNyelvek] = useState([]);
  const [boritok, setBoritok] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [error, setError] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    kiado: '',
    nyelv: '',
    borito: '',
    tipus: '',
    armin: '',
    armax: ''
  });

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await httpCommon.get(`/konyvek/${endpoint}`);
      setter(response.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData('kiadok', setKiadok);
    fetchData('nyelv', setNyelvek);
    fetchData('borito', setBoritok);
    fetchData('tipus', setTipusok);
  }, []);

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
    setFilters(prev => ({ ...prev, [key]: value }));
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
    onSearch(searchQuery, 1, activeCategory, filters);
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
        {kiadok.map(k => (
          <span
            key={k.id}
            className={`kat ${filters.kiado === k.kiado_nev ? 'active' : ''}`}
            onClick={() => handleSelectFilter('kiado', k.kiado_nev)}
          >
            {k.kiado_nev}
          </span>
        ))}
      </div>

      <h3>Nyelv:</h3>
      <div className="filter_options">
        {nyelvek.map(n => (
          <span
            key={n.id}
            className={`kat ${filters.nyelv === n.nyelv_nev ? 'active' : ''}`}
            onClick={() => handleSelectFilter('nyelv', n.nyelv_nev)}
          >
            {n.nyelv_nev}
          </span>
        ))}
      </div>

      <h3>Borító:</h3>
      <div className="filter_options">
        {boritok.map(b => (
          <span
            key={b.id}
            className={`kat ${filters.borito === b.borito_nev ? 'active' : ''}`}
            onClick={() => handleSelectFilter('borito', b.borito_nev)}
          >
            {b.borito_nev}
          </span>
        ))}
      </div>

      <h3>Típus:</h3>
      <div className="filter_options">
        {tipusok.map(t => (
          <span
            key={t.id}
            className={`kat ${filters.tipus === t.tipus_nev ? 'active' : ''}`}
            onClick={() => handleSelectFilter('tipus', t.tipus_nev)}
          >
            {t.tipus_nev}
          </span>
        ))}
      </div>

      <h3>Ár:</h3>
      <div className="arak_range">
        <input
          type="number"
          placeholder="Min"
          value={filters.armin}
          onChange={e => handleSelectFilter('armin', e.target.value)}
        />
        <span>Ft - </span>
        <input
          type="number"
          placeholder="Max"
          value={filters.armax}
          onChange={e => handleSelectFilter('armax', e.target.value)}
        />
        <span>Ft</span>
      </div>

      <div className="filter_buttons">
        <button className="apply-filters-btn" onClick={handleApplyFilters}>
          Apply Filters
        </button>
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>
    </div>
  );
}
