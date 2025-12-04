import Carousel from 'react-bootstrap/Carousel';
import "./main.css"

function Main() {
  return (
<div className="carousel-wrapper">
      <Carousel className="carousel-fixed">

        <Carousel.Item>
          <div className="carousel-frame">
            <img className="carouselimg" src="/kepek/stockimage1.jpg" />
          </div>
          <Carousel.Caption>
            <h2 style={{color : "black"}}>Legjobb könyvek!</h2>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <div className="carousel-frame">
            <img className="carouselimg" src="/kepek/stockimage2.jpg" />
          </div>
          <Carousel.Caption>
            <h2 style={{color : "black"}}>Minden korosztály számára!</h2>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <div className="carousel-frame">
            <img className="carouselimg" src="/kepek/stockimage3.jpg" />
          </div>
          <Carousel.Caption>
            <h2 style={{color : "black"}}>Akciók!</h2>
            <p style={{color : "black"}}>Nálunk mindig a legjobb árakon vásárolhatsz!</p>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>
    </div>
  );
}

export default Main;