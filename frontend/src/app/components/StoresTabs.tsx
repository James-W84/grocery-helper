"use client";

import styles from "../page.module.css";

interface Store {
  id: number;
  name: string;
  userId: number;
}

interface StoresTabsProps {
  stores: Store[];
  activeStoreId: number;
  itemsCount: number;
  onStoreChange: (storeId: number) => void;
}

export default function StoresTabs({
  stores,
  activeStoreId,
  itemsCount,
  onStoreChange,
}: StoresTabsProps) {
  return (
    <div className={styles.tabContainer}>
      {stores.map((store) => (
        <button
          key={store.id}
          className={`${styles.tab} ${
            activeStoreId === store.id ? styles.activeTab : ""
          }`}
          onClick={() => {
            onStoreChange(store.id);
          }}
        >
          {store.name}
          <span className={styles.itemCount}>({itemsCount || 0})</span>
        </button>
      ))}
      <button
        className={`${styles.tab} ${styles.addTab}`}
        onClick={() => console.log("add")}
      >
        + Add New Store
      </button>
    </div>
  );
}
