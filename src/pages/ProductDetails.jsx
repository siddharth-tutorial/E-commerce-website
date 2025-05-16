import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Carousel,
  Image,
  Button,
  Alert,
  Toast,
  ToastContainer,
  Badge,
  ProgressBar,
} from "react-bootstrap";

import { useCart } from "../Components/ProductContext";

// Example reviews data, can be fetched dynamically later
const exampleReviews = [
  {
    id: 1,
    username: "Alice",
    rating: 5,
    comment: "Excellent quality and fast delivery!",
  },
  {
    id: 2,
    username: "Bob",
    rating: 4,
    comment: "Good product but the size runs a bit small.",
  },
  {
    id: 3,
    username: "Charlie",
    rating: 3,
    comment: "Average product, expected better materials.",
  },
];

// Category variant options config — extendable
const categoryVariants = {
  clothing: ["S", "M", "L", "XL", "XXL"],
  electronics: ["64GB", "128GB", "256GB"],
  shoes: ["7", "8", "9", "10", "11", "12"],
  "home-decoration": ["Red", "Blue", "Green", "Black"],
  jewelry: ["Gold", "Silver", "Rose Gold"],
  // Add more categories and variants here
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [reviews, setReviews] = useState(exampleReviews);

  const { addtoCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product.");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a variant first!");
      return;
    }
    addtoCart({ ...product, selectedVariant });
    setShowToast(true);
  };

  // Function to get variant options for current product category
  const variantOptions =
    categoryVariants[
      Object.keys(categoryVariants).find((cat) =>
        product?.category.includes(cat)
      )
    ] || [];

  // Function to get image based on variant — simplified for demo
  const getVariantImage = () => {
    if (!product) return "";
    if (variantOptions.length && selectedVariant) {
      // For demo, just return placeholder for variant
      return `https://via.placeholder.com/400x400?text=${encodeURIComponent(
        selectedVariant
      )}`;
    }
    return product.image;
  };

  // Calculate ratings summary from reviews
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews || 0;

  // Loading Skeleton JSX
  if (loading)
    return (
      <>
        <style>{`
          .skeleton {
            background-color: #e0e0e0;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
          }
          .skeleton::after {
            content: "";
            position: absolute;
            top: 0;
            left: -150px;
            height: 100%;
            width: 150px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% {
              left: -150px;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>

        <Container fluid className="py-5 px-4 px-md-5 bg-light min-vh-100">
          <Row className="gy-4">
            {/* Left side skeleton */}
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className="skeleton"
                style={{ width: "100%", height: "450px", borderRadius: "8px" }}
              ></div>
            </Col>

            {/* Right side skeleton */}
            <Col xs={12} md={6}>
              <div
                className="skeleton mb-3"
                style={{ width: "60%", height: "32px" }}
              ></div>{" "}
              {/* Title */}
              <div
                className="skeleton mb-3"
                style={{ width: "30%", height: "24px" }}
              ></div>{" "}
              {/* Category badge */}
              <div
                className="skeleton mb-3"
                style={{ width: "40%", height: "28px" }}
              ></div>{" "}
              {/* Price */}
              <div
                className="skeleton mb-3"
                style={{ width: "100%", height: "80px" }}
              ></div>{" "}
              {/* Description */}
              <div className="d-flex gap-2 mb-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="skeleton"
                    style={{
                      width: "60px",
                      height: "36px",
                      borderRadius: "20px",
                    }}
                  ></div> // Variant buttons
                ))}
              </div>
              <div className="d-flex gap-3">
                <div
                  className="skeleton"
                  style={{ flex: 1, height: "48px", borderRadius: "6px" }}
                ></div>{" "}
                {/* Add to Cart button */}
                <div
                  className="skeleton"
                  style={{ flex: 1, height: "48px", borderRadius: "6px" }}
                ></div>{" "}
                {/* Back button */}
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <>
      <Container fluid className="py-5 px-4 px-md-5 bg-light min-vh-100">
        <Row className="gy-4">
          {/* Left side: Product Carousel */}
          <Col
            xs={12}
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Carousel
              fade
              variant="dark"
              className="w-100 product-carousel"
              interval={4000}
              pause="hover"
            >
              {["Front View", "Back View", "Side View"].map((label, idx) => (
                <Carousel.Item key={idx}>
                  <Image
                    src={getVariantImage()}
                    alt={label}
                    fluid
                    style={{
                      maxHeight: "450px",
                      width: "auto",
                      margin: "0 auto",
                      objectFit: "contain",
                      transform:
                        label === "Back View"
                          ? "scaleX(-1)"
                          : label === "Side View"
                          ? "rotate(10deg)"
                          : "none",
                    }}
                    rounded
                    loading="lazy"
                  />
                  <Carousel.Caption>
                    <h6 className="bg-dark bg-opacity-50 rounded px-2 d-inline-block">
                      {label}
                    </h6>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          {/* Right side: Product info and actions */}
          <Col xs={12} md={6}>
            <h2 className="fw-bold mb-2">{product.title}</h2>
            <Badge bg="secondary" className="mb-3 text-capitalize">
              {product.category}
            </Badge>

            <h3 className="text-success mb-4">₹{product.price.toFixed(2)}</h3>

            <p
              style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
              className="mb-4"
            >
              {product.description}
            </p>

            <p className="mb-4 fs-5">
              <strong>Rating:</strong>{" "}
              <span role="img" aria-label="star">
                ⭐
              </span>{" "}
              {product.rating?.rate.toFixed(1)} ({product.rating?.count}{" "}
              reviews)
            </p>

            {/* Variant selector */}
            {variantOptions.length > 0 && (
              <div className="mb-4">
                <strong className="mb-2 d-block">Select Option:</strong>
                {variantOptions.map((opt) => (
                  <Button
                    key={opt}
                    variant={selectedVariant === opt ? "dark" : "outline-dark"}
                    size="md"
                    className="me-2 mb-2 rounded-pill px-3"
                    onClick={() => setSelectedVariant(opt)}
                    aria-pressed={selectedVariant === opt}
                    aria-label={`Select ${opt}`}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            <div className="d-flex flex-wrap gap-3">
              <Button
                variant="success"
                size="lg"
                disabled={!selectedVariant}
                onClick={handleAddToCart}
                className="flex-grow-1"
              >
                Add to Cart
              </Button>

              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate(-1)}
                className="flex-grow-1"
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col xs={12} md={6}>
            <h4>Customer Reviews</h4>
            <div className="mb-3">
              <h5 className="mb-2">
                Average Rating: {averageRating.toFixed(1)} / 5{" "}
                <span role="img" aria-label="star">
                  ⭐
                </span>
              </h5>

              {/* Rating breakdown bars */}
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star - 1];
                const percent = totalReviews ? (count / totalReviews) * 100 : 0;
                return (
                  <div
                    key={star}
                    className="d-flex align-items-center mb-1"
                    aria-label={`${star} star ratings: ${count}`}
                  >
                    <span style={{ width: 30 }}>{star} ⭐</span>
                    <ProgressBar
                      now={percent}
                      label={`${count}`}
                      style={{ flexGrow: 1, marginLeft: 8 }}
                      variant="warning"
                    />
                  </div>
                );
              })}
            </div>
          </Col>

          <Col xs={12} md={6}>
            <h5>User Comments</h5>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map(({ id, username, rating, comment }) => (
                <div
                  key={id}
                  className="mb-3 p-3 border rounded bg-white shadow-sm"
                >
                  <strong>{username}</strong>{" "}
                  <span
                    aria-label={`${rating} stars`}
                    role="img"
                    className="text-warning"
                  >
                    {"⭐".repeat(rating)}
                  </span>
                  <p className="mt-2 mb-0">{comment}</p>
                </div>
              ))
            )}
          </Col>
        </Row>
      </Container>

      {/* Toast notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2500}
          autohide
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <Toast.Body className="text-white">
            Added <strong>{product?.title}</strong> to cart!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ProductDetails;
