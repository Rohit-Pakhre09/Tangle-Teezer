// window.addEventListener("load", () => {
//   setTimeout(() => {
//     document.getElementById("loader").classList.add("hidden");
//   }, 2000);
// });

const url = new URLSearchParams(window.location.search);
const id = url.get("productId");

async function detailShowing() {
  const res = await fetch(`http://localhost:3000/cart?productId=${id}`);
  const data = await res.json();
  const product = await data[0];

  // Populate product info
  document.getElementById("productImage").src = product.img;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productQty").textContent = product.qty;
  document.getElementById("productTotal").textContent = product.totalPrice;
  document.getElementById("amount").value = product.totalPrice;
}

detailShowing();

// Payment Done Msg.
const paymentForm = document.getElementById("paymentForm");
const msg = document.getElementById("msg");
const payBtn = paymentForm.querySelector('button[type="submit"]');

// Patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cardPattern = /^\d{16}$/;
const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cvvPattern = /^\d{3}$/;

// Form Submit Handler
paymentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  msg.textContent = ""; // Clear previous message

  // Fetch values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  // Validation
  if (fullName === "") {
    msg.textContent = "Full Name is required.";
    return;
  }

  if (!emailPattern.test(email)) {
    msg.textContent = "Enter a valid email address.";
    return;
  }

  if (!cardPattern.test(cardNumber)) {
    msg.textContent = "Card Number must be exactly 16 digits.";
    return;
  }

  if (!expiryPattern.test(expiry)) {
    msg.textContent = "Expiry must be in MM/YY format.";
    return;
  }

  if (!cvvPattern.test(cvv)) {
    msg.textContent = "CVV must be 3 digits.";
    return;
  }

  // If all valid, show spinner
  payBtn.disabled = true;
  const originalText = payBtn.innerHTML;
  payBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
    Please wait...
  `;

  // Simulate payment delay
  setTimeout(() => {
    const paymentModal = new bootstrap.Modal(
      document.getElementById("paymentModal")
    );
    paymentModal.show();

    payBtn.disabled = false;
    payBtn.innerHTML = originalText;
    paymentForm.reset();
    msg.textContent = "";
  }, 3000);
});

const close = document.getElementById("close");
close.addEventListener("click", () => {
  setTimeout(() => {
    window.location.replace("/Pages/Product-Page/product.html");
  }, 1000);
});

// Back Btn
const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
  // window.open("/Pages/Cart-Page/cart.html", "_blank");
  window.location.replace('/Pages/Cart-Page/cart.html')
});
