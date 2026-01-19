const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton) {
    menuOpenButton.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });

    menuCloseButton.addEventListener("click", () => menuOpenButton.click());
    
}

// this looks absolutely insanity, but trust me
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; 
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const scrollAmount = easeInOutCubic(progress, startPosition, distance, duration);
                window.scrollTo(0, scrollAmount);
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }

            function easeInOutCubic(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }

            window.requestAnimationFrame(step);
        }
    });
});

//basically, our home is broken franco so like this is to fix it
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      if (this.getAttribute("href") === "index.html" && window.location.pathname.endsWith("index.html")) {
        e.preventDefault(); 
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });
  });
});

//for this one, im basically just like making it infinite scroll
const slider = document.querySelector(".slider-wrapper");

if (slider) {
  const list = slider.querySelector(".models-list");
  const items = list.innerHTML;


  list.innerHTML += items;

  slider.addEventListener("scroll", () => {
    if (slider.scrollLeft >= list.scrollWidth / 2) {
      slider.scrollLeft = 0;
    }

    setInterval(() => {
  slider.scrollLeft += 1;
}, 20);
  });
}
// Scroll animation for elements with .scroll-animate
const scrollElements = document.querySelectorAll(".scroll-animate");

function elementInView(el, offset = 0) {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) - offset
  );
}

function displayScrollElement(el) {
  el.classList.add("active");
}

function hideScrollElement(el) {
  el.classList.remove("active");
}

function handleScrollAnimation() {
  scrollElements.forEach((el) => {
    if (elementInView(el, 100)) {
      displayScrollElement(el);
    } else {
      hideScrollElement(el);
    }
  });
}

window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

// Trigger once on load in case section is already in view
window.addEventListener("load", () => {
  handleScrollAnimation();
});

// Back to Top Button
document.addEventListener("DOMContentLoaded", function() {
    const backToTopButton = document.getElementById('back-to-top');

    // Show button after scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Scroll animation for elements with .scroll-animate (updated version)
function revealOnScroll() {
  scrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const offset = 100; // distance from bottom of viewport to trigger
    if (rect.top <= (window.innerHeight - offset)) {
      el.classList.add('visible'); // fade in / slide in effect
    } else {
      el.classList.remove('visible'); // remove if out of view
    }
  });
}

// Listen for scroll and load events
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

const profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click", () => {
  window.location.href = "loginandsignup.html"; // <-- change this to your login page name
});