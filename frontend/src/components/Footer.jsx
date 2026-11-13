
import logo from "../assets/gidy-logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerBrand">
          <img className="footerLogo" src={logo} alt="AVORA AI" />

          <div>
            <div className="footerTitle">AVORA AI</div>

            <div className="footerText">
              Your Career. Your Potential. Your Future.
              <br />
              AI-powered career intelligence and skill development.
            </div>

            <div className="footerLinks">
              <span className="footerLink">Career Intelligence</span>
              <span className="footerLink">Machine Learning</span>
              <span className="footerLink">Skill Development</span>
            </div>
          </div>
        </div>

        <div className="footerCopyright">
          © {new Date().getFullYear()} AVORA AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
