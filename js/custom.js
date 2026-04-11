/* ============================================================
custom.js — فين | مطعم الوجبات السريعة
============================================================ */

/* ===== YEAR ===== */
document.getElementById(‘footerYear’).textContent = new Date().getFullYear();

/* ===== CART STATE ===== */
var cart = [];

function getCartCount() {
return cart.reduce(function(s, i) { return s + i.qty; }, 0);
}

function getCartTotal() {
return cart.reduce(function(s, i) { return s + (i.price * i.qty); }, 0);
}

function updateCartUI() {
var count   = getCartCount();
var badge   = document.getElementById(‘cart-badge’);
var totalEl = document.getElementById(‘cart-total’);
var itemsEl = document.getElementById(‘cart-items’);
var emptyEl = document.getElementById(‘cart-empty’);

badge.textContent = count;
badge.classList.toggle(‘show’, count > 0);
totalEl.textContent = getCartTotal() + ’ د.م’;

/* clear existing rows */
itemsEl.querySelectorAll(’.cart-item’).forEach(function(el) { el.remove(); });

if (cart.length === 0) {
emptyEl.style.display = ‘flex’;
return;
}

emptyEl.style.display = ‘none’;

cart.forEach(function(item, idx) {
var div = document.createElement(‘div’);
div.className = ‘cart-item’;
div.innerHTML =
‘<div class="cart-item-name">’ + item.name + ‘</div>’ +
‘<div class="cart-item-qty">’ +
‘<button class="qty-btn" onclick="changeQty(' + idx + ',-1)">−</button>’ +
‘<span class="qty-num">’ + item.qty + ‘</span>’ +
‘<button class="qty-btn" onclick="changeQty(' + idx + ',1)">+</button>’ +
‘</div>’ +
‘<div class="cart-item-price">’ + (item.price * item.qty) + ’ د.م</div>’ +
‘<button class="cart-item-del" onclick="removeFromCart(' + idx + ')">’ +
‘<i class="fas fa-trash-alt"></i>’ +
‘</button>’;
itemsEl.insertBefore(div, emptyEl);
});
}

function addToCart(btn, name, price) {
var existing = cart.find(function(i) { return i.name === name; });
if (existing) {
existing.qty++;
} else {
cart.push({ name: name, price: price, qty: 1 });
}
updateCartUI();
showToast(‘تمت إضافة ’ + name + ’ 🛒’);
btn.classList.add(‘added’);
setTimeout(function() { btn.classList.remove(‘added’); }, 500);
}

function changeQty(idx, delta) {
cart[idx].qty += delta;
if (cart[idx].qty <= 0) cart.splice(idx, 1);
updateCartUI();
}

function removeFromCart(idx) {
cart.splice(idx, 1);
updateCartUI();
}

function openCart() {
document.getElementById(‘cart-sidebar’).classList.add(‘open’);
document.getElementById(‘cart-overlay’).classList.add(‘open’);
document.body.style.overflow = ‘hidden’;
}

function closeCart() {
document.getElementById(‘cart-sidebar’).classList.remove(‘open’);
document.getElementById(‘cart-overlay’).classList.remove(‘open’);
document.body.style.overflow = ‘’;
}

function checkout() {
if (cart.length === 0) {
showToast(‘السلة فارغة! أضف وجبات أولاً 🍽️’);
return;
}
showToast(‘تم استلام طلبك! سنتواصل معك قريباً ✅’);
cart = [];
updateCartUI();
closeCart();
}

/* ===== TOAST ===== */
function showToast(msg) {
var toast = document.getElementById(‘toast’);
var msgEl = document.getElementById(‘toast-msg’);
msgEl.textContent = msg;
toast.classList.add(‘show’);
clearTimeout(toast._timer);
toast._timer = setTimeout(function() {
toast.classList.remove(‘show’);
}, 3000);
}

/* ===== FOOD FILTERS ===== */
document.querySelectorAll(’.filters_menu li’).forEach(function(li) {
li.addEventListener(‘click’, function() {
document.querySelectorAll(’.filters_menu li’).forEach(function(l) {
l.classList.remove(‘active’);
});
this.classList.add(‘active’);

```
var filter = this.dataset.filter;

document.querySelectorAll('.food-item').forEach(function(item) {
  var card = item.querySelector('.food-card');
  if (filter === 'all' || item.classList.contains(filter)) {
    item.style.display = '';
    setTimeout(function() { card.classList.add('show'); }, 10);
  } else {
    card.classList.remove('show');
    setTimeout(function() { item.style.display = 'none'; }, 360);
  }
});
```

});
});

/* ===== SCROLL TO TOP ===== */
window.addEventListener(‘scroll’, function() {
var btn = document.getElementById(‘scrollTop’);
if (window.scrollY > 400) {
btn.classList.add(‘visible’);
} else {
btn.classList.remove(‘visible’);
}
});

/* ===== REVEAL ON SCROLL ===== */
var revealObserver = new IntersectionObserver(function(entries) {
entries.forEach(function(entry, i) {
if (entry.isIntersecting) {
setTimeout(function() {
entry.target.classList.add(‘visible’);
}, i * 80);
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.1 });

document.querySelectorAll(’.reveal’).forEach(function(el) {
revealObserver.observe(el);
});

/* ===== BOOKING FORM ===== */
function submitBooking(e) {
e.preventDefault();
showToast(‘تم استلام حجزك بنجاح! سنؤكد لك قريباً ✅’);
e.target.reset();
}

/* ===== HELPERS ===== */
function scrollToFood() {
var el = document.getElementById(‘food’);
if (el) el.scrollIntoView({ behavior: ‘smooth’ });
}

function toggleSearch() {
showToast(‘قريباً — البحث في القائمة 🔍’);
}

/* ===== OWL CAROUSEL ===== */
$(document).ready(function() {
$(’.client_owl-carousel’).owlCarousel({
loop: true,
margin: 20,
nav: true,
dots: false,
rtl: true,
autoplay: true,
autoplayTimeout: 4500,
autoplayHoverPause: true,
navText: [
‘<i class="fas fa-chevron-right"></i>’,
‘<i class="fas fa-chevron-left"></i>’
],
responsive: {
0:   { items: 1 },
768: { items: 2 },
1024:{ items: 3 }
}
});
});