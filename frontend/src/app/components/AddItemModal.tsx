"use client";

import { useState } from "react";
import styles from "./AddItemModal.module.css";

interface Store {
  id: number;
  name: string;
  userId: number;
}

interface AddItemModalProps {
  stores: Store[];
  activeStoreId: number;
  onClose: () => void;
  onAddItem: (itemData: {
    name: string;
    quantity: number;
    storeid: number;
  }) => void;
}

export default function AddItemModal({
  stores,
  activeStoreId,
  onClose,
  onAddItem,
}: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    storeid: activeStoreId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter an item name");
      return;
    }

    if (formData.quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    onAddItem(formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Item</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="itemName" className={styles.label}>
              Item Name *
            </label>
            <input
              id="itemName"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={styles.input}
              placeholder="e.g., Milk, Bread, Apples..."
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantity" className={styles.label}>
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="store" className={styles.label}>
              Store
            </label>
            <select
              id="store"
              value={formData.storeid}
              onChange={(e) =>
                setFormData({ ...formData, storeid: parseInt(e.target.value) })
              }
              className={styles.select}
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
