/* Blackthorn & Co. — progressive enhancement only. Site works without JS. */
(function () {
  "use strict";

  /* ---- Mobile menu: animated open (grow) + close (collapse) ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var closeHandler = null;
    var clearClose = function () {
      if (closeHandler) { menu.removeEventListener("transitionend", closeHandler); closeHandler = null; }
    };
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        clearClose();
        menu.classList.remove("is-closing");
        menu.style.maxHeight = "";
        menu.style.opacity = "";
        menu.hidden = false;
      } else {
        if (menu.hidden || menu.classList.contains("is-closing")) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { menu.hidden = true; return; }
        menu.style.maxHeight = menu.scrollHeight + "px";
        void menu.offsetWidth; // commit the current height as the transition start
        menu.classList.add("is-closing");
        menu.style.maxHeight = "0px";
        closeHandler = function (e) {
          if (e.target !== menu || e.propertyName !== "max-height") return;
          clearClose();
          menu.hidden = true;
          menu.classList.remove("is-closing");
          menu.style.maxHeight = "";
          menu.style.opacity = "";
        };
        menu.addEventListener("transitionend", closeHandler);
      }
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

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky header gains elevation once scrolled past the top ---- */
  var header = document.querySelector(".site-header");
  var sentinel = document.getElementById("scroll-sentinel");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("scrolled", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ---- Desktop nav: iOS-style sliding pill driven by a scroll-spy ---- */
  (function () {
    var pnav = document.querySelector(".primary-nav");
    var pill = pnav && pnav.querySelector(".nav-pill");
    if (!pnav || !pill || !("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(pnav.querySelectorAll('a[href^="#"]'));
    var map = {}, sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1), sec = document.getElementById(id);
      if (sec) { map[id] = a; sections.push(sec); }
    });
    if (!sections.length) return;
    var current = null;

    function movePill(link, instant) {
      if (!link || pnav.offsetParent === null) return; // nav hidden (mobile)
      var nr = pnav.getBoundingClientRect(), lr = link.getBoundingClientRect();
      if (instant) pill.style.transition = "none";
      pill.style.width = (lr.width + 16) + "px";
      pill.style.height = (lr.height + 6) + "px";
      pill.style.transform = "translate(" + (lr.left - nr.left - 8) + "px, -50%)";
      pill.style.opacity = "1";
      if (instant) { void pill.offsetWidth; pill.style.transition = ""; }
    }

    function setActive(id, instant) {
      if (id && id !== current) {
        current = id;
        links.forEach(function (a) {
          var on = a === map[id];
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      }
      movePill(map[current] || map[sections[0].id], instant);
    }

    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { active = sections[i].id; break; }
      }
      if (!active) active = (window.scrollY < sections[0].offsetTop - 10) ? sections[0].id : (current || sections[0].id);
      setActive(active, false);
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });

    links.forEach(function (a) {
      a.addEventListener("click", function () { setActive(a.getAttribute("href").slice(1), false); });
    });

    function place() { setActive(current || sections[0].id, true); }
    requestAnimationFrame(place);
    window.addEventListener("load", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { movePill(map[current] || map[sections[0].id], true); }, 120);
    });
  })();

  /* ---- Scroll reveal (respects reduced-motion) + 60ms card stagger ---- */
  var STAGGER = ".service-card, .team-card, .review-card, .g-item";
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-left, .reveal-right"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger grid cards by DOM order; clear the delay after so hover stays snappy
        if (el.parentElement && el.matches(STAGGER)) {
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

  /* ---- Count-up: reviews rating/count and About stats, each when its group enters ---- */
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
      // Reserve width for the final value so digits never shift neighbours, then zero out
      counters.forEach(function (el) {
        el.style.minWidth = el.textContent.trim().length + "ch";
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
      var watch = function (group) {
        var items = Array.prototype.slice.call(group.querySelectorAll(".countup"));
        if (!items.length) return;
        var o = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            items.forEach(runCount);
            o.disconnect();
          });
        }, { threshold: 0.4 });
        o.observe(group);
      };
      var groups = Array.prototype.slice.call(document.querySelectorAll(".google-summary, .stat-row"));
      if (groups.length) { groups.forEach(watch); }
      else { watch(counters[0].parentElement || document.body); }
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
