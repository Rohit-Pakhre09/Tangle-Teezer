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

// Login logic
const userUrl = "http://localhost:3000/signUp";
const loginForm = document.getElementById("login");
let msg = document.querySelector(".error");

const nameEl = document.getElementById("firstName");
const email = document.getElementById("email");
const pass = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.innerText = "";
  msg.style.color = "red";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  if (!emailPattern.test(email.value.trim())) {
    msg.innerText = "*Enter a valid email address!";
    return;
  }

  if (!passwordPattern.test(pass.value.trim())) {
    msg.innerText =
      "*Password must include uppercase, lowercase, number, special character and be 6+ characters!";
    return;
  }

  try {
    const res = await fetch(userUrl);
    const users = await res.json();

    const foundUser = users.find(
      (user) =>
        user.firstName === nameEl.value.trim() &&
        user.email.toLowerCase() === email.value.trim().toLowerCase() &&
        user.password === pass.value.trim()
    );

    if (foundUser) {
      msg.innerText = "Login successful!";
      msg.style.color = "green";
      window.location.href = "/index.html";
    } else {
      msg.innerText = "*Information not found!";
    }
  } catch (err) {
    msg.innerText = "Something went wrong. Please try again!";
    console.error(err);
  }

  nameEl.value = "";
  email.value = "";
  pass.value = "";
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});
