import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState } from 'react';
import Main from './components/main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer';
import Termek from './components/termek';

function App() {
  const [talalatok, setTalalatok] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [rawResults, setRawResults] = useState([]);

  const handleSearch = async (query, pageNum = 1) => {
    if (!query) {
      setTalalatok([]);
      return;
    }

    try {
      const res = await fetch(
        `/konyvek/fokereso?page=${pageNum}&limit=10&cim=${query}&szerzo=${query}`
      );
      const data = await res.json();

      setTalalatok(prev =>
        pageNum === 1 ? data : [...prev, ...data]
      );

      setSearchQuery(query);
      setSearchPage(pageNum);
      setHasMoreSearch(data.length === 10);
      setRawResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Router>
      <div className="app">

        <Header onSearch={handleSearch} />

        <Routes>

          {/* FŐOLDAL */}
          <Route
            path="/"
            element={
              <>
                {talalatok.length === 0 && <Main />}

                <div style={{ display: "flex" }}>
                  {talalatok.length > 0 && (
                    <Filters
                      onSearch={setTalalatok}
                      talalatok={rawResults}
                    />
                  )}

                  <Fooldal
                    talalatok={talalatok}
                    searchQuery={searchQuery}
                    searchPage={searchPage}
                    setSearchPage={setSearchPage}
                    hasMoreSearch={hasMoreSearch}
                    setHasMoreSearch={setHasMoreSearch}
                    page={page}
                    setPage={setPage}
                    hasMore={hasMore}
                    setHasMore={setHasMore}
                  />
                </div>
              </>
            }
          />

          {/* TERMÉK */}
          <Route path="/termek/:isbn" element={<Termek />} />

        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
