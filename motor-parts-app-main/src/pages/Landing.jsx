// src/pages/Landing.jsx
import "./Landing.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="slider-container">
      <section className="slide slide-1">
        <div className="overlay">
          <h1 className="highlight-title fade-in">Welcome to Motor Parts Automation</h1>
          <p className="fade-in">Simplifying the buying and selling of motor parts with ease and automation.</p>
        </div>
        <div className="scroll-down">↓</div>
      </section>

      <section className="slide slide-2">
        <div className="overlay">
          <h2 className="fade-in">Login or Signup</h2>
          <p className="fade-in">Choose your role and get started today.</p>
          <div className="button-group">
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Sign Up</button></Link>
          </div>
        </div>
      </section>

      <section className="slide slide-3">
        <div className="overlay">
          <h2 className="fade-in">Join as Vendor or Customer</h2>
          <p className="fade-in">Explore, manage and trade motor parts effortlessly through our automated platform.</p>
        </div>
      </section>

      <section className="slide slide-4">
        <div className="overlay about-us fade-in">
          <h2>About Us</h2>
          <p>This software was designed and implemented by:</p>
          <ul>
            <li>Umang Tiwari</li>
            <li>Sarita Mardi</li>
            <li>Anjum Rizwan</li>
            <li>Premnidhi Gahir</li>
          </ul>
        </div>
        <a href="#top" className="back-to-top">↑ Back to Top</a>
      </section>
    </div>
  );
}

export default Landing;
