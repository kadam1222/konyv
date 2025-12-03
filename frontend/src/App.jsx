import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css'
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState } from 'react';
import Main from './components/main';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/footer';

function App() {
  const [talalatok, setTalalatok] = useState(null);

  const handleSearch = (eredmeny) => {
    setTalalatok(eredmeny);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Router>
        <Header onSearch={handleSearch} />

        {talalatok === null && <Main />}

        <div style={{ display: "flex" }}>
          {talalatok !== null && talalatok.length > 0 && <Filters onSearch={handleSearch} talalatok={talalatok}/>}
          <Fooldal talalatok={talalatok} />
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
