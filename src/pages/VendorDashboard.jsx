import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import "../styles/Dashboard.css";

function VendorDashboard() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "products"), {
        name,
        desc,
        price,
        vendorId: user.uid,
      });
      setName("");
      setDesc("");
      setPrice("");
      fetchProducts();
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  const fetchProducts = async () => {
    const user = auth.currentUser;
    const q = query(collection(db, "products"), where("vendorId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const fetchOrders = async () => {
    const user = auth.currentUser;
    const productQuery = query(collection(db, "products"), where("vendorId", "==", user.uid));
    const productSnapshot = await getDocs(productQuery);
    const vendorProductIds = productSnapshot.docs.map((doc) => doc.id);
    const productMap = {};
    productSnapshot.docs.forEach((doc) => {
      productMap[doc.id] = doc.data().name;
    });

    const ordersQuery = query(collection(db, "orders"));
    const orderSnapshot = await getDocs(ordersQuery);
    const relevantOrders = orderSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => vendorProductIds.includes(order.productId));

    setOrders(
      relevantOrders.map((order) => ({
        ...order,
        productName: productMap[order.productId] || "Unknown",
      }))
    );
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Vendor Dashboard</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Upload Product</button>
      </form>

      <h3 className="section-heading">Your Products</h3>
      {products.length === 0 ? (
        <p className="no-data">No products uploaded yet.</p>
      ) : (
        <div className="card-grid">
          {products.map((p) => (
            <div key={p.id} className="dashboard-card">
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              <p><strong>Price:</strong> ₹{p.price}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-heading">Orders for Your Products</h3>
      {orders.length === 0 ? (
        <p className="no-data">No orders yet.</p>
      ) : (
        <div className="card-grid">
          {orders.map((order) => (
            <div key={order.id} className="dashboard-card">
              <p><strong>Product:</strong> {order.productName}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Order Time:</strong> {order.createdAt?.toDate?.().toLocaleString?.() || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;

