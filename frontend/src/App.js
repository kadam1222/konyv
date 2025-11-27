import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css'
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState } from 'react';
import Main from './components/main';

function App() {
  const [talalatok, setTalalatok] = useState(null);

  const handleSearch = (eredmeny) => {
    setTalalatok(eredmeny);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      {talalatok === null && <Main />}
      <div style={{display:"flex"}}>
        {talalatok !== null && talalatok.length > 0 && <Filters />}
        <Fooldal talalatok={talalatok} />
      </div>
    </>
  );
}

export default App;
