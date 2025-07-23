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
  setIsStoreModalOpen: (isStoreModalOpen: boolean) => void;
}

export default function StoresTabs({
  stores,
  activeStoreId,
  itemsCount,
  onStoreChange,
  setIsStoreModalOpen,
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
        </button>
      ))}
      <button
        className={`${styles.tab} ${styles.addTab}`}
        onClick={() => setIsStoreModalOpen(true)}
      >
        + Add New Store
      </button>
    </div>
  );
}
