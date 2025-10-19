// ===============================================================
// === LOAD HEADER & FOOTER DINAMIS (MODULAR WEBSITE) ============
// ===============================================================
document.addEventListener("DOMContentLoaded", async () => {
  async function loadComponent(selector, filePath) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error(`Gagal memuat ${filePath}`);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.error("Error memuat komponen:", filePath, err);
    }
  }

  // Deteksi apakah halaman di root atau subfolder (tentang-kami, blogs, dll)
  const basePath =
      window.location.pathname.includes("/tentang-kami") ||
      window.location.pathname.includes("/blogs") ||
      window.location.pathname.includes("/bimbel-spesialis-kedokteran") ||
      window.location.pathname.includes("/lolos-ptn-favorit")      ||
      window.location.pathname.includes("/kontak-kami")
      ? ".."
      : ".";

  // Muat header dan footer
  await loadComponent("header", `${basePath}/components/header.html`);
  await loadComponent("footer", `${basePath}/components/footer.html`);

  // Setelah header/footer termuat, jalankan seluruh fitur website
  if (typeof EducateWebsite === "function") {
    new EducateWebsite();
  }
});

// ===============================================================
// === SCRIPT UTAMA WEBSITE EDUCATE (FITUR-FITUR INTERAKTIF) ====
// ===============================================================

// Main JavaScript for Educate Website Clone
// Following modern ES6+ practices and accessibility guidelines

class EducateWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMobileMenu();
    this.setupModal();
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
    this.setupFormHandling();
    this.setupLazyLoading();
    this.setupAccessibility();
  }

  setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
    }

    // Close mobile menu when clicking on a link (except dropdown toggles)
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const parentItem = link.closest(".nav-item");
        if (parentItem?.classList.contains("dropdown")) {
          e.preventDefault();
          parentItem.classList.toggle("active");
        } else {
          hamburger?.classList.remove("active");
          navMenu?.classList.remove("active");
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        hamburger?.classList.remove("active");
        navMenu?.classList.remove("active");
      }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header?.classList.add("header-hidden");
      } else {
        header?.classList.remove("header-hidden");
      }

      lastScrollTop = scrollTop;
    });
  }

  setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const bars = document.querySelectorAll(".bar");

    if (hamburger) {
      hamburger.addEventListener("click", () => {
        bars.forEach((bar, index) => {
          if (hamburger.classList.contains("active")) {
            bar.style.transform = "rotate(0deg)";
            if (index === 0)
              bar.style.transform = "rotate(45deg) translate(5px, 5px)";
            if (index === 1) bar.style.opacity = "0";
            if (index === 2)
              bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
          } else {
            bar.style.transform = "rotate(0deg)";
            bar.style.opacity = "1";
          }
        });
      });
    }
  }

  setupModal() {
    const modal = document.getElementById("contact");
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    const closeBtn = document.querySelector(".close");

    if (modal) {
      contactLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          this.openModal(modal);
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.closeModal(modal);
        });
      }

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
          this.closeModal(modal);
        }
      });
    }
  }

  openModal(modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input, select, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight =
            document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animateElements = document.querySelectorAll(
      ".program-card, .program-item, .feature-item, .branch-card, .testimonial-card, .teacher-card, .blog-card"
    );
    animateElements.forEach((el) => observer.observe(el));
  }

  setupFormHandling() {
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(contactForm);
      });
    }
  }

  async handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    try {
      submitBtn.textContent = "Mengirim...";
      submitBtn.disabled = true;
      form.classList.add("loading");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.showNotification(
        "Pesan berhasil dikirim! Kami akan menghubungi Anda segera.",
        "success"
      );
      form.reset();
    } catch {
      this.showNotification("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.classList.remove("loading");
    }
  }

  showNotification(message, type = "info") {
    const existing = document.querySelectorAll(".notification");
    existing.forEach((n) => n.remove());
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">×</button>
      </div>`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success"
        ? "#10b981"
        : type === "error"
          ? "#ef4444"
          : "#3b82f6"
      };
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    notification.querySelector(".notification-close").onclick = () => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    };
    setTimeout(() => notification.remove(), 5000);
  }

  setupLazyLoading() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          obs.unobserve(img);
        }
      });
    });
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      observer.observe(img);
    });
  }

  setupAccessibility() {
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-link";
    document.body.insertBefore(skipLink, document.body.firstChild);

    const mainContent = document.querySelector(".hero");
    if (mainContent) mainContent.id = "main-content";
  }
}

// Tambahkan CSS Animations untuk notifikasi
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .header-hidden { transform: translateY(-100%); }
  .header { transition: transform 0.3s ease; }
`;
document.head.appendChild(style);


// let currentIndex = 0;
// const slides = document.querySelectorAll('.unique-slide');
// const totalSlides = slides.length;
// const slider = document.querySelector('.unique-slider');

// // Fungsi untuk memperbarui posisi slider
// function updateSliderPosition() {
//   // Pastikan transisi halus
//   slider.style.transition = "transform 0.5s ease";
//   // Geser berdasarkan indeks
//   slider.style.transform = `translateX(-${currentIndex * 33}%)`;
// }

// // Tombol navigasi ke slide berikutnya
// document.querySelector('.unique-next').addEventListener('click', () => {
//   if (currentIndex < totalSlides - 1) {
//     currentIndex++;
//   } else {
//     currentIndex = 0;
//   }
//   updateSliderPosition();
// });

// // Tombol navigasi ke slide sebelumnya
// document.querySelector('.unique-prev').addEventListener('click', () => {
//   if (currentIndex > 0) {
//     currentIndex--;
//   } else {
//     currentIndex = totalSlides - 1;
//   }
//   updateSliderPosition();
// });

// // Auto slide setiap 3 detik
// setInterval(() => {
//   currentIndex++;
//   if (currentIndex >= totalSlides) {
//     currentIndex = 0;
//   }
//   updateSliderPosition();
// }, 3000); // Ganti slide setiap 3 detik

let currentIndex = 0;
const slides = document.querySelectorAll('.unique-slide');
const totalSlides = slides.length;
const slider = document.querySelector('.unique-slider');

// Fungsi untuk memperbarui posisi slider
function updateSliderPosition() {
  slider.style.transition = "transform 0.5s ease";
  slider.style.transform = `translateX(-${currentIndex * 33}%)`;
}

// Tombol navigasi ke slide berikutnya
document.querySelector('.unique-next').addEventListener('click', () => {
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSliderPosition();
});

// Tombol navigasi ke slide sebelumnya
document.querySelector('.unique-prev').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = totalSlides - 1;
  }
  updateSliderPosition();
});

// Auto slide setiap 3 detik
setInterval(() => {
  currentIndex++;
  if (currentIndex >= totalSlides) {
    currentIndex = 0;
  }
  updateSliderPosition();
}, 3000); // Ganti slide setiap 3 detik

$(document).ready(function(){
  $('.testimonials-slider').slick({
    infinite: true, // Infinite scrolling
    slidesToShow: 3, // Show 3 testimonials at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Delay between slides
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 testimonials on smaller screens
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show 1 testimonial on very small screens
          slidesToScroll: 1
        }
      }
    ]
  });
});

document.querySelectorAll('.clickable-image').forEach(function(image) {
    image.addEventListener('click', function() {
        const imageDetail = this.nextElementSibling;
        imageDetail.classList.add('active');
        imageDetail.querySelector('img').src = this.src; // Menampilkan gambar detail
    });
});

// Menutup gambar detail saat klik overlay
document.querySelectorAll('.image-detail').forEach(function(detail) {
    detail.addEventListener('click', function() {
        this.classList.remove('active');
    });
});

// 

