
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiRequest, getToken } from "../api.js";
import logo from "../assets/gidy-logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Career Match", to: "/jobsearch" },
  { label: "Resume Intelligence", to: "/intelligence" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      if (!getToken()) {
        if (active) setUser(null);
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me");
        if (active) setUser(data.user || data);
      } catch {
        localStorage.removeItem("avoraToken");
        localStorage.removeItem("avoraUser");
        if (active) setUser(null);
      }
    };

    fetchUser();

    window.addEventListener("storage", fetchUser);
    window.addEventListener("avora-auth-change", fetchUser);

    return () => {
      active = false;
      window.removeEventListener("storage", fetchUser);
      window.removeEventListener("avora-auth-change", fetchUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("avoraToken");
    localStorage.removeItem("avoraUser");

    setUser(null);
    setOpen(false);
    navigate("/signin");
  };

  return (
    <header className={`navWrap ${scrolled ? "navWrap--scrolled" : ""}`}>
      <div className="navInner advancedNav">
        <div className="brand" onClick={() => navigate("/")}>
          <img className="brandLogo" src={logo} alt="AVORA AI logo" />
          <span className="brandText">AVORA AI</span>
        </div>

        <nav className="navLinks">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `navLink ${isActive ? "isActive" : ""}`
              }
            >
              {item.label}
              <span className="linkLine" />
            </NavLink>
          ))}
        </nav>

        <div className="navRight" ref={wrapRef}>
          {user ? (
            <div className="userMenu">
              <button
                className="userTrigger modernUser"
                onClick={() => setOpen((v) => !v)}
              >
                <div className="avatarCircle">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </button>

              {open && (
                <div className="userDropdown modernDropdown">
                  <div className="userInfo">
                    <div className="avatarBig">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="userName">{user.name}</div>
                      <div className="userEmail">{user.email}</div>
                    </div>
                  </div>

                  <button
                    className="dropdownItem"
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>

                  <button
                    className="dropdownItem logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="loginModern"
                onClick={() => setOpen((v) => !v)}
              >
                Login
              </button>

              {open && (
                <div className="authWrap">
                  <button
                    className="btnSignInNew"
                    onClick={() => {
                      setOpen(false);
                      navigate("/signin");
                    }}
                  >
                    Sign In
                  </button>

                  <button
                    className="btnSignUpNew"
                    onClick={() => {
                      setOpen(false);
                      navigate("/signup");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
