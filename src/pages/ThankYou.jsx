import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState, useEffect } from 'react';

export default function ThankYou() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., order confirmation processing)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      {loading ? (
        <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '500px' }}>
          <Skeleton height={40} />
          <Skeleton count={2} />
          <div className="mt-4">
            <Skeleton height={38} width={160} />
          </div>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-100"
        >
          <Card className="p-4 shadow-lg text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h1 className="text-success mb-3">🎉 Thank You!</h1>
            <p className="mb-4">Your order has been placed successfully. We’ll deliver it soon.</p>
            <Link to="/">
              <Button variant="primary" className="px-4">Continue Shopping</Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </Container>
  );
}
