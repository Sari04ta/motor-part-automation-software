import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import "../styles/Dashboard.css";

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch current user and their orders
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders for current user
  const fetchOrders = async (uid) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("customerId", "==", uid)
      );
      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map(doc => doc.data());
      setOrders(orderList);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Place order
  const handleOrder = async (product) => {
    try {
      await addDoc(collection(db, "orders"), {
        customerId: user.uid,
        productId: product.id,
        productName: product.name,
        createdAt: serverTimestamp(),
        price: product.price,
        status: "Pending"
      });
      alert("Order placed!");
      fetchOrders(user.uid);
    } catch (err) {
      alert("Failed to place order: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Customer Dashboard</h2>

      <h3 className="section-heading">Available Products</h3>
      {loadingProducts ? (
        <p className="no-data">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-data">No products available.</p>
      ) : (
        <div className="card-grid">
          {products.map((product) => (
            <div key={product.id} className="dashboard-card">
              <h4>{product.name}</h4>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <button onClick={() => handleOrder(product)}>Order</button>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-heading">Your Orders</h3>
      {loadingOrders ? (
        <p className="no-data">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-data">No orders placed yet.</p>
      ) : (
        <div className="card-grid">
          {orders.map((order, index) => (
            <div key={index} className="dashboard-card">
              <p><strong>Product:</strong> {order.productName}</p>
              <p><strong>Order Time:</strong> {order.createdAt?.toDate?.().toLocaleString?.() || "N/A"}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
