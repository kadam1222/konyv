import { TfiShoppingCartFull } from "react-icons/tfi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useEffect, useState, useRef } from "react";
import { NavItem } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import http from "../http-common";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import LoginForm from "./loginform";
import RegisterForm from "./registerform";
import { useNavigate } from "react-router-dom";
import "./header.css"

export default function Header({ onSearch, accessToken, setAccessToken , showAuthPopup, setShowAuthPopup, showLoginForm, setShowLoginForm }) {
   const navigate = useNavigate();
  const [fokat, setFokat] = useState([]);
  const [keresett, setKeresett] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState([])
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const prevCartCount = useRef(0);
  const prevKosarRef = useRef([]);


  const fetchData = async () => {
    try {
      const response = await http.get("/konyvek/kategoria");
      setFokat(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Hiba a kategóriák lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect (() =>{
    if (!accessToken) return
    const fetchUser = async () =>{
      try{
        const response = await http.get("/konyvek/profil",   {       
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }},)
          const data =  response.data
          setUser(data)
          setIsAdmin(data.jogosultsag === 2)
      }
      catch(err){
        console.error(err)
      }
    }
    fetchUser()
  }, [accessToken])

useEffect(() => {
  const updateCart = () => {
    const ujKosar = JSON.parse(localStorage.getItem("kosar")) || [];
    const regiKosar = prevKosarRef.current;

    const ujOsszDarab = ujKosar.reduce((sum, item) => sum + item.mennyiseg, 0);
    const regiOsszDarab = regiKosar.reduce((sum, item) => sum + item.mennyiseg, 0);

    if (ujOsszDarab > regiOsszDarab) {
      let hozzaadottTermek = null;

      ujKosar.forEach((ujItem) => {
        const regiMegfelelo = regiKosar.find((r) => r.ISBN === ujItem.ISBN);
        

        if (!regiMegfelelo || ujItem.mennyiseg > regiMegfelelo.mennyiseg) {
          hozzaadottTermek = ujItem;
        }
      });

      if (hozzaadottTermek) {
        setLastAddedItem(hozzaadottTermek.cim);
        setShowToast(false); 
        setTimeout(() => setShowToast(true), 10); 
      }
    }

    setCartCount(ujOsszDarab);
    prevKosarRef.current = ujKosar; 
  };

  window.addEventListener("storage", updateCart);
  
  const alapKosar = JSON.parse(localStorage.getItem("kosar")) || [];
  setCartCount(alapKosar.reduce((sum, item) => sum + item.mennyiseg, 0));
  prevKosarRef.current = alapKosar;

  return () => window.removeEventListener("storage", updateCart);
}, []);


 const handleSearch = () => {
  if (!keresett.trim()) return;

  navigate(`/konyvlista?search=${keresett}`, { replace: true });

  onSearch(keresett, 1, null, {});
};


  const handleFilter = async (katNev) => {
    navigate(`/konyvlista?kat=${(katNev)}`);
    if (onSearch) {
    onSearch("", 1, katNev);
    }
  };

  const CategoryDropdown = ({ title }) => (
  <NavDropdown title={title} id="nav-kategoriak">
    {fokat && fokat.length > 0 ? (
      fokat
        .filter((f) => !f.katazon) 
        .map((f) => {
          const alkategoriak = fokat.filter((k) => k.katazon === f.id);
          if (alkategoriak.length > 0) {
            return (
              <NavDropdown
                key={f.id}
                title={f.kat_nev}
                id={`sub-${f.id}`}
                drop="end"
                className="dropdown-submenu"
              >
                {alkategoriak.map((sub) => (
                  <NavDropdown.Item
                    key={sub.id}
                    onClick={() => handleFilter(sub.kat_nev)}
                  >
                    {sub.kat_nev}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            );
          }
          return (
            <NavDropdown.Item
              key={f.id}
              onClick={() => handleFilter(f.kat_nev)}
            >
              {f.kat_nev}
            </NavDropdown.Item>
          );
        })
    ) : (
      <NavDropdown.Item disabled>Betöltés...</NavDropdown.Item>
    )}
  </NavDropdown>
);

const AdminDropdown = () => (
  <NavDropdown  drop="end" title="Adminisztráció" id="admin-nav-dropdown">
    <NavDropdown.Item onClick={() => navigate("/adminmodosit")}>Rendelések módosítása</NavDropdown.Item>
    <NavDropdown.Item onClick={() => navigate("/adminuser")}>Felhasználók módosítása</NavDropdown.Item>
    <NavDropdown.Item onClick={() => navigate("/adminbook")}>Könyvek módosítása</NavDropdown.Item>
    <NavDropdown.Item onClick={() => navigate("/admininsert")}>Új adatok felvétele</NavDropdown.Item>
    <NavDropdown.Item onClick={() => navigate("/admintorles")}>Adatok törlése</NavDropdown.Item>
  </NavDropdown>
);

  const Profildropdown = () => (
    <NavDropdown title="Profilom" id="asd">
          <NavDropdown.Item onClick={() => navigate("/profil")}>Személyes adatok</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/rendelesek")} >Rendeléseim</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/segitseg")}>Segítség</NavDropdown.Item>
          {isAdmin && <AdminDropdown />}
          <NavDropdown.Item onClick={handleLogout} >Kijelentkezés</NavDropdown.Item>    
    </NavDropdown>
  );
const handleLogout = async () => {
  try {
    await http.post(
      "/auth/logout",
      {},
      {
        withCredentials: true
      }
    );
  } catch (error) {
    console.error("Logout hiba:", error);
  } finally {
    setAccessToken(null);
    localStorage.removeItem("accessToken"); 
    navigate("/");
  }
};

  return (
    <header style={{backgroundColor:"#ceb795ff",zIndex: 1000}}>
      <Navbar>
        <NavItem style={{ marginLeft: "14px" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2>BookBar</h2>
          </a>
        </NavItem>

        <Container>
          <div
            style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav" style={{ display: "flex", alignItems: "center",justifyContent: "space-between",width: "100%"}}>
              <Nav className="me-auto"style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                <CategoryDropdown title="Kategóriák" />
                <NavItem style={{ marginLeft: "14px", marginTop:"7.8px" }}>
                    <a href="/konyvlista" style={{ textDecoration: "none", color: "inherit", fontSize:"16px" }}>
                      <span>Összes könyv</span>
                    </a>
                </NavItem>
              </Nav>

              <NavItem style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input placeholder="Keresés..." style={{ width: "300px", height: "30px", border: "1px solid rgba(0,0,0,0.25)", borderRadius: "4px",padding: "4px 8px",color: "#3a3a3a",fontSize: "14px",outlineColor: "#9f8d73",transition: "outline-color 0.2s ease", backgroundColor: "#ffffffec"}} value={keresett} onChange={(e) => setKeresett(e.target.value)} type="search"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />

                  <button style={{width: "40px",height: "30px", border: "1px solid rgba(0,0,0,0.25)",borderRadius: "0 4px 4px 0" ,display: "flex", alignItems: "center",  justifyContent: "center", padding: 0, backgroundColor: "#ffffffec", cursor: "pointer",color: "#9f8d73", transition: "color 0.2s ease"}}
                    onClick={handleSearch}
                  >
                    <FaMagnifyingGlass />
                  </button>
                </div>
                
                {accessToken ?  <Profildropdown title="Profil" /> :
                    <Popup
                  trigger={
                    <div
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "#3a3a3a",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "color 0.2s ease",
                      }}
                      onClick={() => {
                        if (accessToken) {
                          setAccessToken("");
                        } else {
                          setShowAuthPopup(true);
                          setShowLoginForm(true);
                        }
                      }}
                    >
                      {accessToken
                        ? <Profildropdown title="Profil" />
                        : "Belépés / Regisztráció"}
                    </div>
                  }
                  className="auth-popup"
                  modal
                  nested
                  open={showAuthPopup}
                  onClose={() => setShowAuthPopup(false)}
                  contentStyle={{
                    width: "480px",
                    maxWidth: "90%",
                    padding: "25px",
                    borderRadius: "12px",
                    backgroundColor: "#ceb795ff",
                    padding: "40px 25px",   
                    display: "flex",
                    justifyContent: "center",
                    position: "relative"
                  }}
                >
                  {(close) => (
                    <>
                    <div className="popup-close-icon" onClick={close}>
                        ×
                      </div> 
                    <div
                      style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "400px",
                        maxWidth: "90%",
                        position: "relative",
                        margin: "0 auto"
                      }}
                    >
                     
                      {showLoginForm ? (
                        
                        <LoginForm
                          setAccessToken={setAccessToken}
                          onClose={() => {
                            close();
                            setShowAuthPopup(false);
                          }}
                          switchToRegister={() => setShowLoginForm(false)}
                        />
                      ) : (
                        <RegisterForm
                          onClose={() => {
                            close();
                            setShowAuthPopup(false);
                          }}
                          switchToLogin={() => setShowLoginForm(true)}
                        />
                      )}

                      
                    </div>
                    </>
                  )}
                  
                </Popup>
                }
                <div style={{ position: "relative", display: "inline-block" }}>
              <a href="/cart" style={{ color: "#3a3a3a", fontSize: "20px" }}>
                <TfiShoppingCartFull />
                {cartCount > 0 && (
                  <span style={{ position: "absolute",top: "-8px",right: "-8px",background: "red",color: "white",borderRadius: "50%",padding: "2px 6px",fontSize: "12px",fontWeight: "bold", }}>
                    {cartCount}
                  </span>
                )}
              </a>


              <div className="toast_div">
               <Toast onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #ceb795" }} >
                  <Toast.Body style={{ fontSize: "13px", backgroundColor: "#fff", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "green", fontWeight: "bold" }}>✓</span>
                      <div>
                        <strong>Hozzáadva:</strong><br/>
                        <span style={{ color: "#555" }}>{lastAddedItem}</span>
                      </div>
                    </div>
                  </Toast.Body>
                </Toast>
              </div>
            </div>

              </NavItem>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}