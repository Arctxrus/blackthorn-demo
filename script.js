/* Blackthorn & Co. — progressive enhancement only. Site works without JS. */
(function () {
  "use strict";

  /* ---- Mobile menu toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close after tapping a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---- FAQ: keep only one open at a time (still works if JS off) ---- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---- Scroll reveal (respects reduced-motion) + 60ms services stagger ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger service cards by DOM order; clear the delay after so hover stays snappy
        if (el.classList.contains("service-card") && el.parentElement) {
          var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
          el.style.transitionDelay = (idx * 60) + "ms";
          el.addEventListener("transitionend", function handler() {
            el.style.transitionDelay = "";
            el.removeEventListener("transitionend", handler);
          });
        }
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Count-up on the reviews rating + count when they enter the viewport ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".countup"));
  if (counters.length) {
    var setFinal = function (el) {
      var to = parseFloat(el.getAttribute("data-to"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      el.textContent = dec ? to.toFixed(dec) : String(Math.round(to));
    };
    if (reduce || !("IntersectionObserver" in window) || !window.requestAnimationFrame) {
      counters.forEach(setFinal); // skip straight to final state
    } else {
      counters.forEach(function (el) {
        var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
        el.textContent = dec ? (0).toFixed(dec) : "0";
      });
      var runCount = function (el) {
        var to = parseFloat(el.getAttribute("data-to"));
        var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var dur = 1100, start = performance.now();
        (function frame(now) {
          var p = Math.min(1, (now - start) / dur);
          var v = to * (1 - Math.pow(1 - p, 3)); // ease-out cubic
          el.textContent = dec ? v.toFixed(dec) : String(Math.round(v));
          if (p < 1) requestAnimationFrame(frame); else setFinal(el);
        })(start);
      };
      var target = document.querySelector(".google-summary") || document.getElementById("reviews") || counters[0];
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          counters.forEach(runCount);
          cio.disconnect();
        });
      }, { threshold: 0.4 });
      cio.observe(target);
    }
  }

  /* ---- Booking form: custom validation + demo success (swap for Cal.com / real endpoint) ---- */
  var form = document.getElementById("booking-form");
  if (form) {
    // Restrict past dates
    var dateField = form.querySelector('input[type="date"]');
    if (dateField) {
      var t = new Date();
      dateField.min = t.getFullYear() + "-" +
        String(t.getMonth() + 1).padStart(2, "0") + "-" +
        String(t.getDate()).padStart(2, "0");
    }

    // Accepts UK mobiles like 07123 456789, 07123456789, +44 7123 456789, +447123456789
    function isUkMobile(v) {
      return /^(?:\+44|0)7\d{9}$/.test(v.replace(/[\s()\-.]/g, ""));
    }

    var checks = [
      { id: "bf-name",    ok: function (v) { return v.trim().length > 1; }, msg: "Please enter your name." },
      { id: "bf-phone",   ok: function (v) { return isUkMobile(v); },       msg: "Enter a valid UK mobile, e.g. 07123 456789 or +44 7123 456789." },
      { id: "bf-service", ok: function (v) { return !!v; },                 msg: "Please choose a service." },
      { id: "bf-date",    ok: function (v) { return !!v; },                 msg: "Please pick a preferred date." },
      { id: "bf-time",    ok: function (v) { return !!v; },                 msg: "Please pick a preferred time." }
    ];

    var warnSvg = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4.5M12 16h.01"/></svg>';

    function wrapOf(el) { return el.closest(".field"); }

    function clearError(el) {
      var w = wrapOf(el); if (!w) return;
      w.classList.remove("has-error");
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      var err = w.querySelector(".field-error");
      if (err) err.remove();
    }

    function showError(el, msg) {
      var w = wrapOf(el); if (!w) return;
      w.classList.add("has-error");
      el.setAttribute("aria-invalid", "true");
      var err = w.querySelector(".field-error");
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error";
        err.id = el.id + "-error";
        w.appendChild(err);
      }
      err.innerHTML = warnSvg + "<span>" + msg + "</span>";
      el.setAttribute("aria-describedby", err.id);
    }

    // Clear each error live as the user fixes it
    checks.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var live = function () { if (c.ok(el.value)) clearError(el); };
      el.addEventListener("input", live);
      el.addEventListener("change", live);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      checks.forEach(function (c) {
        var el = document.getElementById(c.id);
        if (!el) return;
        if (c.ok(el.value)) { clearError(el); }
        else { showError(el, c.msg); if (!firstInvalid) firstInvalid = el; }
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      // All valid — demo success (no backend). Replace form with a styled confirmation.
      var name = (document.getElementById("bf-name") || {}).value || "";
      var first = name.trim().split(/\s+/)[0].replace(/[<>&]/g, "");
      form.innerHTML =
        '<div class="form-success" role="status" aria-live="polite">' +
          '<span class="success-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
          '<h3>Thanks' + (first ? ", " + first : "") + ' — we\'ll text you to confirm.</h3>' +
          '<p>We\'ve got your request for a chair at Blackthorn &amp; Co. and will send a confirmation text shortly.</p>' +
          '<p style="font-size:.82rem">Demo only — no message is actually sent. Ready to connect to Cal.com or your booking system.</p>' +
        '</div>';
      if (!reduce) form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
