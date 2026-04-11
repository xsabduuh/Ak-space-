// ========== البيانات ==========
const products = [
  { id:1, name:"كراميل مملح", desc:"مزيج مذهل بين حلاوة الكراميل البني ولمسة الملح البحري.", price:24, image:"https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=400&fit=crop", bestseller:true, offer:false },
  { id:2, name:"فانيليا مدغشقر", desc:"أرقى أنواع الفانيليا من مدغشقر مع حبات البذور المرئية.", price:22, image:"https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop", bestseller:true, offer:false },
  { id:3, name:"فستق سوري", desc:"فستق حلبي أصلي محمص يدوياً مع القشطة الطازجة.", price:32, offerPrice:26, image:"https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop", bestseller:false, offer:true },
  { id:4, name:"شوكولاتة بلجيكية", desc:"كاكاو بلجيكي فاخر 70% مع قطع الشوكولاتة الداكنة.", price:28, image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop", bestseller:true, offer:false },
  { id:5, name:"مانجو ألبنسي", desc:"مانجو طازج منقطف يومياً مع لمسة ليمون.", price:20, offerPrice:16, image:"https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400&h=400&fit=crop", bestseller:false, offer:true },
  { id:6, name:"توت أزرق وفانيليا", desc:"توت بري طبيعي مع فانيليا كريمية.", price:26, image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop", bestseller:false, offer:false },
  { id:7, name:"قهوة عربية", desc:"بن مغربي محمص مع الهيل والزعفران.", price:25, image:"https://images.unsplash.com/photo-1617350053771-76d47492c3c3?w=400&h=400&fit=crop", bestseller:true, offer:false },
  { id:8, name:"بستاشيو روز", desc:"فستق مع ماء الورد ومكسرات مقرمشة.", price:30, offerPrice:24, image:"https://images.unsplash.com/photo-1563729768-6af784d6df1d?w=400&h=400&fit=crop", bestseller:false, offer:true }
];
const testimonials = [
  { name:"سارة العتيبي", text:"أفضل آيس كريم جربته في حياتي! القوام كريمي والنكهات واضحة جداً.", rating:5, avatar:"س" },
  { name:"فهد الزهراني", text:"توصيل سريع جداً والتغليف ممتاز. القهوة العربية تجربة فريدة.", rating:5, avatar:"ف" },
  { name:"نورة الدوسري", text:"أحب أن المكونات طبيعية 100% بدون إضافات صناعية.", rating:5, avatar:"ن" },
  { name:"عبدالله الشمري", text:"المانجو الألبنسي لا يُصدق! طعم الفاكهة الحقيقي وليس الصناعي.", rating:4, avatar:"ع" }
];

// ========== حالة السلة والدوال ==========
let cart = JSON.parse(localStorage.getItem('frost_cart')) || [];
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartBody = document.getElementById('cartBody');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');

function saveCart() { localStorage.setItem('frost_cart', JSON.stringify(cart)); }
function updateCartUI() {
  const total = cart.reduce((s,i) => s + i.quantity, 0);
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? 'flex' : 'none';
  if (total > 0) { cartCount.classList.add('bounce'); setTimeout(() => cartCount.classList.remove('bounce'), 300); }
}
function renderCart() {
  if (cart.length === 0) {
    cartBody.innerHTML = `<div class="cart-empty"><i class="fas fa-ice-cream"></i><h3>سلة التسوق فارغة</h3><p>أضف بعض النكهات اللذيذة لتبدأ!</p></div>`;
    cartFooter.style.display = 'none';
    return;
  }
  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">${item.price} د.م</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
  const subtotal = cart.reduce((s,i) => s + (i.price * i.quantity), 0);
  const tax = subtotal * 0.15;
  document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} د.م`;
  document.getElementById('tax').textContent = `${tax.toFixed(2)} د.م`;
  document.getElementById('total').textContent = `${(subtotal+tax).toFixed(2)} د.م`;
  cartFooter.style.display = 'block';
}
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ id: product.id, name: product.name, price: product.offerPrice || product.price, image: product.image, quantity: 1 });
  saveCart(); updateCartUI(); renderCart();
  showToast(`✨ تم إضافة ${product.name}`, 'success');
  cartBtn.style.transform = 'scale(1.2)'; setTimeout(() => cartBtn.style.transform = '', 200);
}
function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart(); updateCartUI(); renderCart();
  showToast(`🗑️ تم حذف ${item.name}`, 'warning');
}
function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); renderCart(); }
}
function checkout() {
  if (cart.length === 0) { showToast('السلة فارغة!', 'error'); return; }
  let msg = '🍨 *طلب فروست*%0A%0A';
  cart.forEach(i => msg += `• ${i.name} (${i.quantity}x) - ${i.price * i.quantity} د.م%0A`);
  const subtotal = cart.reduce((s,i) => s + (i.price * i.quantity), 0);
  const tax = subtotal * 0.15;
  msg += `%0Aالمجموع: ${subtotal.toFixed(2)} د.م%0Aالضريبة: ${tax.toFixed(2)} د.م%0A*الإجمالي: ${(subtotal+tax).toFixed(2)} د.م*`;
  window.open(`https://wa.me/212500000000?text=${msg}`, '_blank');
  cart = []; saveCart(); updateCartUI(); closeCartModal(); showToast('✅ تم إرسال الطلب', 'success');
}
function openCart() { renderCart(); cartOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeCartModal() { cartOverlay.classList.remove('active'); document.body.style.overflow = ''; }
function showToast(msg, type='default') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div'); toast.className = `toast ${type}`;
  const icons = { success:'check-circle', error:'times-circle', warning:'exclamation-circle' };
  toast.innerHTML = `<i class="fas fa-${icons[type]||'info-circle'}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}

// ========== إنشاء بطاقة منتج ==========
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  const discount = product.offerPrice ? Math.round((1 - product.offerPrice/product.price)*100) : 0;
  card.innerHTML = `
    ${product.bestseller ? '<span class="product-badge"><i class="fas fa-crown"></i> الأكثر مبيعاً</span>' : ''}
    ${product.offer ? `<span class="product-badge offer">خصم ${discount}%</span>` : ''}
    <div class="product-image-wrapper">
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop'">
      <div class="product-actions">
        <button class="action-btn" onclick="quickView(${product.id})"><i class="fas fa-eye"></i></button>
        <button class="action-btn" onclick="addToCart(${product.id})"><i class="fas fa-cart-plus"></i></button>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-footer">
        <div class="product-price">
          ${product.offerPrice ? `<span class="old-price">${product.price} د.م</span>` : ''}
          <span class="current-price">${product.offerPrice || product.price} د.م</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})"><i class="fas fa-plus"></i>أضف للسلة</button>
      </div>
    </div>
  `;
  return card;
}

// ========== تهيئة الواجهة ==========
function renderProducts() {
  const allGrid = document.getElementById('productsGrid');
  const offersGrid = document.getElementById('offersGrid');
  const bestGrid = document.getElementById('bestsellersGrid');
  
  [allGrid, offersGrid, bestGrid].forEach(g => g.innerHTML = '');
  
  products.forEach(product => {
    allGrid.appendChild(createProductCard(product));
    if (product.offer) offersGrid.appendChild(createProductCard(product));
    if (product.bestseller) bestGrid.appendChild(createProductCard(product));
  });
}

function renderTestimonials() {
  document.getElementById('testimonialsGrid').innerHTML = testimonials.map((t,i) => `
    <div class="testimonial-card">
      <div class="stars">${Array(5).fill(0).map((_,j) => `<i class="${j<t.rating?'fas':'far'} fa-star"></i>`).join('')}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author"><div class="author-avatar">${t.avatar}</div><div><h4>${t.name}</h4><span>عميل مُتحقق</span></div></div>
    </div>
  `).join('');
}

window.quickView = (id) => {
  const product = products.find(p => p.id === id);
  showToast(product.desc.substring(0,50)+'...', 'warning');
};

// ========== أحداث ==========
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCartModal);
cartOverlay.addEventListener('click', closeCartModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartModal(); });

const mobileBtn = document.getElementById('mobileMenuBtn'), mobileNav = document.getElementById('mobileNav');
mobileBtn.addEventListener('click', () => { mobileBtn.classList.toggle('active'); mobileNav.classList.toggle('active'); });
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => { mobileBtn.classList.remove('active'); mobileNav.classList.remove('active'); }));

// Scroll effect
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Intersection Observer
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); } });
}, { threshold: 0.1 });

// بدء التشغيل
renderProducts();
renderTestimonials();
updateCartUI();

setTimeout(() => {
  document.querySelectorAll('.product-card, .testimonial-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    obs.observe(el);
  });
}, 100);