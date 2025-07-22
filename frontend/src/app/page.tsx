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

const mockStores: Store[] = [
  { id: 1, name: "Walmart", userId: 1 },
  { id: 2, name: "Target", userId: 1 },
  { id: 3, name: "Whole Foods", userId: 1 },
  { id: 4, name: "Costco", userId: 1 },
];

const mockItems: Record<number, Item[]> = {
  1: [
    { id: 1, name: "Milk", quantity: 1, purchased: false, created: new Date() },
    { id: 2, name: "Bread", quantity: 2, purchased: true, created: new Date() },
    {
      id: 3,
      name: "Eggs",
      quantity: 12,
      purchased: false,
      created: new Date(),
    },
    {
      id: 4,
      name: "Chicken Breast",
      quantity: 1,
      purchased: false,
      created: new Date(),
    },
  ],
  2: [
    {
      id: 5,
      name: "Shampoo",
      quantity: 1,
      purchased: false,
      created: new Date(),
    },
    {
      id: 6,
      name: "Toothpaste",
      quantity: 1,
      purchased: true,
      created: new Date(),
    },
    {
      id: 7,
      name: "Paper Towels",
      quantity: 3,
      purchased: false,
      created: new Date(),
    },
  ],
  3: [
    {
      id: 8,
      name: "Organic Apples",
      quantity: 5,
      purchased: false,
      created: new Date(),
    },
    {
      id: 9,
      name: "Quinoa",
      quantity: 1,
      purchased: false,
      created: new Date(),
    },
    {
      id: 10,
      name: "Almond Milk",
      quantity: 1,
      purchased: true,
      created: new Date(),
    },
  ],
  4: [
    {
      id: 11,
      name: "Bulk Rice",
      quantity: 1,
      purchased: false,
      created: new Date(),
    },
    {
      id: 12,
      name: "Frozen Berries",
      quantity: 2,
      purchased: false,
      created: new Date(),
    },
  ],
};

export default function Home() {
  const apiURL = process.env.PUBLIC_API_URL || "http://localhost:8080";
  const userID = process.env.USER_ID || 1;
  const [activeStoreId, setActiveStoreId] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const activeStore = stores.find((store) => store.id === activeStoreId);
  const activeItems = items[activeStoreId] || [];

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
  }, [activeStoreId, apiURL]);

  const handleAddItem = (itemData: {
    name: string;
    quantity: number;
    storeId: number;
  }) => {
    const newItem: Item = {
      id: Date.now(), // Simple ID generation for mock
      name: itemData.name,
      quantity: itemData.quantity,
      purchased: false,
      created: new Date(),
    };

    setItems((prev) => ({
      ...prev,
      [itemData.storeId]: [...(prev[itemData.storeId] || []), newItem],
    }));
  };

  const toggleItemPurchased = (itemId: number) => {
    setItems((prev) => ({
      ...prev,
      [activeStoreId]: prev[activeStoreId].map((item) =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      ),
    }));
  };

  const deleteItem = (itemId: number) => {
    setItems((prev) => ({
      ...prev,
      [activeStoreId]: prev[activeStoreId].filter((item) => item.id !== itemId),
    }));
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
          stores={mockStores}
          activeStoreId={activeStoreId}
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}
