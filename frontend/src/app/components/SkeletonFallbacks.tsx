"use client";

import styles from "./SkeletonFallbacks.module.css";

export function StoresTabsSkeleton() {
  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabSkeleton}>
        <div className={styles.tabTextSkeleton}></div>
        <div className={styles.tabCountSkeleton}></div>
      </div>
      <div className={styles.tabSkeleton}>
        <div className={styles.tabTextSkeleton}></div>
        <div className={styles.tabCountSkeleton}></div>
      </div>
      <div className={styles.tabSkeleton}>
        <div className={styles.tabTextSkeleton}></div>
        <div className={styles.tabCountSkeleton}></div>
      </div>
    </div>
  );
}

export function ItemsListSkeleton() {
  return (
    <main className={styles.main}>
      <div className={styles.storeHeaderSkeleton}>
        <div className={styles.storeTitleSkeleton}></div>
        <div className={styles.statsSkeleton}>
          <div className={styles.statItemSkeleton}></div>
          <div className={styles.statItemSkeleton}></div>
          <div className={styles.statItemSkeleton}></div>
        </div>
      </div>

      <div className={styles.itemsContainer}>
        <div className={styles.itemsList}>
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className={styles.itemCardSkeleton}>
              <div className={styles.itemContentSkeleton}>
                <div className={styles.itemInfoSkeleton}>
                  <div className={styles.itemNameSkeleton}></div>
                  <div className={styles.itemQuantitySkeleton}></div>
                </div>
                <div className={styles.itemActionsSkeleton}>
                  <div className={styles.buttonSkeleton}></div>
                  <div className={styles.buttonSkeleton}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
