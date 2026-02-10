import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="topSection">
        <div className="leftBlock">
          <h2 className="brand">
            <span className="logo"></span>
            BookBar
          </h2>

          <p className="description">
            Legyen mindig képben az irodalommal! <br />
          </p>

          <div className="linksRow">
            <a href="/rolunk">Rólunk</a>
            <a href="/ASZF">ÁSZF</a>
            <a href="/elerhetosegek">Elérhetőségek</a>
          </div>
        </div>
      </div>

      <hr className="line" />

      <div className="bottomSection">
        <p className="copy">© 2025 BookBar. All rights reserved.</p>

        <div className="iconRow">
          <a
            href="https://www.facebook.com/librikonyvesboltok/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon"
          >
            <FaFacebook />
          </a>

          <a href="https://www.linkedin.com/company/libri-bookline/" target="_blank" rel="noopener noreferrer" className="icon"
          >
            <FaLinkedin />
          </a>

          <a href="https://www.instagram.com/libri_konyvesboltok/" target="_blank" rel="noopener noreferrer" className="icon">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}
