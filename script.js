// ===============================
// DRAVEN CLOTHING - Cart System
// ===============================

// Cart storage helpers
let selectedSingleProduct = null;

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart
function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(`${name} added to cart!`);
}

// Update cart count in icon
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
document.getElementById('cartCount').innerText = count;
}

// Toggle cart popup visibility
function toggleCart() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  panel.classList.toggle("open");
  overlay.style.display = panel.classList.contains("open") ? "block" : "none";
  updateCartPanel();
}

// Render items inside cart
function renderCartItems() {
  const cart = getCart();
  const cartList = document.getElementById('cartItems');
  const totalDisplay = document.getElementById('cartTotal');


  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerText = `${item.name} x ${item.qty} — ₹${item.price * item.qty}`;
    cartList.appendChild(li);
    total += item.price * item.qty;
  });

  totalDisplay.innerText = `Total: ₹${total}`;
}

// Checkout button
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let summary = "Thank you for shopping with ZORIX STYLE!\n\nYour Order:\n";
  cart.forEach(item => {
    summary += `• ${item.name} x ${item.qty} = ₹${item.qty * item.price}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  summary += `\nTotal: ₹${total}`;

  alert(summary);

  // Clear cart after checkout
  localStorage.removeItem('cart');
  updateCartCount();
  document.getElementById('cart-popup').classList.add('hidden');
}

// On page load
window.onload = () => {
  updateCartCount();
};

let products = [
  {
    image: "assets/images/tshirt2.jpg",
    name: "MOGGE Cartoon Tee",
    price: "₹299",
    description: "Premium cotton tee with bold MOGGE print."
  },
  {
    image: "assets/tshirt3.jpg",
    name: "ZORIX Skull Print",
    price: "₹1099",
    description: "Statement tee with ZORIX skull design."
  },
  {
    image: "images/tshirt3.jpg",
    name: "Clean Black Tee",
    price: "₹899",
      description: `Premium black round neck T-shirt featuring an eye-catching cartoon prisoner design with height chart backdrop.<br>
Crafted using soft & breathable 100% cotton fabric for superior comfort and durability.<br>
Ideal for casual streetwear, college fashion, or weekend hangouts.<br>
High-definition graphic print with lasting color – won’t fade or crack after washes.<br>
✔️ Relaxed unisex fit<br>
✔️ Double-stitched hems for long-lasting wear<br>
✔️ Skin-friendly & sweat-absorbent<br>
✔️ Machine washable<br>
Made in India 🇮🇳`
  },
  {
    image: "images/tshirt4.jpg",
    name: "Solid White Fit",
    price: "₹899",
    description: "Classic white fit with premium cotton comfort."
  },
  {
    image: "images/oversized1.jpg",
    name: "Oversized Black Fit",
    price: "₹1099",
    description: "Oversized black tee for ultimate streetwear swag."
  },
  {
    image: "images/oversized2.jpg",
    name: "ZORIX Street Oversize",
    price: "₹1199",
    description: "Street-inspired oversized ZORIX tee."
  },
  {
    image: "images/printed1.jpg",
    name: "Bold Print Tee",
    price: "₹999",
    description: "Bold design that makes a strong statement."
  },
  {
    image: "images/printed2.jpg",
    name: "Text Art Tee",
    price: "₹999",
    description: "Typography art for expressive style."
  },
  {
    image: "images/solid1.jpg",
    name: "Jet Black Basic",
    price: "₹699",
    description: "Essential black tee for minimalist fashion."
  },
  {
    image: "images/solid2.jpg",
    name: "Classic White Crew",
    price: "₹699",
    description: "Everyday white crew neck with a clean finish."
  }
];


// Open WhatsApp with prefilled product details
function orderOnWhatsApp(name, price) {
  const phone = "918512041984"; // 🟢 Replace with your actual WhatsApp number
  const message = `Hi! I want to order: ${name} (₹${price}) from ZORIX STYLE.`;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
}

function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('active');
}

let modalProduct = {};

function addToCartFromModal() {
  addToCart(modalProduct.name, parseInt(modalProduct.price.replace(/[₹,]/g, '')));
  closeModal();
}


function showProductDetails(product) {
  modalProduct = {
    name: product.name,
    price: product.price.replace(/[₹,]/g, ""), // ✅ clean price (string to number safe)
    description: product.description,
    image: product.image
  };

  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = `₹${product.price}`;
  document.getElementById("modalDescription").innerHTML = product.description;

  const modal = document.getElementById("productModal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);

  loadReviews(product.name);
}

function closeModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300); // CSS transition duration ke according
}

function submitReview(e) {
  e.preventDefault();
  const name = document.getElementById("reviewerName").value;
  const rating = document.getElementById("reviewerRating").value;
  const comment = document.getElementById("reviewerComment").value;

  if (!reviewsDB[modalProduct.name]) reviewsDB[modalProduct.name] = [];

  reviewsDB[modalProduct.name].push({
    name, rating, comment
  });

  document.getElementById("reviewerName").value = "";
  document.getElementById("reviewerRating").value = "";
  document.getElementById("reviewerComment").value = "";

  loadReviews(modalProduct.name);
}

function openCart() {
  updateCartPanel(); // refresh cart items
  document.getElementById("cartPanel").classList.add("show");
  document.getElementById("cartOverlay").style.display = "block";
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("show");
  document.getElementById("cartOverlay").style.display = "none";
}

function updateCartPanel() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = "";

  let total = 0;
  let orderSummary = "";

  cart.forEach((item, index) => {
    total += item.price;
    orderSummary += `${item.name} - ₹${item.price}%0A`;

const itemDiv = document.createElement("div");
itemDiv.className = "cart-item";
itemDiv.innerHTML = `
  <span class="cart-item-name" style="cursor:pointer;">${item.name}</span>
  <span>₹${item.price}</span>
  <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
`;
itemDiv.querySelector(".cart-item-name").addEventListener("click", () => {
  const fullProduct = products.find(p => p.name === item.name);
  if (fullProduct) {
    showProductDetails(fullProduct);
  }
});


    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = total;
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1); // remove item
  saveCart(cart);
  updateCartCount();
  updateCartPanel();
}

function generateWhatsAppOrderLink(cart) {
  let message = "Hi! I want to order the following items from ZORIX STYLE:\n";
  cart.forEach(item => {
    message += `• ${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  message += `\nTotal: ₹${total}`;
  return `https://wa.me/918512041984?text=${encodeURIComponent(message)}`;
}

let reviewsDB = JSON.parse(localStorage.getItem("reviewsDB")) || {};

function submitReview(e) {
  e.preventDefault();

  const name = document.getElementById("reviewerName").value;
  const rating = document.getElementById("reviewerRating").value;
  const comment = document.getElementById("reviewerComment").value;

  if (!modalProduct.name) return;

  if (!reviewsDB[modalProduct.name]) {
    reviewsDB[modalProduct.name] = [];
  }

  reviewsDB[modalProduct.name].push({ name, rating, comment });
  localStorage.setItem("reviewsDB", JSON.stringify(reviewsDB));

  document.getElementById("reviewerName").value = "";
  document.getElementById("reviewerRating").value = "";
  document.getElementById("reviewerComment").value = "";

  loadReviews(modalProduct.name);
}

function loadReviews(productName) {
  const list = document.getElementById("reviewsList");
  list.innerHTML = "";

  const reviews = reviewsDB[productName] || [];

  if (reviews.length === 0) {
    list.innerHTML = "<p>No reviews yet.</p>";
  } else {
    reviews.forEach(r => {
      const div = document.createElement("div");
div.className = "review";
div.innerHTML = `<strong>${r.name}</strong><span>${r.rating}</span><p>${r.comment}</p>`;
      list.appendChild(div);
    });
  }
}

function toggleCart() {
  const panel = document.getElementById("cartPanel"); // ✅ correct ID
  const overlay = document.getElementById("cartOverlay");
  panel.classList.toggle("open");
  overlay.style.display = panel.classList.contains("open") ? "block" : "none";
  updateCartPanel(); // refresh cart items
}

function emptyCart() {
  localStorage.removeItem("cart");      // Clear saved cart
  updateCartCount();                    // Update count in navbar
  updateCartPanel();                    // Re-render empty cart panel
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.2
});

reveals.forEach(el => revealObserver.observe(el));

function openOrderModal() {
  document.getElementById("orderModal").style.display = "flex";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}

function sendFinalOrder() {
  const address = document.getElementById("userAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value;
  const size = document.getElementById("productSize").value;

  if (!address) {
    alert("Please enter your full address.");
    return;
  }

  if (!size) {
    alert("Please select your T-shirt size.");
    return;
  }

  let message = `Hey, I want to order from ZORIX STYLE:\n\n`;
  let total = 0;

  if (selectedSingleProduct) {
    message += `1. ${selectedSingleProduct.name} - ${selectedSingleProduct.price} (Size: ${size})\n`;
    total = parseInt(selectedSingleProduct.price.replace(/[₹,]/g, ""));
  } else {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ₹${item.price} (Size: ${size})\n`;
    });
    total = cart.reduce((sum, item) => sum + item.price, 0);
  }

  message += `\nTotal: ₹${total}\nSize: ${size}\nPayment: ${payment}\nAddress:\n${address}`;

  const encoded = encodeURIComponent(message);
  const number = "918512041984";
  const link = `https://wa.me/${number}?text=${encoded}`;

  window.open(link, "_blank");
  showToast();
  closeOrderModal();
  selectedSingleProduct = null;
}

function openSingleProductOrderModal() {
  selectedSingleProduct = modalProduct;

  // Get selected size from product modal
  const modalSize = document.getElementById("modalSizeSelect").value;

  // Open order modal
  document.getElementById("orderModal").style.display = "flex";

  // ✅ Prefill the size in order modal
  const sizeDropdown = document.getElementById("productSize");
  if (modalSize) {
    sizeDropdown.value = modalSize;
  } else {
    sizeDropdown.value = ""; // reset if nothing selected
  }
}

function openSingleProductOrderModalFromCard(name, price) {
  selectedSingleProduct = { name: name, price: `₹${price}` };
  document.getElementById("orderModal").style.display = "flex";
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// 🔥 Scroll reveal observer
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.2
});

revealElements.forEach(el => observer.observe(el));

// 🕒 Countdown Timer Setup (Daily Reset)
function startCountdown(hours = 2) {
  const countdownElement = document.getElementById("countdown");
  const box = document.getElementById("countdownBox");

  // Set countdown to 2 hours from now
  const now = new Date();
  const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

  const timer = setInterval(() => {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      clearInterval(timer);
      countdownElement.innerText = "00:00:00";
      box.innerText = "🚫 Offer Expired!";
      box.style.color = "#aaa";
      return;
    }

    const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const mins = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const secs = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    countdownElement.innerText = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

// Start countdown when page loads
startCountdown(2); // ⏳ 2-hour sale

// 🕒 Countdown Timer (2 hours)
function startCountdown(durationInSeconds) {
  const countdownEl = document.getElementById("countdown");
  let timeLeft = durationInSeconds;

  function updateTimer() {
    const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
    const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    countdownEl.textContent = `${hrs}:${mins}:${secs}`;

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      countdownEl.textContent = "EXPIRED";
      countdownEl.style.color = "#999";
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 🧨 Start countdown from 2 hours = 7200 seconds
startCountdown(7200);

function showProductDetails(product) {
  // Save product globally
  modalProduct = product;

  // Set modal content
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = product.price;
  document.getElementById("modalDescription").innerHTML = product.description.replace(/\n/g, "<br>");

  // Show modal
  const modal = document.getElementById("productModal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);

  // Load reviews
  loadReviews(product.name);
}
function showProductDetailsById(id) {
 
  const productMap = {
    "mogge": {
      image: "assets/images/tshirt2.jpg",
      name: "MOGGE Cartoon Tee",
      price: "299",
      description: `
        Channel your inner rebel with the iconic MOGGE Cartoon Tee, inspired by 90s street vibes.<br><br>
        ✔️ High-quality cotton blend for comfort<br>
        ✔️ Eye-catching graphic print<br>
        ✔️ Streetwear fit with bold personality<br>
        ✔️ Ideal for casual days or statement outings<br>
        ✔️ Machine washable, no shrink<br>
        Made in India 🇮🇳
      `
    },
    "urban": {
      image: "assets/images/tshirt3.jpg",
      name: "Urban Burst Tee",
      price: "299",
      description: `
        Statement tee with ZORIX skull design — street-level attitude meets comfort.<br><br>
        ✔️ Premium cotton<br>
        ✔️ Oversized urban fit<br>
        ✔️ Detailed skull artwork<br>
        ✔️ Breathable & soft<br>
        Perfect for concerts, college, or weekend flexing.
      `
    },
    "zogan": {
      image: "assets/images/tshirt4.jpg",
      name: "ZOGAN Abstract Tee",
      price: "299",
      description: `
        Abstract street design for creative souls — ZOGAN Abstract Tee lets you stand out.<br><br>
        ✔️ Artistic ink-splash design<br>
        ✔️ Relaxed fit<br>
        ✔️ Smooth cotton fabric<br>
        ✔️ Suitable for art lovers, creators, & fashion rebels<br>
        ✔️ Durable print with fade-proof quality
      `
    },
    "katon": {
      image: "assets/images/tshirt1.jpg",
      name: "KATON Black Tee",
      price: "299",
      description: `
        The ultimate black tee for every wardrobe — KATON’s signature style.<br><br>
        ✔️ 100% cotton fabric<br>
        ✔️ Clean minimalistic front<br>
        ✔️ Great for layering or solo wear<br>
        ✔️ Ultra-soft finish<br>
        ✔️ Lightweight, breathable, sweat-proof<br>
        A true everyday essential.
      `
    }
  };

  const selected = productMap[id];
  if (selected) {
    showProductDetails(selected);
  } else {
    alert("Product not found.");
  }
}
