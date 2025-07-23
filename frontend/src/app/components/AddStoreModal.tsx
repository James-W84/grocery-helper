"use client";

import { useState } from "react";
import styles from "./AddStoreModal.module.css";

interface AddStoreModalProps {
  onClose: () => void;
  onAddStore: (name: string) => void;
}

export default function AddStoreModal({
  onClose,
  onAddStore,
}: AddStoreModalProps) {
  const [storeName, setStoreName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      alert("Please enter a store name");
      return;
    }

    onAddStore(storeName.trim());
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
          <h2>Add New Store</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="storeName" className={styles.label}>
              Store Name
            </label>
            <input
              id="storeName"
              type="text"
              className={styles.input}
              placeholder="Enter store name (e.g., Walmart, Target)"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
