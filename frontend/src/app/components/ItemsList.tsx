"use client";

import styles from "../page.module.css";

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

interface ItemsListProps {
  items: Item[];
  activeStore: Store | undefined;
  onToggleItem: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
  onAddFirstItem: () => void;
}

export default function ItemsList({
  items,
  activeStore,
  onToggleItem,
  onDeleteItem,
  onAddFirstItem,
}: ItemsListProps) {
  return (
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
            <button className={styles.addFirstItem} onClick={onAddFirstItem}>
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
                      onClick={() => onToggleItem(item.id)}
                    >
                      {item.purchased ? "↩️ Unpurchase" : "✅ Purchase"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDeleteItem(item.id)}
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
  );
}
