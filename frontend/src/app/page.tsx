"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import AddItemModal from "./components/AddItemModal";
import axios from "axios";

// Mock data based on backend models
interface Item {
  id: number;
  name: string;
  quantity: number;
  purchased: boolean;
  created: Date;
}

interface Store {
  id: number;
  name: string;
  userId: number;
}

export default function Home() {
  const apiURL = process.env.PUBLIC_API_URL || "http://localhost:8080";
  const userID = process.env.USER_ID || 1;
  const [activeStoreId, setActiveStoreId] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const activeStore = stores.find((store) => store.id === activeStoreId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/stores/${userID}`);
        setStores(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiURL]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/stores/${activeStoreId}/items`
        );
        setItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, [activeStoreId, apiURL]);

  const handleAddItem = async (itemData: {
    name: string;
    quantity: number;
    storeid: number;
  }) => {
    try {
      const result = await axios.post(`${apiURL}/item`, itemData);
      items.push(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleItemPurchased = async (itemId: number) => {
    let item = items.find((item) => item.id === itemId);

    if (item === undefined) {
      console.error("Item not found in client");
      return;
    }

    try {
      if (item.purchased) {
        await axios.get(`${apiURL}/unpurchase/${itemId}`);
      } else {
        await axios.get(`${apiURL}/purchase/${itemId}`);
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      await axios.delete(`${apiURL}/item/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🛒 Grocery Helper</h1>
        <button
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add New Item
        </button>
      </header>

      <div className={styles.tabContainer}>
        {stores.map((store) => (
          <button
            key={store.id}
            className={`${styles.tab} ${
              activeStoreId === store.id ? styles.activeTab : ""
            }`}
            onClick={() => setActiveStoreId(store.id)}
          >
            {store.name}
            <span className={styles.itemCount}>({items.length || 0})</span>
          </button>
        ))}
      </div>

      <main className={styles.main}>
        <div className={styles.storeHeader}>
          <h2>{activeStore?.name} Shopping List</h2>
          <div className={styles.stats}>
            <span className={styles.statItem}>Total: {items.length}</span>
            <span className={styles.statItem}>
              Purchased: {items.filter((item) => item.purchased).length}
            </span>
            <span className={styles.statItem}>
              Remaining: {items.filter((item) => !item.purchased).length}
            </span>
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No items in this store yet.</p>
              <button
                className={styles.addFirstItem}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add your first item
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.itemCard} ${
                    item.purchased ? styles.purchased : ""
                  }`}
                >
                  <div className={styles.itemContent}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemQuantity}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className={styles.itemActions}>
                      <button
                        className={`${styles.toggleButton} ${
                          item.purchased
                            ? styles.unpurchaseButton
                            : styles.purchaseButton
                        }`}
                        onClick={() => toggleItemPurchased(item.id)}
                      >
                        {item.purchased ? "↩️ Unpurchase" : "✅ Purchase"}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteItem(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddItemModal
          stores={stores}
          activeStoreId={activeStoreId}
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}
