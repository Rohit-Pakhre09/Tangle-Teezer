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

// Main logic.
const url = "http://localhost:3000/items";
async function loadProducts() {
  try {
    const res = await fetch(url);
    const products = await res.json();

    const container = document.getElementById("productContainer");
    container.innerHTML = "";

    products.slice(0, 10).forEach((product) => {
      const anchor = document.createElement("a");
      anchor.className = "product-card";
      anchor.href = `../Pages/Description-Page/desc.html?id=${product.id}`;
      anchor.target = "_blank";
      anchor.style.textDecoration = "none";
      anchor.style.color = "black";

      anchor.innerHTML = `
        <div class="product-img-container border-bottom">
          <img src="${product.primary_image}" alt="${product.name}" class="first-image" />
          <img src="${product.second_image}" alt="${product.name}" class="second-image" />
        </div>
        
        <div class="product-info">
          <span class="badge text-uppercase bg-secondary">${product.badge}</span>
          <h5>${product.name}</h5>
          <p class="fw-bold text-success fs-4">£${product.price}</p>
        </div>
      `;

      container.appendChild(anchor);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}
loadProducts();

// Cart count display function
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

// Fetch cart and update display
async function updateCartCount() {
  try {
    const res = await fetch("http://localhost:3000/cart");
    const cartItems = await res.json();
    updateCartCountDisplay(cartItems.length);
  } catch (error) {
    console.error("Failed to update cart count:", error);
  }
}
updateCartCount();

// Cart Logic
const cart = document.getElementById("cart");

async function fetching(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function dataShowing() {
  const data = await fetching("http://localhost:3000/signUp");

  if (data.length === 0) {
    window.location.href = "Pages/Profile-Page/profile.html";
  } else {
    window.location.href = "/Pages/Cart-Page/cart.html";
  }
}

cart.addEventListener("click", async (e) => {
  e.preventDefault();
  await dataShowing();
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});