import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState } from 'react';
import Main from './components/main';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/footer';

function App() {
  const [talalatok, setTalalatok] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (query, pageNum = 1) => {
    if(pageNum === 1) setTalalatok([]); 

    setSearchQuery(query);

    try {
      const response = await fetch(`/konyvek/fokereso?page=${pageNum}&limit=10&cim=${query}&szerzo=${query}`);
      const data = await response.json();

      if(data.length < 10) setHasMoreSearch(false);
      else setHasMoreSearch(true);

      setTalalatok(prev => pageNum === 1 ? data : [...prev, ...data]);
      setSearchPage(pageNum);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Router>
        <Header onSearch={handleSearch} />

        {talalatok.length === 0 && <Main />}

        <div style={{ display: "flex" }}>
          {talalatok.length > 0 && <Filters onSearch={handleSearch} talalatok={talalatok} />}
          <Fooldal
            talalatok={talalatok}
            searchQuery={searchQuery}
            searchPage={searchPage}
            setSearchPage={setSearchPage}
            hasMoreSearch={hasMoreSearch}
            setHasMoreSearch={setHasMoreSearch}
            setTalalatok={setTalalatok}
            page={page}
            setPage={setPage}
            hasMore={hasMore}
            setHasMore={setHasMore}
          />

        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
