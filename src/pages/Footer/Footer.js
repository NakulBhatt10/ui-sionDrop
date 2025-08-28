import React from "react";
import "./footer.css";
import linkedin from "../../assets/images/linkedin.png";
import github from "../../assets/images/github.png";
import leetcode from "../../assets/images/LeetCode.png";
import coursera from "../../assets/images/Coursera.png";
import myPhoto from "../../assets/1727192692753.jpeg"; // 👈 add your photo to assets/images

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
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
      <div className="about-section">
        <img src={myPhoto} alt="Nakul Bhatt" className="about-photo" />
        <div className="about-text">
          <h2>About Me</h2>
          <p>
            Hi, I’m <strong>Nakul Bhatt</strong> a passionate developer who
            loves building creative and impactful projects.
          </p>
          <p>
            I enjoy working with modern web technologies, solving real-world
            problems and continuously learning new skills. 🚀
          </p>
        </div>
      </div>


      <h3 className="footer-connect-text">
        Check out my work on below platforms
      </h3>
      <ul className="social-icon">
        <li className="social-icon__item">
          <div className="glass-social-icon">
            <a
              className="social-icon__link"
              href="https://www.linkedin.com/in/nakul-bhatt-157aba24a/"
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
              href="https://github.com/NakulBhatt10"
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
              href="https://leetcode.com/u/Nakul_Bhatt/"
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
              href="https://www.coursera.org/account-profile"
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
