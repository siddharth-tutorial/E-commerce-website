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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import './login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('❌ Please enter both email and password');
      return;
    }
    toast.success(`✅ Logged in successfully as ${email}`);
    // Simulate login logic or redirect here
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col xs={12} md={6} lg={4}>
          {loading ? (
            <Card className="shadow p-4">
              <Skeleton height={40} width="70%" className="mb-4 mx-auto" />
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
                <h3 className="mb-4 text-center">Login to Your Account</h3>
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <Button type="submit" variant="primary" className="w-100">
                    Login
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <small>
                    Don’t have an account? <a href="/register">Register</a>
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
