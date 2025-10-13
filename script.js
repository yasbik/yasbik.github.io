
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");

  menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
    const expanded = document.body.classList.contains("show-mobile-menu");
    menuOpenButton.setAttribute("aria-expanded", expanded);
  });

  menuCloseButton.addEventListener("click", () => menuOpenButton.click());

  navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
  });

  // Swiper initialization
  const swiper = new Swiper('.slider-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 25,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      728: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
