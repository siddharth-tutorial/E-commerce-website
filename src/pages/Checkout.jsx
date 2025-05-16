import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  Toast,
  ToastContainer,
  ProgressBar,
  Spinner,
  // ButtonGroup,
  // ToggleButton,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Components/ProductContext";

const steps = ["Delivery Details", "Payment Details", "Review & Confirm"];

export default function Checkout() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    bg: "success",
  });
  const [processing, setProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Validation regex
  const cardNumberPattern = /^\d{16}$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const cvvPattern = /^\d{3,4}$/;
  const upiPattern = /^[\w.-]+@[\w]+$/;

  // Validate only fields relevant to current step
  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    if (currentStep === 1) {
      if (paymentMethod === "UPI") {
        if (!formData.upiId.trim()) newErrors.upiId = "UPI ID is required";
        else if (!upiPattern.test(formData.upiId.trim()))
          newErrors.upiId = "Invalid UPI ID format";
      }
      if (paymentMethod === "Credit Card") {
        if (
          !cardNumberPattern.test(formData.cardNumber.trim().replace(/\s/g, ""))
        ) {
          newErrors.cardNumber = "Card number must be 16 digits";
        }
        if (!expiryPattern.test(formData.expiry.trim())) {
          newErrors.expiry = "Expiry must be in MM/YY format";
        }
        if (!cvvPattern.test(formData.cvv.trim())) {
          newErrors.cvv = "CVV must be 3 or 4 digits";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setErrors({});
    } else {
      setShowToast({
        show: true,
        message: "Please fix form errors.",
        bg: "danger",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simulated Stripe payment process
  const handlePlaceOrder = () => {
    if (!validateStep()) {
      setShowToast({
        show: true,
        message: "Please fix form errors.",
        bg: "danger",
      });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      setShowToast({
        show: true,
        message: "Payment successful! Order placed.",
        bg: "success",
      });
      setTimeout(() => navigate("/thankyou"), 1500);
    }, 2500);
  };

  // Dark mode toggle handler
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Dynamic styles for dark mode
  const themeClasses = darkMode ? "bg-dark text-light" : "bg-light text-dark";

  return (
    <Container className={`py-4 min-vh-100 ${themeClasses}`} fluid>
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1055 }}
      >
        <Toast
          onClose={() =>
            setShowToast({ show: false, message: "", bg: "success" })
          }
          show={showToast.show}
          delay={3000}
          autohide
          bg={showToast.bg}
        >
          <Toast.Body className="text-white">{showToast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="mb-4 align-items-center">
        <Col xs={8}>
          <h2 className="fw-bold">Checkout</h2>
          <ProgressBar
            now={((currentStep + 1) / steps.length) * 100}
            label={steps[currentStep]}
            visuallyHidden
          />
        </Col>
        <Col xs={4} className="text-end">
          <Form.Check
            type="switch"
            id="dark-mode-switch"
            label="Dark Mode"
            checked={darkMode}
            onChange={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} md={7}>
          <Card
            className={`p-4 shadow-sm mb-4 ${
              darkMode ? "bg-secondary text-light" : ""
            }`}
          >
            {/* Step 1: Delivery Details */}
            {currentStep === 0 && (
              <Form noValidate>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                    aria-label="Full Name"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123 Main Street"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    aria-label="Address"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            )}

            {/* Step 2: Payment Details */}
            {currentStep === 1 && (
              <Form noValidate>
                <Form.Group className="mb-3" controlId="paymentMethod">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    aria-label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option>Cash on Delivery</option>
                    <option>UPI</option>
                    <option>Credit Card</option>
                  </Form.Select>
                </Form.Group>

                {paymentMethod === "UPI" && (
                  <Form.Group className="mb-3" controlId="upiId">
                    <Form.Label>Enter UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="example@upi"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      isInvalid={!!errors.upiId}
                      aria-label="UPI ID"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.upiId}
                    </Form.Control.Feedback>
                    <div className="mt-3">
                      <p>Or scan QR:</p>
                      <Image
                        src="https://api.qrserver.com/v1/create-qr-code/?data=upi://pay&size=150x150"
                        alt="QR"
                        fluid
                        style={{ maxWidth: "150px" }}
                        rounded
                      />
                    </div>
                  </Form.Group>
                )}

                {paymentMethod === "Credit Card" && (
                  <>
                    <Form.Group className="mb-3" controlId="cardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        isInvalid={!!errors.cardNumber}
                        aria-label="Card Number"
                        maxLength={19}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                      <Col xs={6}>
                        <Form.Group className="mb-3" controlId="expiry">
                          <Form.Label>Expiry (MM/YY)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            isInvalid={!!errors.expiry}
                            aria-label="Expiry Date"
                            maxLength={5}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.expiry}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3" controlId="cvv">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="123"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            isInvalid={!!errors.cvv}
                            aria-label="CVV"
                            maxLength={4}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cvv}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            )}
            {/* Step 3: Review & Confirm */}
            {currentStep === 2 && (
              <>
                <h5 className="mb-3">Delivery Details</h5>
                <p>
                  <strong>Name:</strong> {formData.fullName || "-"}
                </p>
                <p>
                  <strong>Address:</strong> {formData.address || "-"}
                </p>
                <h5 className="mb-3 mt-4">Payment Method</h5>
                <p>{paymentMethod}</p>
                {paymentMethod === "UPI" && (
                  <p>
                    <strong>UPI ID:</strong> {formData.upiId}
                  </p>
                )}
                {paymentMethod === "Credit Card" && (
                  <p>
                    <strong>Card Number:</strong>{" "}
                    {"**** **** **** " + formData.cardNumber.slice(-4)}
                  </p>
                )}
              </>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0 || processing}
                aria-label="Go Back"
              >
                Back
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  aria-label="Go Next"
                >
                  Next
                </Button>
              )}

              {currentStep === steps.length - 1 && (
                <Button
                  variant="success"
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  aria-label="Place Order"
                >
                  {processing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              )}
            </div>
          </Card>
        </Col>

        {/* Cart Summary */}
        <Col xs={12} md={5}>
          <Card
            className={`p-3 shadow-sm ${
              darkMode ? "bg-secondary text-light" : ""
            }`}
          >
            <h5 className="mb-3">Order Summary</h5>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <Row
                    key={item.id}
                    className="align-items-center mb-2"
                    aria-label={`Product: ${item.name}, quantity: ${item.quantity}`}
                  >
                    <Col xs={3}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        style={{ maxHeight: "60px", objectFit: "contain" }}
                      />
                    </Col>
                    <Col xs={6}>
                      <div>{item.name}</div>
                      <small>
                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                      </small>
                    </Col>
                    <Col xs={3} className="text-end">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Col>
                  </Row>
                ))}
                <hr />
                <h6 className="text-end">
                  Total: <strong>₹{totalAmount.toFixed(2)}</strong>
                </h6>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
