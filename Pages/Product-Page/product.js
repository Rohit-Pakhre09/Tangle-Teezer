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

// Fetching data.
const url = "https://angle-be.onrender.com/items";
async function fetchingdata() {
  const res = await fetch(url);
  const data = await res.json();

  showingData(data);
  return data;
}

// Showing Data;
const container = document.getElementById("showingData");
async function showingData(data) {
  try {
    container.innerHTML = "";

    data.forEach((el) => {
      const image = el.primary_image || "";
      const name = el.name || "Product Name is currently not available!";
      const price = el.price || "N/A";

      const imageId = `productImage-${el.id}`;

      const productCard = document.createElement("div");
      productCard.className = "items product-card";

      const imageBlock = image
        ? `<img id="${imageId}" src="${image}" class="product-img card-img-top gridImg" alt="${name}" 
      onerror="this.outerHTML='<div class=\\'no-image product-img d-flex align-items-center justify-content-center text-danger fw-medium\\'>Image not available!</div>'">`
        : `<div class="no-image product-img d-flex align-items-center justify-content-center text-danger fw-medium">Image not available!</div>`;

      productCard.innerHTML = `
        <a href="../description-page/desc.html?id=${el.id}" target="_blank">
          <div class="card h-100 shadow-sm">
            ${imageBlock}
        </a>

        <div class="text-center mt-3">
          <span class="m-2 p-2 bg-info rounded-3 small text-white fw-bolder" style="font-size: 13px;">${el.badge.toUpperCase()}</span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold fs-4">${name}</h5>

          <h6 class="text-success fs-2 fw-bold mb-3">£${price}</h6>

          <button class="btn btn-dark mt-auto w-100 cart" type="button" data-id="${
            el.id
          }">
            Add to Bag
          </button>
        </div>
      </div>`;

      container.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error rendering products:", err);
  }
}

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
    const res = await fetch("https://angle-be.onrender.com/cart");
    const cartItems = await res.json();
    updateCartCountDisplay(cartItems.length);
  } catch (error) {
    console.error("Failed to update cart count:", error);
  }
}

container.addEventListener("click", async (e) => {
  if (e.target.classList.contains("cart")) {
    e.preventDefault();

    const productId = e.target.getAttribute("data-id");

    // Try getting variant from dropdown (if exists)
    const variantDropdown = document.querySelector("select#variant");
    const variantIndex = variantDropdown ? variantDropdown.value : null;

    try {
      // Fetch product
      const productRes = await fetch(
        `https://angle-be.onrender.com/items/${productId}`
      );
      const product = await productRes.json();

      // Determine selected variant
      let selectedVariant;
      if (variantIndex !== null) {
        selectedVariant = product.variants[variantIndex];
      } else {
        // Fallback to first variant or base product if not present
        selectedVariant = product.variants?.[0] || {
          title: "Default",
          price: product.price * 100, 
          image: product.primary_image,
        };
      }

      // Fetch cart
      const cartRes = await fetch("http://localhost:3000/cart");
      const cartData = await cartRes.json();

      // Check if already in cart
      const isAlreadyInCart = cartData.find(
        (item) =>
          item.productId === product.id &&
          item.variant === selectedVariant.title
      );

      if (isAlreadyInCart) {
        alert("This product variant is already in the cart!");
        return;
      }

      // Add to cart
      await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          variant: selectedVariant.title,
          img: selectedVariant.image || product.primary_image,
          price: selectedVariant.price / 100,
          description: product.description,
          qty: 1,
          totalPrice: selectedVariant.price / 100,
        }),
      });

      await updateCartCount();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

// Product Array
let productArr = await fetchingdata();

// Sorting & Filtering
const sortingSelect = document.getElementById("sorting");
const applyBtn = document.getElementById("apply");
const colorSelect = document.getElementById("color");
const priceRange = document.getElementById("priceRange");

// Apply Button
applyBtn.addEventListener("click", () => {
  const value = sortingSelect.value;
  const color = colorSelect.value;
  const price = Number(priceRange.value);

  let filterArr = [...productArr];

  if (color !== "all") {
    filterArr = filterArr.filter(
      (el) => Array.isArray(el.colors) && el.colors.includes(color)
    );
  }

  filterArr = filterArr.filter((el) => el.price <= price);

  if (value === "best_selling") {
    filterArr = filterArr.filter((el) => el.best_selling === true);
  } else if (value === "z-a") {
    filterArr.sort((a, b) => b.name.localeCompare(a.name));
  } else if (value === "a-z") {
    filterArr.sort((a, b) => a.name.localeCompare(b.name));
  } else if (value === "low") {
    filterArr.sort((a, b) => a.price - b.price);
  } else if (value === "high") {
    filterArr.sort((a, b) => b.price - a.price);
  }

  showingData(filterArr);
});

// Seearch Operation.
const search = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const value = search.value.trim().toLowerCase();

  if (value) {
    const result = productArr.filter((el) =>
      el.name.toLowerCase().includes(value)
    );

    if (result.length > 0) {
      showingData(result);
    } else {
      container.innerHTML = `
        <div class="text-center text-danger fw-bold fs-5 mt-3 text-center">
          No products found!
        </div>
      `;
    }
  } else {
    showingData(productArr);
  }

  search.value = "";
});

// Cart Logic
const cart = document.getElementById("cart");

async function fetching(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function dataShowing() {
  const value = await fetching("http://localhost:3000/signUp");

  if (value.length === 0) {
    window.location.href = "/Pages/Profile-Page/profile.html";
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
