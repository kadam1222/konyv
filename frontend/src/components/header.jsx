import { TfiShoppingCartFull } from "react-icons/tfi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect, useState } from "react";
import { NavItem } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import http from "../http-common";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import LoginForm from "./loginform";
import RegisterForm from "./registerform";
import { useNavigate } from "react-router-dom";

export default function Header({ onSearch, accessToken, setAccessToken }) {
   const navigate = useNavigate();
  const [fokat, setFokat] = useState([]);
  const [keresett, setKeresett] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true)
  const [cartCount, setCartCount] = useState(0);


  const fetchData = async () => {
    try {
      const response = await http.get("/konyvek/kategoria");
      setFokat(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const updateCartCount = () => {
        const kosar = JSON.parse(localStorage.getItem("kosar")) || [];
        const count = kosar.reduce((sum, item) => sum + item.mennyiseg, 0);
        setCartCount(count);
      };
      updateCartCount();
      window.addEventListener("storage", updateCartCount);
      fetchData();
      return () => window.removeEventListener("storage", updateCartCount);
  }, []);
 const handleSearch = () => {
  if (!keresett.trim()) return;

  navigate(`/?search=${keresett}`, { replace: true });

  onSearch(keresett, 1, null, {});
};



  const handleFilter = async (katNev) => {
    setSearchParams({ kat: katNev });
    onSearch("", 1, katNev);
  };

  const CategoryDropdown = ({ title }) => (
    <NavDropdown title={title} id={`nav-${title}`}>
      {fokat
        .filter((f) => !f.katazon)
        .map((f) => (
          <NavDropdown key={f.id} title={f.kat_nev} id={`nav-sub-${f.id}`}>
            {fokat.filter((k) => k.katazon === f.id).length > 0 ? (
              fokat
                .filter((k) => k.katazon === f.id)
                .map((sub) => (
                  <NavDropdown.Item
                    key={sub.id}
                    onClick={() => handleFilter(sub.kat_nev)}
                  >
                    {sub.kat_nev}
                  </NavDropdown.Item>
                ))
            ) : (
              <NavDropdown.Item disabled>
                Nincs alkategória
              </NavDropdown.Item>
            )}
          </NavDropdown>
        ))}
    </NavDropdown>
  );

  const Profildropdown = () => (
    <NavDropdown title="Profilom" id="asd">
          <NavDropdown.Item onClick={() => navigate("/profil")}>Személyes adatok</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/rendelesek")} >Rendeléseim</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/segitseg")}>Segítség</NavDropdown.Item>
          {isAdmin ? <NavDropdown.Item onClick={() => navigate("/adminmodosit")}>Rendelések módosítása</NavDropdown.Item> : ""}
          {isAdmin ? <NavDropdown.Item onClick={() => navigate("/adminuser")}>Felhasználók módosítása</NavDropdown.Item> : ""}
          {isAdmin ? <NavDropdown.Item onClick={() => navigate("/adminbook")}>Könyvek módosítása</NavDropdown.Item> : ""}
          {isAdmin ? <NavDropdown.Item onClick={() => navigate("/admininsert")}>Új adatok felvétele</NavDropdown.Item> : ""}
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
    <header style={{backgroundColor:"#ceb795ff"}}>
      <Navbar expand="lg">
        <NavItem style={{ marginLeft: "14px" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2>Bolt</h2>
          </a>
        </NavItem>

        <Container>
          <div
            style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav" style={{ display: "flex", alignItems: "center",justifyContent: "space-between",width: "100%"}}>
              <Nav className="me-auto"style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                <CategoryDropdown title="Kategóriák" />
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
                  }}
                >
                  {(close) => (
                    <div
                      style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "400px",
                        maxWidth: "90%",
                      }}
                    >
                     <div className="popup-close-icon" onClick={close}>
                        ×
                      </div> 
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
                  )}
                </Popup>
                }
                <a href="/cart" style={{ position: "relative" }}>
                  <TfiShoppingCartFull />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </a>

              </NavItem>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}