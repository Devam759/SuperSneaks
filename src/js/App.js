// src/js/App.js
// Main application logic for SuperSneaks
(function () {
  // Utility helpers for DOM selection
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Cart State Management
  const storageKey = 'supersneaks_cart_v1';
  const Cart = {
    // Retrieve cart items from local storage
    get() {
      try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch (e) { return []; }
    },
    // Save cart items to local storage
    set(items) { localStorage.setItem(storageKey, JSON.stringify(items)); },
    // Add an item to the cart
    add(item) {
      const items = Cart.get();
      const found = items.find(x => x.id === item.id);
      if (found) { found.qty += item.qty || 1; }
      else { items.push(Object.assign({ qty: 1 }, item)); }
      Cart.set(items);
    },
    // Update item quantity
    updateQty(id, qty) {
      const items = Cart.get().map(x => x.id === id ? Object.assign({}, x, { qty: Math.max(1, qty | 0) }) : x);
      Cart.set(items);
    },
    // Remove an item from the cart
    remove(id) { Cart.set(Cart.get().filter(x => x.id !== id)); },
    // Clear the entire cart
    clear() { Cart.set([]); },
    // Calculate total price
    total() { return Cart.get().reduce((s, x) => s + (x.price * x.qty), 0); }
  };

  // Intersection Observer for fade-in animations
  function observeFades() {
    const els = $$('.fade-in');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  // Event binding for "Add to Cart" buttons
  function bindAddToCart() {
    $$("[data-add-to-cart]").forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        const d = el.dataset;
        Cart.add({ id: d.id, name: d.name, price: Number(d.price || 0), img: d.img });
        alert('Added to cart');
        renderCartIfPresent();
      });
    });
  }

  // Render the cart UI if the container exists
  function renderCartIfPresent() {
    const list = $('#cartList');
    const totalEl = $('#totalAmount');
    const empty = $('#emptyState');
    if (!list || !totalEl) return;
    const items = Cart.get();
    list.innerHTML = '';
    if (items.length === 0) {
      if (empty) empty.style.display = 'block';
      totalEl.textContent = '0';
      return;
    }
    if (empty) empty.style.display = 'none';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}" width="64" height="64"/>
        <div>
          <div style="font-weight:600">${item.name}</div>
          <div class="muted">₹${item.price}</div>
        </div>
        <div style="display:flex; align-items:center; gap:.6rem;">
          <div class="qty">
            <label class="muted" for="qty-${item.id}" style="display:none">Qty</label>
            <input id="qty-${item.id}" type="number" min="1" value="${item.qty}" />
          </div>
          <button class="btn btn-outline" data-remove="${item.id}">Remove</button>
        </div>`;
      list.appendChild(row);
    });
    totalEl.textContent = String(Cart.total());
    // Bind qty changes and removes
    $$('#cartList input[type="number"]').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.id.replace('qty-', '');
        Cart.updateQty(id, Number(input.value || 1));
        renderCartIfPresent();
      });
    });
    $$('#cartList [data-remove]').forEach(btn => {
      btn.addEventListener('click', () => { Cart.remove(btn.getAttribute('data-remove')); renderCartIfPresent(); });
    });
  }

  // Handle contact form submission
  function bindContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#contactStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (status) status.textContent = 'Thanks! We will get back to you shortly.';
      form.reset();
    });
  }

  // Handle order form submission
  function bindOrderForm() {
    const form = $('#orderForm');
    const msg = $('#orderStatus');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      Cart.clear();
      if (msg) msg.textContent = 'Order placed successfully. Thank you!';
      renderCartIfPresent();
      form.reset();
    });
  }

  // Initialize app on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    console.info('[SuperSneaks] App initialized');
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

    observeFades();
    bindAddToCart();
    renderCartIfPresent();
    bindContactForm();
    bindOrderForm();

    // Initialize simple component scripts if present
    if (window.Components && typeof window.Components.Button === 'function') {
      window.Components.Button();
    }
    if (window.Components && typeof window.Components.Card === 'function') {
      window.Components.Card();
    }
  });
})();
