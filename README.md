# Jen's Local Mart – Retail Store Management System

A clean, responsive, single-page **Retail Store Management System** for a fictional Philippine neighborhood store, built with **HTML5, CSS3, and Vanilla JavaScript**.

This project is created for a college JavaScript activity demonstrating **Object-Oriented Design Patterns** in JavaScript.

---

## 🏬 Overview

**Jen's Local Mart** serves a local Philippine community by selling daily essentials across five categories:
* 🍲 **Food & Snacks** (e.g., Pancit Canton)
* 🥤 **Beverages** (e.g., Soft Drinks, Bottled Water)
* 🧴 **Personal Care** (e.g., Shampoo Sachets)
* 🧹 **Household Products** (e.g., Laundry Detergent)
* ✏️ **School & Office Supplies** (e.g., Ballpens)

All pricing and financial figures are rendered in **Philippine Peso (₱)**.

---

## 🧩 Design Patterns Demonstrated

### 1. 🏭 Factory Pattern (`ProductFactory`)
* **Purpose:** Encapsulates the instantiation of different product categories without coupling the UI code directly to concrete product classes.
* **Usage:**
  ```javascript
  const product = ProductFactory.createProduct(
    "food",
    "P001",
    "Pancit Canton",
    15,
    50
  );
  ```
* **Supported Categories:** `food`, `beverage`, `personalCare`, `household`, `schoolSupply`.

### 2. 🏛️ Singleton Pattern (`InventoryManager`)
* **Purpose:** Guarantees that only **one central inventory instance** exists across the entire application lifecycle, serving as a single source of truth for stock counts, additions, deductions, and restocking.
* **Usage:**
  ```javascript
  const inventory = InventoryManager.getInstance();
  const inventory2 = InventoryManager.getInstance();
  console.log(inventory === inventory2); // true (same instance in memory)
  ```

### 3. 🎯 Strategy Pattern (`DiscountStrategy`)
* **Purpose:** Encapsulates interchangeable discount calculation algorithms into separate strategy classes adhering to a common interface (`calculateDiscount(amount)`).
* **Strategies Implemented:**
  * **Regular Customer:** 0% discount
  * **Student Discount:** 5% discount
  * **Bulk Purchase:** 10% discount
* **Usage:**
  ```javascript
  checkout.setDiscountStrategy(new StudentDiscountStrategy());
  const discount = checkout.calculateDiscount(subtotal);
  const total = checkout.calculateTotal();
  ```

---

## 🚀 Key Features

* **📊 Live Dashboard:** Real-time statistics displaying Total Products, Total Stock, Low Stock Alert (items with &le; 10 units), and Today's Sales.
* **📦 Product Inventory:** Searchable and filterable table with instant actions to **Sell** or **Restock**.
* **➕ Add Product:** Form using the `ProductFactory` to catalog new products with validation against duplicate IDs.
* **🛒 Sales & Checkout:** Stock-validated product selection (prevents overselling), itemized cart, real-time discount calculation via Strategy Pattern, and printable receipt generation.
* **📦 Restock System:** Interactive modal calculating current stock, added units, and projected stock before committing updates.
* **🧪 In-App Pattern Verification:** Interactive live test widget validating the Singleton memory instance directly in the UI.

---

## 📁 File Structure

```text
jenstore/
├── index.html       # Single-page application structure & semantic layout
├── style.css        # Clean, modern styling & responsive design
├── app.js           # Core business logic, design patterns & UI controller
├── README.md        # Project documentation
└── jen-local-mart/  # Standalone distribution package
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 💻 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Rhamces123/jenstore.git
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).
3. No build step, Node.js server, or external database required!
