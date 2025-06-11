// Offcanvas of mobile screen toggle.
const menuIcon = document.getElementById("toggleIcon");
const closeIcon = document.getElementById("navClose");
const offcanvasEl = document.getElementById("offcanvasLeft");

// When offcanvas is fully shown
offcanvasEl.addEventListener("shown.bs.offcanvas", () => {
  menuIcon.classList.add("d-none");
  closeIcon.classList.remove("d-none");
});

// When offcanvas is fully hidden
offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
  menuIcon.classList.remove("d-none");
  closeIcon.classList.add("d-none");
});

// Menu list toggling.
const mobileMenuList = document.getElementById("mobileMenuList");

mobileMenuList.addEventListener("click", function (e) {
  e.preventDefault();

  const hairType = e.target.closest(".mobileHairType");
  const hairConcern = e.target.closest(".mobileHairConcern");
  const products = e.target.closest(".mobileProducts");
  const petTeezer = e.target.closest(".mobilePetTeezer");
  const explore = e.target.closest(".mobileExplore");
  const kids = e.target.closest(".mobileKids");
  const quiz = e.target.closest(".mobileQuiz");

  if (hairType) {
    showOffcanvas("offcanvasHairType");
  } else if (hairConcern) {
    showOffcanvas("offcanvasHairConcern");
  } else if (products) {
    showOffcanvas("offcanvasProducts");
  } else if (petTeezer) {
    showOffcanvas("offcanvasPetTeezer");
  } else if (explore) {
    showOffcanvas("offcanvasExplore");
  } else if (kids) {
    showOffcanvas("offcanvasKids");
  } else if (quiz) {
    showOffcanvas("offcanvasQuiz");
  }
});

function showOffcanvas(id) {
  const offcanvasElement = document.getElementById(id);
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
  bsOffcanvas.show();
}

// Hover Navbar down.
const navItems = document.querySelectorAll(".leftNavOnly.navbar-nav .nav-item");
const navModal = document.querySelector(".nav-modal");
const navContents = document.querySelectorAll(".nav-content");

navItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const targetId = item.getAttribute("data-target");

    navModal.style.display = "block";

    navContents.forEach((content) => {
      content.style.display = "none";
    });

    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.style.display = "block";
    }
  });
});

document.querySelector(".desktopNavList").addEventListener("mouseleave", () => {
  navModal.style.display = "none";
  navContents.forEach((content) => (content.style.display = "none"));
});

// Quote Carousel movement by curosr.
const swiper = new Swiper(".swiper", {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  grabCursor: true,
});

// Typing Animation
const text = "GET THE LATEST UPDATES...";
const typingElement = document.getElementById("typingText");

let index = 0;
let isDeleting = false;

function typeEffect() {
  if (isDeleting) {
    typingElement.textContent = text.substring(0, index--);
  } else {
    typingElement.textContent = text.substring(0, index++);
  }

  if (index > text.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1000);
  } else if (index < 0) {
    isDeleting = false;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
}

typeEffect();

// Cart count logic
function updateCartCountDisplay(count) {
  const num = document.getElementById("num");

  if (!num) return;

  if (count > 0) {
    num.innerText = count;
    num.style.display = "block";
  } else {
    num.style.display = "none";
  }
}

async function cartFetch(url) {
  const res = await fetch(url);
  const data = await res.json();

  updateCartCountDisplay(data.length);
  return data;
}

const cartContainer = document.getElementById("cartContainer");
async function displayProduct() {
  const cartArr = await cartFetch("http://localhost:3000/cart");
  cartContainer.innerHTML = "";

  if (cartArr.length === 0) {
    cartContainer.innerHTML = `<p class="text-danger fw-bold fs-4">Your cart is empty.</p>`;
    document.getElementById('alertMsg').style.display = "none"
    return;
  }

  cartArr.forEach((el) => {
    const card = document.createElement("div");
    const fixed = el.totalPrice.toFixed(2);
    card.innerHTML = `
      <div class="card mb-3 shadow rounded-4" style="border: none;">
        <div class="row g-0 align-items-center">
          <div class="col-md-5">
            <a href="/Pages/Description-Page/desc.html?id=${el.id}">
              <img src="${el.img}" class="img-fluid rounded-start" alt="${el.name}">
            </a>
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <p class="card-title mb-1 fw-bold" style="height: 40px;">${el.name}</p>
              <p class="card-text mb-1 text-success fw-bold">Unit Price: £${el.price}</p>
              <div class="d-flex align-items-center mb-2 qty-btn">
                <button class="btn btn-sm btn-outline-secondary me-2 qty-decrease" type="button" data-id="${el.id}">-</button>
                <span class="mx-2">${el.qty}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2 qty-increase" type="button" data-id="${el.id}">+</button>
              </div>
              <p class="card-text mb-3 text-dark fw-semibold">Price by Qty: £${fixed}</p>
              <button class="btn btn-sm btn-danger removebtn" type="button" data-id="${el.id}">Remove</button>
              <button class="btn btn-sm btn-warning buy-btn" type="button" id="${el.productId}">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
    cartContainer.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  displayProduct();
});

// Remove from the cart & increase decrease number.
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("removebtn")) {
    e.preventDefault();
    const id = e.target.dataset.id;

    try {
      await fetch(`http://localhost:3000/cart/${id}`, {
        method: "DELETE",
      });

      await showCartItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }
});

cartContainer.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("qty-increase") ||
    e.target.classList.contains("qty-decrease")
  ) {
    const id = e.target.getAttribute("data-id");
    const isIncrease = e.target.classList.contains("qty-increase");

    try {
      const res = await fetch(`http://localhost:3000/cart/${id}`);
      const product = await res.json();

      let newQty = product.qty + (isIncrease ? 1 : -1);
      if (newQty < 1) newQty = 1;

      const totalPrice = newQty * product.price;

      await fetch(`http://localhost:3000/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qty: newQty,
          totalPrice: totalPrice,
        }),
      });

      displayProduct();
    } catch (err) {
      console.error("Failed to update quantity and price:", err);
    }
  }

  if (e.target.classList.contains("buy-btn")) {
    const buyId = e.target.id;
    window.location.href = `/Pages/Payment-Page/pay.html?productId=${buyId}`;
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});

// Sending cart id to the payment option.
async function sendingData() {
  const res = await cartFetch("http://localhost:3000/cart");
}
sendingData();