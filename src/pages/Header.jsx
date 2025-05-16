import React, { useState, useEffect } from "react";
import {
  Badge,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { FaShoppingCart, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../Components/ProductContext";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

import logo from '../img/logo.png';

function Header({ handleCartToggle, toggleDarkMode, darkMode, onSearch }) {
  const { cart } = useCart();
  const cartCount = cart.length;
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate loading categories
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Simulating async API call
    setTimeout(() => {
      setCategories(["electronics", "jewelery", "men's clothing", "women's clothing"]);
      setLoadingCategories(false);
    }, 1500); // 1.5s delay
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm.trim());
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      className="shadow sticky-top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" height="30" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            <NavDropdown title="Categories" id="category-dropdown">
              {loadingCategories ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-3 py-2">
                    <Skeleton width={120} height={16} />
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <NavDropdown.Item
                    key={category}
                    as={Link}
                    to={`/category/${encodeURIComponent(category)}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {category}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>

            <Nav.Link as={Link} to="/checkout">Checkout</Nav.Link>
            <Nav.Link as={Link} to="/thankyou">Thank You</Nav.Link>
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
            />
            <Button type="submit" variant={darkMode ? "outline-light" : "outline-dark"}>
              Search
            </Button>
          </Form>

          {/* Icons */}
          <Nav className="align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>

            {/* User Dropdown */}
            <NavDropdown
              title={<FaUserCircle size={20} />}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>My Orders</NavDropdown.Item>
            </NavDropdown>

            {/* Cart */}
            <Nav.Link
              as={Link}
              to="/cart"
              onClick={handleCartToggle}
              className="position-relative"
              aria-label="View Cart"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
