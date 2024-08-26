import React, { useState } from "react";
import styles from "./UpdateProductModal.module.css";

const UpdateProductModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [name, setName] = useState(product && product.productName);
  const [price, setPrice] = useState(product && product.price);
  const [desc, setDesc] = useState(product && product.description);
  console.log(product && product.productName);

  const handleUpdate = () => {
    onUpdate({
      ...product,
      productName: name,
      price: price,
      description: desc,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Update Product</h2>
        <label>
          Product Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Product Price:
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Product Description:
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </label>
        <div className={styles.modalActions}>
          <button onClick={handleUpdate} className={styles.button}>
            Update
          </button>
          <button onClick={onClose} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
