"use client";

import { Suspense, useEffect, useState } from "react";
import styles from "./page.module.css";
import AddItemModal from "./components/AddItemModal";
import StoresTabs from "./components/StoresTabs";
import ItemsList from "./components/ItemsList";
import axios from "axios";
import {
  ItemsListSkeleton,
  StoresTabsSkeleton,
} from "./components/SkeletonFallbacks";
import AddStoreModal from "./components/AddStoreModal";

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
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  const activeStore = stores.find((store) => store.id === activeStoreId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/stores/${userID}`);
        setStores(response.data);
        setLoadingData(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiURL]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const response = await axios.get(
          `${apiURL}/stores/${activeStoreId}/items`
        );
        setItems(response.data || []);
        setLoadingItems(false);
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
      setItems([...items, result.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStore = async (name: string) => {
    try {
      const result = await axios.post(`${apiURL}/store`, {
        name,
        userID,
      });
      setStores([...stores, result.data]);
      setActiveStoreId(result.data.id);
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
      {loadingData ? (
        <StoresTabsSkeleton />
      ) : (
        <StoresTabs
          stores={stores}
          activeStoreId={activeStoreId}
          itemsCount={items.length}
          onStoreChange={setActiveStoreId}
          setIsStoreModalOpen={setIsStoreModalOpen}
        />
      )}

      {loadingItems ? (
        <ItemsListSkeleton />
      ) : (
        <ItemsList
          items={items}
          activeStore={activeStore}
          onToggleItem={toggleItemPurchased}
          onDeleteItem={deleteItem}
          onAddFirstItem={() => setIsAddModalOpen(true)}
        />
      )}

      {isAddModalOpen && (
        <AddItemModal
          stores={stores}
          activeStoreId={activeStoreId}
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {isStoreModalOpen && (
        <AddStoreModal
          onClose={() => setIsStoreModalOpen(false)}
          onAddStore={handleAddStore}
        ></AddStoreModal>
      )}
    </div>
  );
}
