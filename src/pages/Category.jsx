import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { useCart } from "../Components/ProductContext"; 

import './category.css'

// Skeleton loader card for products
function SkeletonCard() {
  return (
    <Card className="h-100 skeleton-card mb-4">
      <div className="skeleton-img mb-3" />
      <div className="skeleton-text skeleton-title mb-2" />
      <div className="skeleton-text skeleton-price mb-2" />
      <div className="skeleton-text skeleton-rating mb-3" />
      <div className="skeleton-button" />
    </Card>
  );
}

// StarRating component (unchanged)
function StarRating({ rating, onClick, interactive = false }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <FaStar
          key={i}
          color="gold"
          style={{ cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onClick(i)}
          aria-label={`${i} star`}
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          color="gold"
          style={{ cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onClick(i)}
          aria-label={`${i - 0.5} star`}
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          color="gold"
          style={{ cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onClick(i)}
          aria-label={`empty star ${i}`}
        />
      );
    }
  }
  return <div>{stars}</div>;
}

function Category() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addtoCart } = useCart();

  // Filters state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const max = Math.ceil(Math.max(...prices));
      setMaxPrice(max);
      setSelectedMaxPrice(max);
      setMinPrice(0);
    }
  }, [products]);

  useEffect(() => {
    setLoading(true);
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/category/${categoryName}`
        );
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  useEffect(() => {
    let tempProducts = [...products];

    tempProducts = tempProducts.filter(
      (p) => p.price >= minPrice && p.price <= selectedMaxPrice
    );

    if (minRating > 0) {
      tempProducts = tempProducts.filter(
        (p) => p.rating?.rate >= minRating
      );
    }

    if (sortOption === "priceAsc") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceDesc") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "ratingDesc") {
      tempProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    setFilteredProducts(tempProducts);
  }, [minPrice, selectedMaxPrice, minRating, sortOption, products]);

  // Skeleton loader while loading
  if (loading)
    return (
      <Container fluid className="py-4 px-3 px-md-5">
        <h2 className="mb-4 text-capitalize">{categoryName}</h2>
        <Row>
          {/* Sidebar skeleton */}
          <Col xs={12} md={4} lg={3}>
            <div className="skeleton-sidebar p-3 rounded mb-4" />
          </Col>

          {/* Products skeleton grid */}
          <Col xs={12} md={8} lg={9}>
            <Row>
              {[...Array(8)].map((_, idx) => (
                <Col key={idx} sm={6} md={4} lg={3}>
                  <SkeletonCard />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    );

  if (error)
    return (
      <div className="text-center my-5 text-danger">
        {error}
      </div>
    );

  return (
    <Container fluid className="py-4 px-3 px-md-5">
      <h2 className="mb-4 text-capitalize">{categoryName}</h2>
      <Row>
        {/* Sidebar Filters */}
        <Col
          xs={12}
          md={4}
          lg={3}
          className="mb-4 border p-3 rounded"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h5 className="mb-3">Filter Products</h5>

          {/* Price Range */}
          <Form.Group className="mb-4">
            <Form.Label>
              Price Range: ₹{minPrice} - ₹{selectedMaxPrice}
            </Form.Label>
            <div className="d-flex gap-2 align-items-center">
              <Form.Range
                min={0}
                max={maxPrice}
                value={minPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= selectedMaxPrice) setMinPrice(val);
                }}
              />
              <Form.Range
                min={0}
                max={maxPrice}
                value={selectedMaxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= minPrice) setSelectedMaxPrice(val);
                }}
              />
            </div>
          </Form.Group>

          {/* Minimum Rating */}
          <Form.Group className="mb-4">
            <Form.Label>Minimum Rating</Form.Label>
            <StarRating
              rating={minRating}
              onClick={(val) => setMinRating(val)}
              interactive={true}
            />
            <Button
              variant="link"
              size="sm"
              onClick={() => setMinRating(0)}
              style={{ paddingLeft: 0 }}
            >
              Clear Rating Filter
            </Button>
          </Form.Group>

          {/* Sort Options */}
          <Form.Group className="mb-4">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Default</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Rating: High to Low</option>
            </Form.Select>
          </Form.Group>

          {/* Reset Filters */}
          <Button
            variant="secondary"
            onClick={() => {
              setMinPrice(0);
              setSelectedMaxPrice(maxPrice);
              setMinRating(0);
              setSortOption("");
            }}
          >
            Reset Filters
          </Button>
        </Col>

        {/* Products Grid */}
        <Col xs={12} md={8} lg={9}>
          <Row>
            {filteredProducts.length === 0 ? (
              <p>No products found matching filters.</p>
            ) : (
              filteredProducts.map((product) => (
                <Col key={product.id} sm={6} md={4} lg={3} className="mb-4">
                  <Card
                    className="h-100 product-card cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="overflow-hidden" style={{ height: "200px" }}>
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.title}
                        className="product-img"
                      />
                    </div>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title
                          className="fs-6 fw-semibold"
                          style={{ minHeight: "3em", overflow: "hidden" }}
                        >
                          {product.title}
                        </Card.Title>
                        <Card.Text className="fw-bold text-primary fs-5">
                          ₹{product.price}
                        </Card.Text>
                        <StarRating rating={product.rating?.rate || 0} />
                        <small className="text-muted">
                          ({product.rating?.count || 0} reviews)
                        </small>
                      </div>
                      <Button
                        variant="dark"
                        className="mt-3 w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          addtoCart(product);
                          alert(`Added "${product.title}" to cart`);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Category;
