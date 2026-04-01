import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './kezdolap.css';
import { useState,useEffect ,useRef} from 'react';
import httpCommon from '../http-common';

function Kezdolap() {
  const navigate = useNavigate();
  const [alkategoriak, setAlkategoriak] = useState([]);
  const [ajanlottKonyvek, setAjanlottKonyvek] = useState([]);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState({ isAtStart: true, isAtEnd: false });

  const scroll = (direction) => {
  if (scrollRef.current) {
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8; 
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollPosition({
        isAtStart: scrollLeft <= 0,
        isAtEnd: scrollLeft + clientWidth >= scrollWidth - 1
      });
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, [ajanlottKonyvek]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await httpCommon.get("/konyvek/kategoria");
        

        const csakAlkat = response.data.filter(k => k.katazon !== null);
        const randomHaram = csakAlkat
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        const konyvRes = await httpCommon.get("/konyvek?page=1");
        setAjanlottKonyvek(konyvRes.data);

        setAlkategoriak(randomHaram);


      } catch (error) {
        console.error("Hiba az alkategóriák lekérésekor:", error);
      }
    };
    fetchSubCategories();
  }, []);

  return (
    <div className="kezdolap-container">
      <div className="hero-section">
        <Container>
          <Row className="align-items-center py-5">
            <Col md={6} className="text-md-start text-center">
              <h1 className="display-3 fw-bold">Találd meg a következő kalandod!</h1>
              <p className="lead">
                Több ezer könyv, a legfrissebb megjelenésektől a klasszikusokig. 
                Böngéssz kedvedre és rendeld házhoz kedvenceidet.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="Kosargomb px-5" 
                onClick={() => navigate('/konyvlista')}
              >
                Böngészés a könyvek között
              </Button>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <img 
                src="/kepek/stockimage5.png" 
                alt="Könyvek" 
                className="img-fluid floating-img"
                id='stockkep'
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        <h2 className="text-center mb-4">Népszerű kategóriák</h2>
        <Row>
        {alkategoriak.map((kat) => (
          <Col key={kat.id} md={4} className="mb-4">
            <Card 
              className="category-card border-0 shadow-sm h-100"
              style={{ cursor: 'pointer', borderRadius: "15px", overflow: 'hidden', transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              onClick={() => navigate(`/konyvlista?kat=${(kat.kat_nev)}`)}
            >
              <Card.Body className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "#dbc38c", minHeight: "120px" }}>
                <Card.Title className="fw-bold m-0">{kat.kat_nev}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </Container>

      <div style={{padding: "50px 0", position: "relative" }}>
  <Container style={{ position: "relative" }}>
    <h2 className="mb-4 fw-bold">Neked ajánljuk</h2>

    {!scrollPosition.isAtStart && (
      <button 
        onClick={() => scroll('left')}
        style={{
          position: "absolute", left: "-20px", top: "55%", zIndex: 10,
          background: "white", border: "1px solid #ddd", borderRadius: "50%",
          width: "40px", height: "40px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        ❮
      </button>
    )}
    <div 
      ref={scrollRef}
      className="d-flex flex-nowrap overflow-auto pb-3 gap-3" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        scrollSnapType: 'x mandatory', 
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {ajanlottKonyvek.map((konyv) => (
        <div key={konyv.ISBN} style={{ minWidth: '220px', maxWidth: '220px', scrollSnapAlign: 'start' }}>
          <Card 
            className="h-100 border-0 shadow-sm category-card"
            onClick={() => navigate(`/termek/${konyv.ISBN}`)}
            style={{ cursor: 'pointer', borderRadius: "10px", overflow:"hidden" }}
          >
            <div style={{ height: '330px', backgroundColor:"#F5F5DC" }}>
              <Card.Img 
                variant="top" 
                src={konyv.kep || `/kepek/${konyv.ISBN}.jpg`} 
                className='termek_kep2'
              />
            </div>
            <Card.Body className="p-2 d-flex flex-column" style={{backgroundColor:"#F5F5DC"}}>
              <Card.Title className="fs-6 fw-bold text-truncate mb-1">{konyv.cim}</Card.Title>
              <Card.Subtitle className="small text-muted mb-2">{konyv.szerzok}</Card.Subtitle>
              <div><strong> {konyv.ar} Ft </strong></div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>


    {!scrollPosition.isAtEnd && (
      <button 
        onClick={() => scroll('right')}
        style={{
          position: "absolute", right: "-20px", top: "55%", zIndex: 10,
          background: "white", border: "1px solid #ddd", borderRadius: "50%",
          width: "40px", height: "40px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        ❯
      </button>
    )}
  </Container>
  <style>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>
</div>
    </div>
  );
}

export default Kezdolap;