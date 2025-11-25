import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css'
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState } from 'react';

function App() {
  const [talalatok, setTalalatok] = useState(null);

  const handleSearch = (eredmeny) => {
    setTalalatok(eredmeny);
  };

  return (
    <>
      <Header onSearch={handleSearch} />

      <div style={{display:"flex"}}>
        <Filters />
        <Fooldal talalatok={talalatok} />
      </div>
    </>
  );
}

export default App;
