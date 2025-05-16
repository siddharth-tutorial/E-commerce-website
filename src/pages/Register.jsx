import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './register.css';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }

    toast.success(`✅ Registered successfully! Welcome ${form.name}`);
    // Simulate API call or redirect logic here
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col xs={12} md={6} lg={5}>
          <ToastContainer position="top-right" autoClose={3000} />
          {loading ? (
            <Card className="shadow p-4">
              <Skeleton height={40} width="70%" className="mb-4 mx-auto" />
              <Skeleton height={38} className="mb-3" />
              <Skeleton height={38} className="mb-3" />
              <Skeleton height={38} className="mb-3" />
              <Skeleton height={38} className="mb-3" />
              <Skeleton height={40} />
              <div className="mt-3 text-center">
                <Skeleton width={180} />
              </div>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow p-4">
                <h3 className="mb-4 text-center">Create Account</h3>
                <Form onSubmit={handleRegister}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        required
                        value={form.password}
                        onChange={handleChange}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={togglePassword}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={toggleConfirmPassword}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Register
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <small>
                    Already have an account? <a href="/login">Login</a>
                  </small>
                </div>
              </Card>
            </motion.div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
