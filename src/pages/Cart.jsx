import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useCart } from "../Components/ProductContext";
import { Link, useNavigate,  } from "react-router-dom";

function Cart() {
  const { cart,  removetoCart, decrement, increment } = useCart();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });
  const [showToast, setShowToast] = useState({ show: false, message: "" });

  const totalPrice = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);

  useEffect(() => {
    localStorage.setItem("productReviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleIncrement = (productId) => {
    increment(productId);
  };

  const handleDecrement = (productId) => {
    decrement(productId);
  };

  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleReviewChange = (productId, reviewText) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], reviewText },
    }));
  };

  const handleRemove = (productId) => {
    removetoCart(productId);
    setShowToast({ show: true, message: "Item removed from cart!" });
  };

    const navigate = useNavigate();
  const handleCheckout = () => {
    setShowToast({ show: true, message: "Proceeding to checkout..." });
    setTimeout(()=>{
      navigate("/checkout",{state : {cart}})
    },1000)
  };

  return (
    <div>
      <Container>
        {/* Toast Notification */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast({ show: false, message: "" })}
            show={showToast.show}
            delay={2000}
            autohide
            bg="info"
          >
            <Toast.Body>{showToast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Total Section */}
        <Row className="my-4">
          <Col className="d-flex justify-content-between">
            <h4>Total Items: {totalItems}</h4>
            {/* <h4>Total Price: ${totalPrice.toFixed(2)}</h4> */}
          </Col>
        </Row>

        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <>
            <Row>
              {cart.map((product) => (
                <Col sm={12} key={product.id} className="mb-4">
                  <Card className="p-3">
                    <Row className="align-items-center">
                      {/* Image */}
                      <Col md={3}>
                        <Card.Img
                          src={product.image}
                          alt={product.title}
                          style={{ height: "200px", objectFit: "contain" }}
                        />
                      </Col>

                      {/* Details */}
                      <Col md={9}>
                        <Card.Body>
                          {/* Quantity Control */}
                          <div className="d-flex align-items-center mb-3">
                            <Button
                              variant="secondary"
                              onClick={() => handleDecrement(product.id)}
                            >
                              -
                            </Button>
                            <span className="mx-3">{product.quantity}</span>
                            <Button
                              variant="secondary"
                              onClick={() => handleIncrement(product.id)}
                            >
                              +
                            </Button>
                          </div>

                          {/* Description */}
                          <Card.Text className="mb-3">
                            {product.description.substring(0, 100)}...
                            
                          </Card.Text>

                          {/* Rating */}
                          <div className="mb-3">
                            <h6>Rating</h6>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant={
                                  reviews[product.id]?.rating >= star
                                    ? "warning"
                                    : "secondary"
                                }
                                onClick={() =>
                                  handleRatingChange(product.id, star)
                                }
                                style={{ marginRight: "5px" }}
                              >
                                ★
                              </Button>
                            ))}
                          </div>

                          <Button
                            variant="danger"
                            onClick={() => handleRemove(product.id)}
                          >
                            Remove
                          </Button>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Checkout Section */}
            <Row className="mt-4">
              <Col className="d-flex justify-content-between">
                <Link to="/">
                  <Button variant="outline-primary">Continue Shopping</Button>
                </Link>
                <div className="d-flex flex-column align-items-start">
                 
                  <h4>SubTotal Price: ₹{totalPrice.toFixed(2)}</h4>   
                 
                  <Button variant="success" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default Cart;

