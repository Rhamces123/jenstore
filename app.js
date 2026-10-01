/*
    Jen's Local Mart
    Retail Store Management System

    Design Patterns Used:
    1. Factory Pattern
    2. Singleton Pattern
    3. Strategy Pattern
*/

// ==============================
// 1. VARIABLES AND DATA
// ==============================

// Total revenue generated today (Philippine Peso)
let todaySales = 0;

// Log of completed sales transactions
let salesHistory = [];

// Currency formatter for Philippine Peso (₱)
function formatPHP(amount) {
  const num = Number(amount) || 0;
  return '₱' + num.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Initial sample products catalog
const initialSampleProducts = [
  { category: 'food', id: 'P001', name: 'Pancit Canton', price: 15, stock: 50 },
  { category: 'beverage', id: 'P002', name: 'Soft Drink', price: 25, stock: 30 },
  { category: 'beverage', id: 'P003', name: 'Bottled Water', price: 20, stock: 40 },
  { category: 'personalCare', id: 'P004', name: 'Shampoo Sachet', price: 10, stock: 35 },
  { category: 'household', id: 'P005', name: 'Laundry Detergent', price: 12, stock: 25 },
  { category: 'schoolSupply', id: 'P006', name: 'Ballpen', price: 10, stock: 20 }
];


// ==============================
// 2. PRODUCT FACTORY
// ==============================

/*
    HOW THE FACTORY PATTERN WORKS:
    --------------------------------------------------
    The Factory Pattern is a creational design pattern that provides a centralized
    interface for creating objects without specifying their exact concrete classes
    directly in client code.

    Instead of writing "new FoodProduct(...)" or "new BeverageProduct(...)" across
    different forms and files, client code simply calls:
        ProductFactory.createProduct(category, id, name, price, stock)

    The Factory inspects the "category" argument and instantiates the appropriate
    subclass, attaching category-specific attributes (such as human-friendly labels
    and icons). If new product categories are introduced in the future, only the
    Factory needs to be updated, keeping the rest of the application unchanged.
*/

// Base Product Class
class Product {
  constructor(id, name, price, stock, category, categoryLabel, icon) {
    this.id = String(id).trim().toUpperCase();
    this.name = String(name).trim();
    this.price = Number(price);
    this.stock = Number(stock);
    this.category = category;
    this.categoryLabel = categoryLabel;
    this.icon = icon || '🏷️';
  }
}

// Specific Subclasses for Each Product Category
class FoodProduct extends Product {
  constructor(id, name, price, stock) {
    super(id, name, price, stock, 'food', 'Food & Snacks', '🍲');
  }
}

class BeverageProduct extends Product {
  constructor(id, name, price, stock) {
    super(id, name, price, stock, 'beverage', 'Beverages', '🥤');
  }
}

class PersonalCareProduct extends Product {
  constructor(id, name, price, stock) {
    super(id, name, price, stock, 'personalCare', 'Personal Care', '🧴');
  }
}

class HouseholdProduct extends Product {
  constructor(id, name, price, stock) {
    super(id, name, price, stock, 'household', 'Household', '🧹');
  }
}

class SchoolSupplyProduct extends Product {
  constructor(id, name, price, stock) {
    super(id, name, price, stock, 'schoolSupply', 'School & Office Supplies', '✏️');
  }
}

// Concrete ProductFactory
class ProductFactory {
  /**
   * Factory method to create specialized product instances
   * @param {string} category - The product category key
   * @param {string} id - Product ID (e.g. P001)
   * @param {string} name - Product Name
   * @param {number} price - Unit Price in PHP
   * @param {number} stock - Initial Stock count
   * @returns {Product}
   */
  static createProduct(category, id, name, price, stock) {
    const cleanCategory = String(category).trim();

    switch (cleanCategory) {
      case 'food':
        return new FoodProduct(id, name, price, stock);
      case 'beverage':
        return new BeverageProduct(id, name, price, stock);
      case 'personalCare':
        return new PersonalCareProduct(id, name, price, stock);
      case 'household':
        return new HouseholdProduct(id, name, price, stock);
      case 'schoolSupply':
        return new SchoolSupplyProduct(id, name, price, stock);
      default:
        return new Product(id, name, price, stock, 'general', 'General Merchandise', '📦');
    }
  }
}


// ==============================
// 3. INVENTORY SINGLETON
// ==============================

/*
    WHY SINGLETON IS USEFUL FOR THE INVENTORY:
    --------------------------------------------------
    The Singleton Pattern guarantees that a class has only ONE instance in memory
    and provides a global access point to that single instance.

    In a retail store, there is only ONE physical inventory. If different screens
    (Dashboard, Inventory Table, Checkout, and Add Product form) created their own
    separate inventory objects, stock levels would become desynchronized. For example,
    selling an item in Checkout would not update the stock in the Inventory table.
    The Singleton Pattern guarantees a single source of truth for stock counts,
    preventing inconsistent states and inventory errors.
*/

class InventoryManager {
  constructor() {
    // Enforce singleton instance: if one already exists, return it
    if (InventoryManager.instance) {
      return InventoryManager.instance;
    }

    // Central array holding all store products
    this.products = [];

    // Cache this instance statically
    InventoryManager.instance = this;
  }

  /**
   * Static method to access the single global InventoryManager instance
   * @returns {InventoryManager}
   */
  static getInstance() {
    if (!InventoryManager.instance) {
      InventoryManager.instance = new InventoryManager();
    }
    return InventoryManager.instance;
  }

  /**
   * Add a new product to inventory
   * @param {Product} product
   */
  addProduct(product) {
    if (!product || !product.id) {
      throw new Error('Invalid product object');
    }
    // Check for duplicate ID
    const exists = this.findProductById(product.id);
    if (exists) {
      throw new Error(`Product with ID "${product.id}" already exists.`);
    }
    this.products.push(product);
  }

  /**
   * Find product by its unique ID
   * @param {string} id
   * @returns {Product|undefined}
   */
  findProductById(id) {
    const cleanId = String(id).trim().toUpperCase();
    return this.products.find(p => p.id === cleanId);
  }

  /**
   * Retrieve all products
   * @returns {Array<Product>}
   */
  getAllProducts() {
    return this.products;
  }

  /**
   * Update product stock directly
   * @param {string} id
   * @param {number} newStock
   */
  updateStock(id, newStock) {
    const product = this.findProductById(id);
    if (!product) {
      throw new Error(`Product ${id} not found.`);
    }
    product.stock = Math.max(0, parseInt(newStock, 10) || 0);
    return product.stock;
  }

  /**
   * Restock product by adding quantity to current stock
   * @param {string} id
   * @param {number} quantity
   * @returns {number} updated stock
   */
  restockProduct(id, quantity) {
    const product = this.findProductById(id);
    if (!product) {
      throw new Error(`Product ${id} not found.`);
    }
    const qtyToAdd = parseInt(quantity, 10);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
      throw new Error('Restock quantity must be a positive number.');
    }
    product.stock += qtyToAdd;
    return product.stock;
  }

  /**
   * Check if sufficient stock exists for an item
   * @param {string} id
   * @param {number} quantity
   * @returns {boolean}
   */
  hasSufficientStock(id, quantity) {
    const product = this.findProductById(id);
    if (!product) return false;
    return product.stock >= quantity;
  }

  /**
   * Reduce stock when a product is sold
   * @param {string} id
   * @param {number} quantity
   * @returns {boolean}
   */
  sellProduct(id, quantity) {
    const product = this.findProductById(id);
    const qtyToSell = parseInt(quantity, 10);
    if (!product) {
      throw new Error(`Product ${id} not found.`);
    }
    if (qtyToSell <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    if (product.stock < qtyToSell) {
      return false; // Insufficient stock
    }
    product.stock -= qtyToSell;
    return true;
  }

  /**
   * Total number of distinct product items
   */
  getTotalProducts() {
    return this.products.length;
  }

  /**
   * Total quantity of all units in stock
   */
  getTotalStock() {
    return this.products.reduce((sum, p) => sum + p.stock, 0);
  }

  /**
   * Products with low stock (10 or fewer units)
   */
  getLowStockProducts() {
    return this.products.filter(p => p.stock <= 10);
  }
}


// ==============================
// 4. DISCOUNT STRATEGIES
// ==============================

/*
    HOW THE STRATEGY PATTERN WORKS:
    --------------------------------------------------
    The Strategy Pattern is a behavioral design pattern that defines a family of
    interchangeable algorithms, encapsulates each one into a separate class, and
    makes them interchangeable at runtime.

    In Jen's Local Mart, discount rules (Regular, Student 5%, Bulk 10%) are
    implemented as strategy classes that share a common method:
        calculateDiscount(amount)

    The Checkout system holds a reference to a discount strategy object. When the
    cashier selects a different customer type or discount mode, the checkout simply
    swaps the strategy object using:
        checkout.setDiscountStrategy(new StudentDiscountStrategy());

    The checkout calculation logic doesn't need complex if/else chains and never
    needs to be modified when new discount types (e.g., Senior Citizen, Holiday Promo)
    are added in the future!
*/

// Base Strategy Class (Interface contract)
class DiscountStrategy {
  calculateDiscount(amount) {
    return 0;
  }
  getName() {
    return 'Base Strategy';
  }
}

// 1. Regular Customer Strategy: No discount (0%)
class RegularDiscountStrategy extends DiscountStrategy {
  calculateDiscount(amount) {
    return 0;
  }
  getName() {
    return 'Regular Customer (0%)';
  }
}

// 2. Student Discount Strategy: 5% discount
class StudentDiscountStrategy extends DiscountStrategy {
  calculateDiscount(amount) {
    const subtotal = Number(amount) || 0;
    return subtotal * 0.05;
  }
  getName() {
    return 'Student Discount (5%)';
  }
}

// 3. Bulk Purchase Strategy: 10% discount
class BulkDiscountStrategy extends DiscountStrategy {
  calculateDiscount(amount) {
    const subtotal = Number(amount) || 0;
    return subtotal * 0.10;
  }
  getName() {
    return 'Bulk Purchase Discount (10%)';
  }
}


// ==============================
// 5. CHECKOUT
// ==============================

/*
    The Checkout class acts as the Context for the Strategy Pattern and coordinates
    with the Singleton InventoryManager for inventory deduction and cart processing.
*/
class Checkout {
  constructor() {
    // Cart holds items currently staged for checkout
    // Each item: { id, name, price, quantity, categoryLabel }
    this.cart = [];

    // Current discount strategy defaults to Regular Customer
    this.discountStrategy = new RegularDiscountStrategy();
  }

  /**
   * Swap the current discount calculation strategy at runtime
   * @param {DiscountStrategy} strategy
   */
  setDiscountStrategy(strategy) {
    if (strategy && typeof strategy.calculateDiscount === 'function') {
      this.discountStrategy = strategy;
    }
  }

  /**
   * Get currently active discount strategy
   */
  getDiscountStrategy() {
    return this.discountStrategy;
  }

  /**
   * Add an item to the cart and reserve stock from the Inventory Singleton
   * @param {string} productId
   * @param {number} quantity
   * @returns {{ success: boolean, message: string }}
   */
  addItem(productId, quantity) {
    const inventory = InventoryManager.getInstance();
    const product = inventory.findProductById(productId);

    if (!product) {
      return { success: false, message: 'Selected product does not exist.' };
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return { success: false, message: 'Please enter a valid quantity of 1 or more.' };
    }

    // Step 3: Check if enough stock exists in inventory
    if (!inventory.hasSufficientStock(productId, qty)) {
      return {
        success: false,
        message: `Insufficient stock! Only ${product.stock} units of ${product.name} are available.`
      };
    }

    // Step 4: Reduce stock in inventory immediately
    inventory.sellProduct(productId, qty);

    // Step 5: Add item into the cart
    const existingCartItem = this.cart.find(item => item.id === product.id);
    if (existingCartItem) {
      existingCartItem.quantity += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        categoryLabel: product.categoryLabel,
        icon: product.icon
      });
    }

    return {
      success: true,
      message: `Added ${qty}x ${product.name} to cart.`
    };
  }

  /**
   * Remove an item from the cart and return its reserved stock to Inventory
   * @param {string} productId
   */
  removeItem(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const removedItem = this.cart[itemIndex];
      // Return reserved stock back to the inventory
      const inventory = InventoryManager.getInstance();
      inventory.restockProduct(removedItem.id, removedItem.quantity);

      // Remove from cart
      this.cart.splice(itemIndex, 1);
      return removedItem;
    }
    return null;
  }

  /**
   * Clear all items in cart and return reserved stock back to Inventory
   */
  clearCart() {
    const inventory = InventoryManager.getInstance();
    this.cart.forEach(item => {
      inventory.restockProduct(item.id, item.quantity);
    });
    this.cart = [];
  }

  /**
   * Calculate subtotal of items in cart
   * @returns {number}
   */
  calculateSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Calculate discount using the active Strategy Pattern algorithm
   * @param {number} subtotal
   * @returns {number}
   */
  calculateDiscount(subtotal) {
    return this.discountStrategy.calculateDiscount(subtotal);
  }

  /**
   * Calculate final total after applying discount strategy
   * @returns {number}
   */
  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    return Math.max(0, subtotal - discount);
  }

  /**
   * Finalize the checkout sale
   * @returns {{ success: boolean, receipt: object, message: string }}
   */
  completeSale() {
    if (this.cart.length === 0) {
      return { success: false, message: 'The cart is empty. Please add products first.' };
    }

    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const finalTotal = this.calculateTotal();

    // Generate receipt data
    const receiptNumber = 'REC-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const receipt = {
      receiptNumber: receiptNumber,
      dateTime: formattedDate,
      items: [...this.cart],
      subtotal: subtotal,
      discountStrategyName: this.discountStrategy.getName(),
      discountAmount: discount,
      finalTotal: finalTotal
    };

    // Step 10: Update today's sales
    todaySales += finalTotal;
    salesHistory.unshift(receipt);

    // Empty cart without returning stock (stock was already deducted)
    this.cart = [];

    return {
      success: true,
      receipt: receipt,
      message: `Sale completed successfully! Total: ${formatPHP(finalTotal)}`
    };
  }
}

// Global Checkout instance
const checkout = new Checkout();


// ==============================
// 6. UI FUNCTIONS
// ==============================

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span>${iconMap[type] || 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Switch Active Section in SPA Navigation
 */
function navigateToSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  const navButtons = document.querySelectorAll('.nav-btn');

  sections.forEach(sec => {
    sec.classList.remove('active');
    if (sec.id === `section-${sectionId}`) {
      sec.classList.add('active');
    }
  });

  navButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-section') === sectionId) {
      btn.classList.add('active');
    }
  });

  // Always refresh relevant section contents when navigating
  if (sectionId === 'dashboard') {
    renderDashboard();
  } else if (sectionId === 'inventory') {
    renderInventoryTable();
  } else if (sectionId === 'sales') {
    populateSalesProductDropdown();
    renderCart();
  }
}

/**
 * Render Dashboard Cards & Recent Sales
 */
function renderDashboard() {
  const inventory = InventoryManager.getInstance();

  const totalProducts = inventory.getTotalProducts();
  const totalStock = inventory.getTotalStock();
  const lowStockCount = inventory.getLowStockProducts().length;

  document.getElementById('dash-total-products').textContent = totalProducts;
  document.getElementById('dash-total-stock').textContent = totalStock;
  document.getElementById('dash-low-stock').textContent = lowStockCount;
  document.getElementById('dash-today-sales').textContent = formatPHP(todaySales);

  // Render recent sales in Dashboard
  const tableBody = document.getElementById('dash-transactions-body');
  const countBadge = document.getElementById('transactions-count');

  countBadge.textContent = `${salesHistory.length} Sale${salesHistory.length === 1 ? '' : 's'}`;

  if (salesHistory.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">No sales recorded yet. Process a sale in the Sales tab!</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = salesHistory.slice(0, 5).map(sale => {
    const itemsSummary = sale.items.map(i => `${i.name} (×${i.quantity})`).join(', ');
    return `
      <tr>
        <td><strong>${sale.receiptNumber}</strong></td>
        <td><small>${itemsSummary}</small></td>
        <td><span class="badge badge-info">${sale.discountStrategyName}</span></td>
        <td><strong>${formatPHP(sale.finalTotal)}</strong></td>
        <td><small class="text-muted">${sale.dateTime.split(' ')[1] || sale.dateTime}</small></td>
      </tr>
    `;
  }).join('');
}

/**
 * Render Inventory Table with Filters & Action Buttons
 */
function renderInventoryTable() {
  const inventory = InventoryManager.getInstance();
  const tableBody = document.getElementById('inventory-table-body');
  const summaryFooter = document.getElementById('inventory-summary-footer');

  const searchTerm = (document.getElementById('inventory-search')?.value || '').toLowerCase().trim();
  const categoryFilter = document.getElementById('inventory-category-filter')?.value || 'all';

  let products = inventory.getAllProducts();

  // Apply Category Filter
  if (categoryFilter !== 'all') {
    products = products.filter(p => p.category === categoryFilter);
  }

  // Apply Search Filter
  if (searchTerm) {
    products = products.filter(p =>
      p.id.toLowerCase().includes(searchTerm) ||
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  summaryFooter.textContent = `Showing ${products.length} of ${inventory.getTotalProducts()} products`;

  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">No products found matching your search criteria.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = products.map(product => {
    // Stock status badge
    let stockBadge = '';
    if (product.stock === 0) {
      stockBadge = `<span class="badge badge-stock-out">Out of Stock (0)</span>`;
    } else if (product.stock <= 10) {
      stockBadge = `<span class="badge badge-stock-low">Low Stock (${product.stock})</span>`;
    } else {
      stockBadge = `<span class="badge badge-stock-good">${product.stock} units</span>`;
    }

    // Category badge class
    const categoryClass = `badge-${product.category}`;

    return `
      <tr>
        <td><strong>${product.id}</strong></td>
        <td>
          <span style="margin-right: 6px;">${product.icon}</span>
          <strong>${product.name}</strong>
        </td>
        <td><span class="badge ${categoryClass}">${product.categoryLabel}</span></td>
        <td><strong>${formatPHP(product.price)}</strong></td>
        <td>${stockBadge}</td>
        <td class="text-center">
          <div style="display: inline-flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-primary" onclick="prepareSaleForProduct('${product.id}')" title="Sell this item">
              <span>🛒</span> Sell
            </button>
            <button class="btn btn-sm btn-secondary" onclick="openRestockModal('${product.id}')" title="Restock product">
              <span>📦</span> Restock
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Populate Product Dropdown in Sales Screen
 */
function populateSalesProductDropdown(selectedId = '') {
  const inventory = InventoryManager.getInstance();
  const selectElem = document.getElementById('sale-product-select');
  const products = inventory.getAllProducts();

  selectElem.innerHTML = '<option value="" disabled selected>-- Select an item from inventory --</option>';

  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.id} - ${p.name} (${formatPHP(p.price)} | Stock: ${p.stock})`;
    if (p.stock === 0) {
      opt.textContent += ' [OUT OF STOCK]';
    }
    if (p.id === selectedId) {
      opt.selected = true;
    }
    selectElem.appendChild(opt);
  });

  updateProductPreview();
}

/**
 * Update Selected Product Preview in Sales Screen
 */
function updateProductPreview() {
  const selectElem = document.getElementById('sale-product-select');
  const previewCard = document.getElementById('sale-product-preview');
  const qtyInput = document.getElementById('sale-quantity');
  const subtotalDisplay = document.getElementById('sale-item-subtotal');
  const errorBox = document.getElementById('stock-error-box');

  const selectedId = selectElem.value;
  if (!selectedId) {
    previewCard.style.display = 'none';
    subtotalDisplay.textContent = formatPHP(0);
    errorBox.style.display = 'none';
    return;
  }

  const inventory = InventoryManager.getInstance();
  const product = inventory.findProductById(selectedId);

  if (!product) {
    previewCard.style.display = 'none';
    return;
  }

  previewCard.style.display = 'flex';
  document.getElementById('prev-prod-name').textContent = `${product.icon} ${product.name} (${product.id})`;
  document.getElementById('prev-prod-category').textContent = product.categoryLabel;
  document.getElementById('prev-prod-category').className = `badge badge-${product.category}`;
  document.getElementById('prev-prod-price').textContent = formatPHP(product.price);

  const stockBadge = document.getElementById('prev-prod-stock');
  if (product.stock === 0) {
    stockBadge.textContent = 'Out of Stock (0)';
    stockBadge.className = 'badge badge-stock-out';
  } else if (product.stock <= 10) {
    stockBadge.textContent = `Low Stock (${product.stock} available)`;
    stockBadge.className = 'badge badge-stock-low';
  } else {
    stockBadge.textContent = `${product.stock} available`;
    stockBadge.className = 'badge badge-stock-good';
  }

  // Calculate live item preview subtotal
  const qty = parseInt(qtyInput.value, 10) || 1;
  subtotalDisplay.textContent = formatPHP(product.price * qty);

  // Check stock limits dynamically
  if (product.stock < qty) {
    errorBox.style.display = 'flex';
    document.getElementById('stock-error-message').textContent =
      product.stock === 0
        ? `"${product.name}" is currently out of stock.`
        : `Only ${product.stock} units available in stock. Cannot sell ${qty}.`;
  } else {
    errorBox.style.display = 'none';
  }
}

/**
 * Render Cart Items & Update Checkout Calculations
 */
function renderCart() {
  const tableBody = document.getElementById('cart-table-body');
  const btnComplete = document.getElementById('btn-complete-sale');
  const btnClear = document.getElementById('btn-clear-cart');
  const cartBadge = document.getElementById('nav-cart-badge');

  const cart = checkout.cart;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update cart badge in navbar
  if (totalItemCount > 0) {
    cartBadge.textContent = totalItemCount;
    cartBadge.style.display = 'inline-block';
    btnClear.style.display = 'inline-flex';
  } else {
    cartBadge.style.display = 'none';
    btnClear.style.display = 'none';
  }

  if (cart.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">The cart is currently empty. Add products from the left panel.</td>
      </tr>
    `;
    btnComplete.disabled = true;
  } else {
    btnComplete.disabled = false;
    tableBody.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.quantity;
      return `
        <tr>
          <td>
            <strong>${item.name}</strong>
            <br><small class="text-muted">${item.id}</small>
          </td>
          <td>${formatPHP(item.price)}</td>
          <td><strong>×${item.quantity}</strong></td>
          <td><strong>${formatPHP(itemTotal)}</strong></td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline text-danger" onclick="removeCartItem('${item.id}')" title="Remove item">
              &times;
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Update calculations using Strategy Pattern
  const subtotal = checkout.calculateSubtotal();
  const discount = checkout.calculateDiscount(subtotal);
  const finalTotal = checkout.calculateTotal();

  document.getElementById('checkout-subtotal').textContent = formatPHP(subtotal);
  document.getElementById('checkout-discount').textContent = `-${formatPHP(discount)}`;
  document.getElementById('checkout-total').textContent = formatPHP(finalTotal);

  // Update discount label with active strategy name
  const strategyName = checkout.getDiscountStrategy().getName();
  document.getElementById('discount-label').textContent = `Discount (${strategyName}):`;
}

/**
 * Remove an item from the Cart
 */
function removeCartItem(productId) {
  const removed = checkout.removeItem(productId);
  if (removed) {
    showToast(`Removed ${removed.name} from cart (stock returned to inventory).`, 'info');
    renderCart();
    populateSalesProductDropdown();
    renderDashboard();
    renderInventoryTable();
  }
}

/**
 * Prepare a Sale from the Inventory table "Sell" button
 */
function prepareSaleForProduct(productId) {
  navigateToSection('sales');
  populateSalesProductDropdown(productId);
  document.getElementById('sale-quantity').value = 1;
  updateProductPreview();
  showToast(`Selected product for sale. Specify quantity and click Add to Cart.`, 'info');
}

/**
 * Restock Modal Controller
 */
let currentRestockProductId = null;

function openRestockModal(productId) {
  const inventory = InventoryManager.getInstance();
  const product = inventory.findProductById(productId);
  if (!product) return;

  currentRestockProductId = productId;
  document.getElementById('restock-prod-id').textContent = product.id;
  document.getElementById('restock-prod-name').textContent = `${product.icon} ${product.name}`;
  document.getElementById('restock-current-stock').textContent = product.stock;

  const qtyInput = document.getElementById('restock-quantity-input');
  qtyInput.value = 10;

  // Calculate live preview of new stock
  updateRestockCalculation();

  const modal = document.getElementById('restock-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  qtyInput.focus();
}

function closeRestockModal() {
  const modal = document.getElementById('restock-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  currentRestockProductId = null;
}

function updateRestockCalculation() {
  if (!currentRestockProductId) return;
  const inventory = InventoryManager.getInstance();
  const product = inventory.findProductById(currentRestockProductId);
  if (!product) return;

  const qtyToAdd = parseInt(document.getElementById('restock-quantity-input').value, 10) || 0;
  const newStock = Math.max(0, product.stock + qtyToAdd);
  document.getElementById('restock-new-stock').textContent = newStock;
}

function handleConfirmRestock() {
  if (!currentRestockProductId) return;
  const qtyInput = document.getElementById('restock-quantity-input');
  const qtyToAdd = parseInt(qtyInput.value, 10);

  if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
    showToast('Please enter a valid positive quantity to restock.', 'error');
    return;
  }

  const inventory = InventoryManager.getInstance();
  const product = inventory.findProductById(currentRestockProductId);
  const oldStock = product.stock;
  const newStock = inventory.restockProduct(currentRestockProductId, qtyToAdd);

  closeRestockModal();
  showToast(`Successfully restocked ${product.name}! Stock increased from ${oldStock} to ${newStock}.`, 'success');

  // Reactively refresh tables and dashboard
  renderDashboard();
  renderInventoryTable();
  populateSalesProductDropdown();
}

/**
 * Receipt Modal Controller
 */
function showReceiptModal(receipt) {
  const modal = document.getElementById('receipt-modal');
  document.getElementById('receipt-number').textContent = `Receipt #: ${receipt.receiptNumber}`;
  document.getElementById('receipt-datetime').textContent = `Date: ${receipt.dateTime}`;

  const itemsBody = document.getElementById('receipt-items-body');
  itemsBody.innerHTML = receipt.items.map(item => `
    <tr>
      <td class="text-left">${item.name}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-right">${formatPHP(item.price)}</td>
      <td class="text-right">${formatPHP(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  document.getElementById('receipt-subtotal').textContent = formatPHP(receipt.subtotal);
  document.getElementById('receipt-discount-name').textContent = `Discount (${receipt.discountStrategyName}):`;
  document.getElementById('receipt-discount-amount').textContent = `-${formatPHP(receipt.discountAmount)}`;
  document.getElementById('receipt-final-total').textContent = formatPHP(receipt.finalTotal);

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeReceiptModal() {
  const modal = document.getElementById('receipt-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}


// ==============================
// 7. EVENT LISTENERS
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  // --- Step A: Initialize Sample Products via ProductFactory & Inventory Singleton ---
  const inventory = InventoryManager.getInstance();

  initialSampleProducts.forEach(sample => {
    // 3. Factory Pattern instantiation:
    const product = ProductFactory.createProduct(
      sample.category,
      sample.id,
      sample.name,
      sample.price,
      sample.stock
    );
    // 4. Singleton Pattern management:
    inventory.addProduct(product);
  });

  // Render initial views
  renderDashboard();
  renderInventoryTable();
  populateSalesProductDropdown();
  renderCart();

  // --- Step B: Navigation Tabs ---
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      navigateToSection(section);
    });
  });

  // --- Step C: Inventory Search & Category Filter ---
  const searchInput = document.getElementById('inventory-search');
  const categoryFilter = document.getElementById('inventory-category-filter');

  if (searchInput) {
    searchInput.addEventListener('input', () => renderInventoryTable());
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => renderInventoryTable());
  }

  // --- Step D: Add Product Form Submission ---
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('prod-id').value.trim().toUpperCase();
      const name = document.getElementById('prod-name').value.trim();
      const category = document.getElementById('prod-category').value;
      const price = parseFloat(document.getElementById('prod-price').value);
      const stock = parseInt(document.getElementById('prod-stock').value, 10);

      // Validation
      if (!id || !name || !category || isNaN(price) || isNaN(stock)) {
        showToast('Please fill out all required fields correctly.', 'error');
        return;
      }

      if (price <= 0) {
        showToast('Price must be greater than ₱0.00.', 'error');
        return;
      }

      if (stock < 0) {
        showToast('Initial stock cannot be negative.', 'error');
        return;
      }

      // Check if product ID already exists in Singleton Inventory
      if (inventory.findProductById(id)) {
        showToast(`Product ID "${id}" is already used by another item. Please choose a unique ID.`, 'error');
        return;
      }

      try {
        // DEMONSTRATING FACTORY PATTERN:
        // Use ProductFactory to manufacture the concrete product subclass
        const newProduct = ProductFactory.createProduct(category, id, name, price, stock);

        // DEMONSTRATING SINGLETON PATTERN:
        // Add newly manufactured product to the single Inventory instance
        inventory.addProduct(newProduct);

        // Success notification & form reset
        showToast(`Successfully added "${newProduct.name}" (${newProduct.id}) to inventory!`, 'success');
        addProductForm.reset();

        // Refresh views
        renderDashboard();
        renderInventoryTable();
        populateSalesProductDropdown();

        // Navigate to Inventory to review newly added product
        setTimeout(() => navigateToSection('inventory'), 600);

      } catch (err) {
        showToast(`Error adding product: ${err.message}`, 'error');
      }
    });
  }

  // --- Step E: Sales Screen Controls ---
  const saleSelect = document.getElementById('sale-product-select');
  const qtyInput = document.getElementById('sale-quantity');
  const btnQtyMinus = document.getElementById('btn-qty-minus');
  const btnQtyPlus = document.getElementById('btn-qty-plus');
  const btnAddToCart = document.getElementById('btn-add-to-cart');
  const btnClearCart = document.getElementById('btn-clear-cart');
  const btnCompleteSale = document.getElementById('btn-complete-sale');

  if (saleSelect) {
    saleSelect.addEventListener('change', updateProductPreview);
  }

  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      if (parseInt(qtyInput.value, 10) < 1) qtyInput.value = 1;
      updateProductPreview();
    });
  }

  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      const cur = parseInt(qtyInput.value, 10) || 1;
      if (cur > 1) {
        qtyInput.value = cur - 1;
        updateProductPreview();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      const cur = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = cur + 1;
      updateProductPreview();
    });
  }

  // Add Item to Cart
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      const productId = saleSelect.value;
      if (!productId) {
        showToast('Please select a product from the list.', 'warning');
        return;
      }

      const quantity = parseInt(qtyInput.value, 10) || 1;

      // Checkout addItem reduces stock in inventory singleton and stages item in cart
      const result = checkout.addItem(productId, quantity);

      if (result.success) {
        showToast(result.message, 'success');
        qtyInput.value = 1;
        renderCart();
        populateSalesProductDropdown(productId);
        renderDashboard();
        renderInventoryTable();
      } else {
        showToast(result.message, 'error');
        updateProductPreview();
      }
    });
  }

  // Clear Cart Button
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the cart? All reserved stock will be returned to inventory.')) {
        checkout.clearCart();
        showToast('Cart cleared. Stock returned to inventory.', 'info');
        renderCart();
        populateSalesProductDropdown();
        renderDashboard();
        renderInventoryTable();
      }
    });
  }

  // --- Step F: Discount Strategy Selection (Strategy Pattern) ---
  const strategyRadios = document.querySelectorAll('input[name="discount-strategy"]');
  strategyRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedStrategy = e.target.value;

      // DEMONSTRATING STRATEGY PATTERN:
      // Dynamically instantiate and swap discount algorithms
      switch (selectedStrategy) {
        case 'student':
          checkout.setDiscountStrategy(new StudentDiscountStrategy());
          showToast('Applied 5% Student Discount strategy.', 'info');
          break;
        case 'bulk':
          checkout.setDiscountStrategy(new BulkDiscountStrategy());
          showToast('Applied 10% Bulk Purchase strategy.', 'info');
          break;
        case 'regular':
        default:
          checkout.setDiscountStrategy(new RegularDiscountStrategy());
          showToast('Applied Regular Customer (No Discount) strategy.', 'info');
          break;
      }

      // Re-render calculations with new strategy
      renderCart();
    });
  });

  // --- Step G: Complete Sale Button ---
  if (btnCompleteSale) {
    btnCompleteSale.addEventListener('click', () => {
      const result = checkout.completeSale();

      if (result.success) {
        showToast(result.message, 'success');
        renderCart();
        populateSalesProductDropdown();
        renderDashboard();
        renderInventoryTable();
        showReceiptModal(result.receipt);
      } else {
        showToast(result.message, 'error');
      }
    });
  }

  // --- Step H: Restock Modal Listeners ---
  const btnCloseRestock = document.getElementById('btn-close-restock');
  const btnCancelRestock = document.getElementById('btn-cancel-restock');
  const btnConfirmRestock = document.getElementById('btn-confirm-restock');
  const restockQtyInput = document.getElementById('restock-quantity-input');

  if (btnCloseRestock) btnCloseRestock.addEventListener('click', closeRestockModal);
  if (btnCancelRestock) btnCancelRestock.addEventListener('click', closeRestockModal);
  if (btnConfirmRestock) btnConfirmRestock.addEventListener('click', handleConfirmRestock);
  if (restockQtyInput) restockQtyInput.addEventListener('input', updateRestockCalculation);

  // Close modals on overlay backdrop click
  window.addEventListener('click', (e) => {
    const restockModal = document.getElementById('restock-modal');
    const receiptModal = document.getElementById('receipt-modal');
    if (e.target === restockModal) closeRestockModal();
    if (e.target === receiptModal) closeReceiptModal();
  });

  // --- Step I: Receipt Modal Close Buttons ---
  const btnCloseReceipt = document.getElementById('btn-close-receipt');
  const btnDoneReceipt = document.getElementById('btn-done-receipt');
  if (btnCloseReceipt) btnCloseReceipt.addEventListener('click', closeReceiptModal);
  if (btnDoneReceipt) btnDoneReceipt.addEventListener('click', closeReceiptModal);

  // --- Step J: Live Singleton Verification Button ---
  const btnTestSingleton = document.getElementById('btn-test-singleton');
  const singletonResult = document.getElementById('singleton-test-result');

  if (btnTestSingleton && singletonResult) {
    btnTestSingleton.addEventListener('click', () => {
      const inv1 = InventoryManager.getInstance();
      const inv2 = InventoryManager.getInstance();
      const isSame = (inv1 === inv2);

      if (isSame) {
        singletonResult.innerHTML = `
          <span class="text-success">
            ✅ PASS: (inv1 === inv2) is TRUE. Both references point to the exact same instance in memory!
          </span>
        `;
      } else {
        singletonResult.innerHTML = `
          <span class="text-danger">
            ❌ FAIL: Instances are not identical.
          </span>
        `;
      }
    });
  }

});
