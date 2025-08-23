
import React from "react";
import "./footer.css";
import linkedin from "../../assets/images/linkedin.png";
import github from "../../assets/images/github.png";
import leetcode from "../../assets/images/LeetCode.png";
import hackerrank from "../../assets/images/hackerrank.svg";
import coursera from "../../assets/images/Coursera.png";

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled past Home section (assume Home is at top)
      const homeSection = document.getElementById("home");
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        setShowTopBtn(rect.bottom < 0);
      } else {
        setShowTopBtn(window.scrollY > 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <h3 className="footer-connect-text">
        Check out my work on below platforms
      </h3>
      <ul className="social-icon">
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://www.linkedin.com/in/parth-bhatt-092024186/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={linkedin} alt="LinkedIn" />
            </a>
          </div>
        </li>
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://github.com/parthbhatt268"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </li>
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://leetcode.com/u/Parth_Bhatt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={leetcode} alt="LeetCode" />
            </a>
          </div>
        </li>
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://www.hackerrank.com/profile/parthbhatt_268"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={hackerrank} alt="HackerRank" />
            </a>
          </div>
        </li>
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://www.coursera.org/user/44ed270aca8e5b9b23aed34522b3d0d9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={coursera} alt="Coursera" />
            </a>
          </div>
        </li>
      </ul>

      <p>&copy;2025 Nakul Bhatt | All Rights Reserved</p>
      <div className="footer-made-with">
        Made with{" "}
        <span role="img" aria-label="love">
          ❤️
        </span>{" "}
        in Mumbai, India
      </div>
      {showTopBtn && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
