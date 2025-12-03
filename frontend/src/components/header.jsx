import { TfiShoppingCartFull } from "react-icons/tfi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import http from "../http-common";
import { useEffect ,useState } from "react";
import { NavItem } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export default function Header({ onSearch }) {
  const [fokat, setFokat] = useState([]);
  const [keresett, setKeresett] = useState("");
  const [formData, setFormData] = useState({
        alkat: "",
        tipus: "",
    });
  const [searchParams, setSearchParams] = useSearchParams();

const handleFilter = async (kat) => {
  setSearchParams({ kat });

  try {
    const response = await http.get("/konyvek/search", {
      params: { kat }
    });

    onSearch(response.data);
  } catch (error) {
    console.error("Hiba a kategória szűrésnél:", error);
  }
};


  const CategoryDropdown = ({ title }) => (
    <NavDropdown title={title} id={`nav-${title}`}>
      {fokat
        .filter(f => !f.katazon)
        .map((f) => (
          <NavDropdown
            key={f.id}
            title={f.kat_nev}
            id={`nav-sub-${f.id}`}
          >
            {getSubcategories(f.id).length > 0 ? (
              getSubcategories(f.id).map(sub => (
                <NavDropdown.Item key={sub.id} onClick={() => handleFilter(sub.kat_nev)}>
                  {sub.kat_nev}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item disabled>Nincs alkategória</NavDropdown.Item>
            )}
          </NavDropdown>
        ))
      }
    </NavDropdown>
  );

  const getSubcategories = (parentId) => {
    return fokat.filter(k => k.katazon === parentId);
  };

  const fetchData = async () => {
    try{ 
      const response = await http.get('/konyvek/kategoria');
      setFokat(response.data);
    }
    catch(error){
      console.error('Error fetching data: ', error);
    }
  };

  const fetchFilterData = async (kereso) => {
    if (!kereso || kereso.trim() === "") {
    onSearch(null); 
    return;
  }
    
    try{ 
      const response = await http.get('/konyvek/fokereso?page=1&limit=10', {
        params: {
          cim: kereso,
          szerzo: kereso
        }
      });
      onSearch(response.data);
      

    } catch(error){
      console.error('Error fetching search data:', error);
    }
  };

  const fetchKategoria = async () =>{
    try{ 
      const response = await http.get('/konyvek/search');
      setFokat(response.data);
    }
    catch(error){
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(()=>{     
    const alkat = searchParams.get("alkat") || "";
    const tipus = searchParams.get("tipus") || ""; 
    setFormData({ alkat, tipus});
    fetchData();
  }, [searchParams]);
  
  return(
    <>

    <Navbar expand="lg" className="bg-body-tertiary">
      <NavItem style={{ marginLeft:"14px" }}>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2>Bolt</h2>
        </a>
      </NavItem>
      <Container>

        <div style={{
          display:"flex",
          alignItems: "center",
          justifyContent:"space-between",
          width: "100%"
        }}>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse 
            id="basic-navbar-nav"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >

            <Nav className="me-auto" style={{ display:"flex", flexDirection:"row", gap:"20px" }}>
              <CategoryDropdown title="Könyv" />
              <CategoryDropdown title="E-Könyv" />
              <CategoryDropdown title="Antikvárium" />
            </Nav>

            <NavItem style={{
              display:"flex",
              alignItems:"center",
              gap:"15px"
            }}>
              <div style={{ display:"flex", alignItems:"center" }}>
                <input 
                  placeholder="Keresés..." 
                  style={{ width:"300px", height:"30px", border:"1px solid rgba(0,0,0,0.25)" }}
                  onChange={(e) => setKeresett(e.target.value)}
                  value={keresett}
                  type="search"
                  onKeyDown={(e) =>{
                    if (e.key === "Enter"){
                      fetchFilterData(keresett)
                    }
                  }}
                />
                <button 
                  style={{ width:"40px", height:"30px", border:"1px solid rgba(0,0,0,0.25)" , display : "flex", alignItems : "center", padding : 0, justifyContent : "center"}}
                  onClick={() => fetchFilterData(keresett)}
                >
                  <FaMagnifyingGlass />
                </button>
              </div>

              <a>Belépés/Regisztráció</a>
              <a><TfiShoppingCartFull /></a>
            </NavItem>

          </Navbar.Collapse>
        </div>

      </Container>
    </Navbar>
      
    </>
  );
}
