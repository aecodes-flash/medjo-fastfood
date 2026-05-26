// ===== NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== MENU DATA =====
const menuItems = [
  { id:1, name:'Classic Burger', price:130, category:'burger', img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', best:true },
  { id:2, name:'Double Smash', price:175, category:'burger', img:'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80', best:false },
  { id:3, name:'Cheese Burger', price:149, category:'burger', img:'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&q=80', best:false },
  { id:4, name:'Crispy Chicken', price:120, category:'chicken', img:'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&q=80', best:false },
  { id:5, name:'Chicken Wings', price:160, category:'chicken', img:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&q=80', best:true },
  { id:6, name:'Grilled Chicken', price:185, category:'chicken', img:'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=300&q=80', best:false },
  { id:7, name:'Milk Tea', price:50, category:'drinks', img:'https://images.unsplash.com/photo-1558857563-b371033873b8?w=300&q=80', best:false },
  { id:8, name:'Iced Coffee', price:65, category:'drinks', img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80', best:true },
  { id:9, name:'Mango Float', price:90, category:'drinks', img:'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&q=80', best:false },
];

// ===== CART DATA =====
let cart = [];

function renderMenu(filter = 'all') {
  const grid = document.getElementById('menuGrid');
  const items = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
  grid.innerHTML = items.map(item => `
    <div class="menu-card">
      <img src="${item.img}" alt="${item.name}">
      <div class="menu-card-info">
        ${item.best ? '<span class="best-seller-badge">Best Seller</span>' : ''}
        <h3>${item.name}</h3>
        <div class="menu-price">${item.price}</div>
        <button class="btn-add-cart" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.img}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function filterMenu(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(cat);
}

function addToCart(id, name, price, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, price, qty: 1, img });
  renderCart();
  showToast(`${name} added to cart! 🛒`);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <input type="checkbox" checked>
      <img src="${item.img}" alt="${item.name}">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">${item.price}</span>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-value" id="qty-${item.id}">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');
  updateSummary();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  document.getElementById('qty-' + id).textContent = item.qty;
  updateSummary();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function updateSummary() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('subtotal').textContent = 'P' + sub;
  document.getElementById('total').textContent = 'P' + (sub + 49);
}

function selectPayment(btn) {
  document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function placeOrder() {
  cart = [];
  renderCart();
  showPage('page-orders');
  showToast('Order placed successfully! 🎉');
}

// ===== INIT =====
renderMenu();
renderCart();