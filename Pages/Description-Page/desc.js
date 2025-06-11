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

// Displaying Data
const urlParam = new URLSearchParams(window.location.search);
const productId = urlParam.get("id");
const url = `http://localhost:3000/items/${productId}`;

async function loadProductDescription() {
  try {
    const res = await fetch(url);
    const product = await res.json();

    const container = document.getElementById("descriptionProduct");
    const variantOptions = product.variants
      .map(
        (variant, index) => `
        <option value="${index}">
          ${variant.title} - £${(variant.price / 100).toFixed(2)}
        </option>
      `
      )
      .join("");

    document.title = product.name;
    container.innerHTML = `
    <div class="col-md-10 col-lg-8 p-4 w-100 bg-white">
        <div class="row g-4">
            <!-- Product Image -->
            <div class="col-md-6 text-center">
                <img id="mainProductImage" src="${
                  product.primary_image || ""
                }" alt="${product.name}"
                    class="img-fluid rounded-3 border" />
                <p id="imageFallbackMsg" class="text-danger mt-2" style="display: none;">
                    Image is currently not available.
                </p>
            </div>

            <!-- Product Info -->
            <div class="col-md-6 d-flex flex-column justify-content-center">
                <h2 class="fw-bold">${product.name}</h2>
                <h4 class="text-success mb-3">£${product.price}</h4>

                <p class="mb-3">${product.description}</p>

                <label for="variantSelect" class="form-label mt-3 fw-semibold">
                    Select Variant
                </label>
                <select id="variantSelect" class="form-select mb-3">
                    ${variantOptions}
                </select>

                <div id="variantDetails" class="mb-4"></div>

                <a href="" class="btn btn-dark w-100 py-2 fw-semibold" target="_blank">Buy Now</a>
            </div>
        </div>
    </div>
    `;

    const variantSelect = document.getElementById("variantSelect");
    const variantDetails = document.getElementById("variantDetails");
    const image = document.getElementById("mainProductImage");
    const fallbackMsg = document.getElementById("imageFallbackMsg");

    function setImageSrc(src) {
      fallbackMsg.style.display = "none";
      image.style.display = "block";
      image.src = src;
    }

    image.addEventListener("error", () => {
      image.style.display = "none";
      fallbackMsg.style.display = "block";
    });

    function updateVariantDetails(index) {
      const variant = product.variants[index];

      variantDetails.innerHTML = `
      <p class="mb-1"><strong>SKU:</strong> ${variant.sku || "N/A"}</p>
      <p class="mb-1"><strong>Barcode:</strong> ${variant.barcode || "N/A"}</p>
      <p class="mb-1"><strong>Weight:</strong> ${variant.weight || "N/A"}g</p>
      <p class="mb-0"><strong>Availability:</strong>
        <span class="${
          variant.available ? " text-success" : "text-danger"
        } fw-semibold">
            ${variant.available ? "In Stock" : "Out of Stock"}
        </span>
    </p>  
      `;

      setImageSrc(variant.image || product.primary_image || "");
    }

    updateVariantDetails(0);

    variantSelect.addEventListener("change", (e) => {
      const index = Number(e.target.value);
      updateVariantDetails(index);
    });
  } catch (error) {
    console.error("Error loading product:", error);
    document.getElementById(
      "descriptionProduct"
    ).innerHTML = `<p class="text-danger">Failed to load product data.</p>`;
  }
}

loadProductDescription();

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});

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