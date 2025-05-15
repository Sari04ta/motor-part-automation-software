// src/pages/ProductList.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleOrder = async (product) => {
    if (!user) return alert("You must be logged in to order.");

    try {
      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productName: product.name,
        customerId: user.uid,
        createdAt: new Date()
      });
      alert("Order placed!");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Error placing order.");
    }
  };

  return (
    <div style={{ padding: "80px 20px" }}>
      <h2>Available Products</h2>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map(product => (
            <li key={product.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>₹{product.price}</p>
              {user && <button onClick={() => handleOrder(product)}>Order</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
