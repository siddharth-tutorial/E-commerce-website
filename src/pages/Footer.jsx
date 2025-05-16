import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowCircleUp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./footer.css";

export default function Footer() {
  const [showTopButton, setShowTopButton] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerData = [
    {
      heading: "Get to Know Us",
      links: ["Careers", "Blog", "About Amazon", "Investor Relations"],
    },
    {
      heading: "Make Money with Us",
      links: ["Sell Products", "Affiliate Program", "Advertise Products", "Self-Publish with Us"],
    },
    {
      heading: "Amazon Payment Products",
      links: ["Amazon Pay", "Reload Balance", "Currency Converter"],
    },
    {
      heading: "Let Us Help You",
      links: ["Your Account", "Shipping Rates", "Returns", "Help"],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#131921",
        color: "white",
        paddingTop: "2rem",
        paddingBottom: "1rem",
        marginTop: "4rem",
        fontSize: "0.9rem",
        position: "relative",
      }}
    >
      <Container>
        <Row className="g-4">
          {footerData.map((section, index) => (
            <Col xs={12} md={6} lg={3} key={index}>
              <h5 className="text-uppercase mb-3">
                {loading ? <Skeleton width={120} /> : section.heading}
              </h5>
              <ul className="list-unstyled">
                {loading
                  ? Array(4)
                      .fill()
                      .map((_, idx) => (
                        <li key={idx}>
                          <Skeleton width="80%" height={10} />
                        </li>
                      ))
                  : section.links.map((text, idx) => (
                      <li key={idx}>
                        <Link to="#" className="footer-link">
                          {text}
                        </Link>
                      </li>
                    ))}
              </ul>
            </Col>
          ))}
        </Row>

        <hr style={{ borderColor: "#333" }} className="my-4" />

        <Row className="text-center mb-3">
          <Col>
            {loading ? (
              <Skeleton width={160} height={30} />
            ) : (
              <div className="d-flex justify-content-center gap-4">
                 <Link to="#"  className="social-icon" aria-label="Facebook">
                  <FaFacebook size={24} />
                </Link>
                <Link to="#" className="social-icon" aria-label="Twitter">
                  <FaTwitter size={24} />
                </Link>
              <Link to="#" className="social-icon" aria-label="Instagram">
                  <FaInstagram size={24} />
                </Link>
                 <Link to="#"  className="social-icon" aria-label="LinkedIn">
                  <FaLinkedin size={24} />
                </Link>
              </div>
            )}
          </Col>
        </Row>

        <p className="text-center mb-0" style={{ fontSize: "0.85rem" }}>
          {loading ? <Skeleton width={200} /> : `© ${new Date().getFullYear()} Amazon. All rights reserved.`}
        </p>
      </Container>

      <AnimatePresence>
        {showTopButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              zIndex: 9999,
            }}
          >
            <FaArrowCircleUp
              onClick={handleScrollTop}
              style={{
                fontSize: "2.5rem",
                color: "#f0c14b",
                cursor: "pointer",
              }}
              title="Back to Top"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
