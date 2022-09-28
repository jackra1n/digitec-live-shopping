import "./Header.css";
import logo from "../assets/logo.png";

function Header() {
  return (
    <header>
      <img id="header-logo" src={logo}/>
      <h1>digitec Live shopping</h1>
    </header>
  );
}

export default Header;
