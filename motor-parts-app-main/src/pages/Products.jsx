import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Placeholder images from /public/assets/
const placeholderImages = [
  "/assets/slide1a.jpg",
  "/assets/slide2.jpg",
  "/assets/slide3.jpg",
];

function Products() {
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      image: placeholderImages[index % placeholderImages.length],
    }));
    setProducts(data);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Products</h2>
      {products.length === 0 ? (
        <p style={styles.empty}>No products uploaded yet.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <img src={p.image} alt={p.name} style={styles.image} />
              <div style={styles.info}>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                <p style={styles.desc}>{p.desc}</p>
                <p style={styles.price}>₹{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "80px",
    padding: "40px 20px",
    backgroundColor: "#fdf6e3",
    fontFamily: "'Outfit', sans-serif",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "40px",
    color: "#333",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    fontSize: "18px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    overflow: "hidden",
    width: "240px",
    height: "320px",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  info: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#222",
  },
  desc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
    flexGrow: 1,
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
};

export default Products;

