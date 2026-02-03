import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Filters from './components/filter';
import Fooldal from './components/fooldal';
import { useState, useEffect } from 'react';
import Main from './components/main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer';
import Termek from './components/termek';
import Ászf from './components/ÁSZF'
import Rolunk from './components/rolunk';
import Elerhetosegek from './components/elerhetosegek';
import Kosar from './components/kosar';
import Profil from './components/profil';
import Segitseg from './components/segitseg';
import Fizetes from './components/fizetes';
import Koszonjuk from './components/Koszonjuk';
import Rendelesek from './components/Rendelesek';
import AdminModositasok from './components/adminmodositas';
import AdminUser from './components/adminusermodositas';
import AdminBook from './components/adminosszeskonyv';
import AdminInsertBook from './components/adminujadat';


function App() {
  const [talalatok, setTalalatok] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [rawResults, setRawResults] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [hasSearchOrCategory, setHasSearchOrCategory] = useState(false);
  const [jogosultsag, setJogosultsag] = useState("")




useEffect(() => {
  const refreshToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      console.log("Refresh token response:", data);
      setAccessToken(data.accessToken);
    } catch(err){
      console.error(err);
    }
  };
  refreshToken();
}, []);

const handleSearch = async (query, pageNum = 1, category = null, filters = {}) => {
  setSearchQuery(query);        
  setActiveCategory(category);
  setActiveFilters(filters);
  setSearchPage(pageNum);

  const params = new URLSearchParams({ page: pageNum, limit: 10 });
  if (category) params.set("kat", category);
  if (query) params.set("cim", query) ; params.set("szerzo", query);
  Object.entries(filters).forEach(([key, val]) => { if(val) params.set(key, val); });

  const res = await fetch(`/konyvek/search?${params.toString()}`);
  const data = await res.json();

  setTalalatok(data);
  setHasMoreSearch(data.length === 10);
  setHasSearchOrCategory(true);
};


  return (
    <Router>

      <div className="app">

        <Header onSearch={handleSearch}  accessToken={accessToken} setAccessToken={setAccessToken} />
        <main>
          <Routes>

            <Route path="/" element={
                <>
                {!searchQuery && !activeCategory && <Main />}


                  <div style={{ display: "flex" }}>
                  {hasSearchOrCategory && talalatok.length > 0 && (
                    <Filters
                      onSearch={handleSearch}
                      talalatok={talalatok}
                      activeFilters={activeFilters}
                      setActiveFilters={setActiveFilters}
                      searchQuery={searchQuery}
                      activeCategory={activeCategory}
                    />
                  )}

                  <Fooldal
                    talalatok={talalatok}
                    setTalalatok={setTalalatok}
                    searchQuery={searchQuery}
                    searchPage={searchPage}
                    setSearchPage={setSearchPage}
                    hasMoreSearch={hasMoreSearch}
                    setHasMoreSearch={setHasMoreSearch}
                    page={page}
                    setPage={setPage}
                    hasMore={hasMore}
                    setHasMore={setHasMore}
                    activeCategory={activeCategory}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                  />
                </div>
                </>
              }
            />

            <Route path="/termek/:isbn" element={<Termek />} />
            <Route path="/ASZF" element={<Ászf />} />
            <Route path="/rolunk" element={<Rolunk />} />
            <Route path="/elerhetosegek" element={<Elerhetosegek />} />
            <Route path="/cart" element={<Kosar accesToken={accessToken}/>} />
            <Route path="/fizetes" element={<Fizetes accessToken={accessToken}/>} />
            <Route path="/profil" element={<Profil accessToken={accessToken} setAccessToken={setAccessToken} />} />
            <Route path="/rendelesek" element={<Rendelesek accessToken={accessToken} setAccessToken={setAccessToken} />}/>
            <Route path="/adminmodosit" element={<AdminModositasok accessToken={accessToken}/>} />
            <Route path="/adminuser" element={<AdminUser accessToken={accessToken}/>} />
            <Route path="/adminbook" element={<AdminBook accessToken={accessToken}/>} />
            <Route path="/admininsert" element={<AdminInsertBook accessToken={accessToken}/>} />
            <Route path="/segitseg" element={<Segitseg/>} />
            <Route path='/koszonjuk' element={<Koszonjuk/>}/>


          </Routes>
        </main>
        <Footer /> 
      </div>

    </Router>
  );
}

export default App;