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

export default function Header({ onSearch, accessToken, setAccessToken }) {
  const [fokat, setFokat] = useState([]);
  const [keresett, setKeresett] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const fetchData = async () => {
    try {
      const response = await http.get("/konyvek/kategoria");
      setFokat(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSearch = () => {
    if (!keresett.trim()) return;
    setSearchParams({}, { replace: true });

    onSearch(keresett, 1, null);
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
          <NavDropdown.Item >Rendeléseim</NavDropdown.Item>
          <NavDropdown.Item >Segítség</NavDropdown.Item>
          <NavDropdown.Item >Kijelentkezés</NavDropdown.Item>    
    </NavDropdown>
  );

  return (
    <header>
      <Navbar expand="lg" className="bg-body-tertiary">
        <NavItem style={{ marginLeft: "14px" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2>Bolt</h2>
          </a>
        </NavItem>

        <Container>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse
              id="basic-navbar-nav"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Nav
                className="me-auto"
                style={{ display: "flex", flexDirection: "row", gap: "20px" }}
              >
                <CategoryDropdown title="Kategóriák" />
              </Nav>

              <NavItem
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    placeholder="Keresés..."
                    style={{
                      width: "300px",
                      height: "30px",
                      border: "1px solid rgba(0,0,0,0.25)",
                    }}
                    value={keresett}
                    onChange={(e) => setKeresett(e.target.value)}
                    type="search"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />

                  <button
                    style={{
                      width: "40px",
                      height: "30px",
                      border: "1px solid rgba(0,0,0,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                    onClick={handleSearch}
                  >
                    <FaMagnifyingGlass />
                  </button>
                </div>

                <Popup
                  trigger={
                    <div
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
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
                  modal
                  nested
                  open={showAuthPopup}
                  onClose={() => setShowAuthPopup(false)}
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
                    >{showLoginForm ? (
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

                      <div style={{ textAlign: "right", marginTop: "10px" }}>
                        <button onClick={close}>Bezárás</button>
                      </div>
                    </div>
                  )}
                </Popup>

                <a href="/cart">
                  <TfiShoppingCartFull />
                </a>
              </NavItem>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}