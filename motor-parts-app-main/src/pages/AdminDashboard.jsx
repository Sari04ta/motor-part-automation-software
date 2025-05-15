import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const productsSnap = await getDocs(collection(db, "products"));
      const ordersSnap = await getDocs(collection(db, "orders"));

      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const productsList = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const ordersList = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const productLookup = {};
      productsList.forEach(prod => {
        productLookup[prod.id] = prod;
      });

      const userLookup = {};
      usersList.forEach(user => {
        userLookup[user.id] = user;
      });

      setUsers(usersList);
      setProducts(productsList);
      setOrders(ordersList);
      setProductMap(productLookup);
      setUserMap(userLookup);
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>All Users</h3>
        <div style={styles.cardContainer}>
          {users.map(user => (
            <div key={user.id} style={styles.card}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>All Products</h3>
        <div style={styles.cardContainer}>
          {products.map(prod => (
            <div key={prod.id} style={styles.card}>
              <p><strong>Name:</strong> {prod.name}</p>
              <p><strong>Description:</strong> {prod.desc}</p>
              <p><strong>Price:</strong> ₹{prod.price}</p>
              <p><strong>Vendor:</strong> {userMap[prod.vendorId]?.email || "Unknown"}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>All Orders</h3>
        <div style={styles.cardContainer}>
          {orders.map(order => (
            <div key={order.id} style={styles.card}>
              <p><strong>Product:</strong> {productMap[order.productId]?.name || "Unknown"}</p>
              <p><strong>Price:</strong> ₹{productMap[order.productId]?.price || "?"}</p>
              <p><strong>Customer:</strong> {userMap[order.customerId]?.email || "Unknown"}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "80px",
    padding: "20px",
    fontFamily: "'Outfit', sans-serif",
    backgroundColor: "#fefae0",
    minHeight: "100vh",
    color: "#333"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    borderBottom: "2px solid #ccc",
    paddingBottom: "5px"
  },
  section: {
    marginBottom: "40px"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd"
  }
};

export default AdminDashboard;
