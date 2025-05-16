import React from 'react'

// import { Link } from 'react-router';
import { Button, Card } from 'react-bootstrap';
// import { useCart } from './pages/ProductContext';


export default function productCard({product}) {
    // const {addToCart} =useCart
      // const price = (Math.random() * 100 + 20).toFixed(2)
 const price = (Math.random() * 100 + 100).toFixed(0)
      return (
    <div>
         <Card className="mb-4">
      <Card.Img variant="top" src={product.thumbnailUrl} alt={product.title} />  {/* ✅ Correct image */}
      <Card.Body>
        <Card.Title>{product.title.slice(0, 30)}...</Card.Title>
        <Card.Text>₹{price}</Card.Text>
        <Button variant="primary">Add to Cart</Button>
      </Card.Body>
    </Card>
    </div>
  )
}

