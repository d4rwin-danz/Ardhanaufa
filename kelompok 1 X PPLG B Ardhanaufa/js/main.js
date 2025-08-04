// Internal Link
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView();
      }
    });
  });
});

// Navbar
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("backdrop-blur-md");
    navbar.classList.replace("bg-base-100", "bg-base-100/30");
  } else {
    navbar.classList.remove("backdrop-blur-md");
    navbar.classList.replace("bg-base-100/30", "bg-base-100");
  }
});
