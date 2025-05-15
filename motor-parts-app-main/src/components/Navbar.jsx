import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setRole(parsedUser.role);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const renderLinks = () => {
    if (role === "customer") {
      return (
        <>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/customer-dashboard" style={styles.link}>Dashboard</Link>
        </>
      );
    } else if (role === "vendor") {
      return (
        <>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/vendor-dashboard" style={styles.link}>Dashboard</Link>
        </>
      );
    } else if (role === "admin") {
      return (
        <>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/admin-dashboard" style={styles.link}>Dashboard</Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.link}>Signup</Link>
        </>
      );
    }
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>MotorParts</h2>

      <div style={{ ...styles.links, display: window.innerWidth > 768 ? "flex" : "none" }}>
        {renderLinks()}
      </div>

      <div style={styles.menuIcon} onClick={toggleMenu}>
        <span style={styles.menuText}>{menuOpen ? "×" : "☰"}</span>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {renderLinks()}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#2e2e2e",
    color: "#f5f5dc",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Outfit', sans-serif",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#f5f5dc",
  },
  links: {
    gap: "30px",
  },
  link: {
    marginLeft: "30px",
    color: "#f5f5dc",
    fontSize: "1rem",
    fontWeight: "500",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  menuIcon: {
    display: "none",
    cursor: "pointer",
  },
  menuText: {
    fontSize: "28px",
    color: "#f5f5dc",
    fontWeight: "600",
  },
  mobileMenu: {
    position: "absolute",
    top: "80px",
    right: "40px",
    backgroundColor: "#2e2e2e",
    padding: "20px 25px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  '@media screen and (maxWidth: 768px)': {},
};

// Inline media query for menu icon
if (window.innerWidth <= 768) {
  styles.menuIcon.display = "block";
  styles.links.display = "none";
}

export default Navbar;

