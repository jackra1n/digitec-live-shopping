import "./Footer.css";

function Footer() {

  let currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-container">
        <div>© {currentYear} jackra1n</div>
        <div className="footer-disclaimer">This website isn't associated with digitec Galaxus AG!</div>
      </div>
    </footer>
  );
}

export default Footer;
