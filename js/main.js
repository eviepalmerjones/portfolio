(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- nav: click to scroll + active state ---------------- */

  var navPills = Array.prototype.slice.call(document.querySelectorAll(".nav-pill"));
  var sections = navPills
    .map(function (pill) {
      var id = pill.getAttribute("data-target");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  navPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      var target = document.querySelector(pill.getAttribute("data-target"));
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  function setActivePill() {
    var scrollPos = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec && sec.offsetTop <= scrollPos) current = sec;
    });
    navPills.forEach(function (pill) {
      var isActive = pill.getAttribute("data-target") === "#" + (current && current.id);
      pill.classList.toggle("active", isActive);
    });
  }

  var navTicking = false;
  window.addEventListener("scroll", function () {
    if (!navTicking) {
      window.requestAnimationFrame(function () {
        setActivePill();
        navTicking = false;
      });
      navTicking = true;
    }
  });
  setActivePill();

  /* ---------------- sticker parallax: stars drift as the page scrolls ---------------- */
  /* every sticker starts exactly at its pinned spot (offset 0) and only drifts
     relative to that as the user scrolls, each at its own speed & direction */

  if (!reduceMotion) {
    var parallaxStickers = Array.prototype.slice.call(document.querySelectorAll(".sticker")).map(function (el, i) {
      var speeds = [0.4, -0.3, 0.55, -0.45, 0.25, -0.6, 0.35, -0.22, 0.5];
      return { el: el, speed: speeds[i % speeds.length], offset: 0 };
    });

    var lastY = window.scrollY;
    var parallaxTicking = false;
    var maxDrift = 160;

    function applyParallax() {
      var y = window.scrollY;
      var delta = y - lastY;

      parallaxStickers.forEach(function (item) {
        item.offset = Math.max(-maxDrift, Math.min(maxDrift, item.offset + delta * item.speed));
        item.el.style.setProperty("--parallax-y", item.offset.toFixed(1) + "px");
      });

      lastY = y;
      parallaxTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(applyParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  /* ---------------- work section: platform tabs ---------------- */

  var workTabBtns = Array.prototype.slice.call(document.querySelectorAll(".work-tab-btn"));
  var workPanels = Array.prototype.slice.call(document.querySelectorAll(".work-panel"));

  workTabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");

      workTabBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      workPanels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === target);
      });
    });
  });
})();
