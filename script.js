/* Blackthorn & Co. · progressive enhancement only. Site works without JS. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        if (reduce) { menu.hidden = true; return; }
        menu.style.maxHeight = menu.scrollHeight + "px";
        void menu.offsetWidth;
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
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---- FAQ: keep only one open at a time (still works if JS off) ---- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".qa"));
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

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
    sections.sort(function (a, b) {
      return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
    });
    var current = null;

    function movePill(link, instant) {
      if (!link || pnav.offsetParent === null) return;
      var nr = pnav.getBoundingClientRect(), lr = link.getBoundingClientRect();
      if (instant) pill.style.transition = "none";
      pill.style.width = (lr.width + 14) + "px";
      pill.style.height = (lr.height + 12) + "px";
      pill.style.transform = "translate(" + (lr.left - nr.left - 7) + "px, -50%)";
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

  /* ---- The Work: expanding image accordion (hover/tap/keyboard) ---- */
  (function () {
    var acc = document.querySelector(".accordion");
    if (!acc) return;
    var panels = Array.prototype.slice.call(acc.querySelectorAll(".acc-panel"));
    var btns = panels.map(function (p) { return p.querySelector(".acc-btn"); });
    function open(idx) {
      panels.forEach(function (p, i) {
        var on = i === idx;
        p.classList.toggle("is-open", on);
        if (btns[i]) btns[i].setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
    btns.forEach(function (b, idx) {
      if (!b) return;
      b.addEventListener("click", function () { open(idx); });
      b.addEventListener("focus", function () { open(idx); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = idx + 1;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = idx - 1;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = btns.length - 1;
        if (n === null) return;
        e.preventDefault();
        n = (n + btns.length) % btns.length;
        if (btns[n]) btns[n].focus();
      });
    });
  })();

  /* ---- Reviews: one rotating pull-quote, manual prev/next (no autoplay) ---- */
  (function () {
    var stage = document.querySelector(".quote-stage");
    if (!stage) return;
    var quotes = Array.prototype.slice.call(stage.querySelectorAll(".quote"));
    if (!quotes.length) return;
    var prev = document.querySelector(".quote-prev");
    var next = document.querySelector(".quote-next");
    var cur = document.querySelector(".quote-cur");
    var tot = document.querySelector(".quote-total");
    var i = 0;
    if (tot) tot.textContent = String(quotes.length);
    function show(n) {
      i = (n + quotes.length) % quotes.length;
      quotes.forEach(function (q, idx) { q.classList.toggle("is-active", idx === i); });
      if (cur) cur.textContent = String(i + 1);
    }
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    show(0);
  })();

  /* ---- Deep links: Menu line / Chair pre-fills the booking form ---- */
  (function () {
    function prefill(select, value) {
      if (!select || !value) return;
      var want = value.trim(), opts = select.options;
      for (var j = 0; j < opts.length; j++) {
        if (opts[j].text.trim() === want) {
          select.selectedIndex = j;
          try { select.dispatchEvent(new Event("change", { bubbles: true })); } catch (err) {}
          return;
        }
      }
    }
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-book-service],[data-book-barber]"));
    links.forEach(function (el) {
      el.addEventListener("click", function () {
        var svc = el.getAttribute("data-book-service");
        var bar = el.getAttribute("data-book-barber");
        if (svc) prefill(document.getElementById("bf-service"), svc);
        if (bar) prefill(document.getElementById("bf-barber"), bar);
      });
    });
  })();

  /* ---- Scroll reveal (respects reduced-motion) + 60ms stagger ---- */
  var STAGGER = ".chair";
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-left, .reveal-right"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
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

  /* ---- Count-up: reviews rating/count and Shop stats ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".countup"));
  if (counters.length) {
    var setFinal = function (el) {
      var to = parseFloat(el.getAttribute("data-to"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      el.textContent = dec ? to.toFixed(dec) : String(Math.round(to));
    };
    if (reduce || !("IntersectionObserver" in window) || !window.requestAnimationFrame) {
      counters.forEach(setFinal);
    } else {
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
          var v = to * (1 - Math.pow(1 - p, 3));
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

  /* ---- Opening hours: read once from the visible table, so the page has one
     source of truth. Change the table and the slot picker and the open/closed
     badge both follow. Falls back to the published hours if the table moves. */
  var DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var HOURS = (function () {
    var fallback = { 0: null, 1: null, 2: [9, 18], 3: [9, 18], 4: [9, 20], 5: [9, 20], 6: [8, 17] };
    var index = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    var rows = document.querySelectorAll(".hours tbody tr");
    if (!rows.length) return fallback;
    var map = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, found = 0;
    Array.prototype.forEach.call(rows, function (tr) {
      var th = tr.querySelector("th"), td = tr.querySelector("td");
      if (!th || !td) return;
      var i = index[th.textContent.trim()];
      if (i === undefined) return;
      found++;
      var m = td.textContent.match(/(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/);
      map[i] = m ? [+m[1] + (+m[2]) / 60, +m[3] + (+m[4]) / 60] : null;
    });
    return found ? map : fallback;
  })();

  /* ---- "Open now" / "Closed" badge, so the answer isn't buried at the bottom ---- */
  (function () {
    var slots = document.querySelectorAll("[data-open-status]");
    if (!slots.length) return;
    function fmt(h) {
      var hr = Math.floor(h), mn = Math.round((h - hr) * 60);
      return (hr % 12 || 12) + (mn ? ":" + String(mn).padStart(2, "0") : "") + (hr >= 12 ? "pm" : "am");
    }
    var now = new Date(), dow = now.getDay(), cur = now.getHours() + now.getMinutes() / 60;
    var today = HOURS[dow], isOpen = !!(today && cur >= today[0] && cur < today[1]), label;
    if (isOpen) {
      label = "Open now, until " + fmt(today[1]);
    } else {
      label = "Closed";
      for (var i = 0; i < 8; i++) {
        var d = (dow + i) % 7, h = HOURS[d];
        if (!h) continue;
        if (i === 0 && cur < h[0]) { label = "Closed, opens " + fmt(h[0]); break; }
        if (i > 0) { label = "Closed, opens " + (i === 1 ? "tomorrow" : DAY_ABBR[d]) + " " + fmt(h[0]); break; }
      }
    }
    Array.prototype.forEach.call(slots, function (el) {
      el.textContent = label;
      el.classList.toggle("is-open", isOpen);
      el.hidden = false;
    });
  })();

  /* ---- Booking: day chips + grouped time slots (progressive enhancement) ----
     The native date/time inputs stay in the markup and keep holding the value,
     so validation and the payload are unchanged and the form still works JS-off.
     Slots are generated from the shop's real opening hours, so a closed day or
     a time in the past can never be offered. */
  (function () {
    var bform = document.querySelector(".book-form");
    var dateInput = document.getElementById("bf-date");
    var timeInput = document.getElementById("bf-time");
    var dayWrap = document.getElementById("bf-days");
    var slotWrap = document.getElementById("bf-slots");
    if (!bform || !dateInput || !timeInput || !dayWrap || !slotWrap) return;

    var STEP = 30;      // minutes between slots
    var LEAD = 30;      // last slot must start this long before closing

    function pad(n) { return String(n).padStart(2, "0"); }
    function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function hhmm(m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
    function parseIso(s) {
      var p = String(s).split("-");
      return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null;
    }

    function slotsFor(dow, isToday) {
      var h = HOURS[dow];
      if (!h) return [];
      var now = new Date(), cutoff = isToday ? now.getHours() * 60 + now.getMinutes() : -1;
      var out = [];
      for (var m = h[0] * 60; m <= h[1] * 60 - LEAD; m += STEP) {
        if (m > cutoff) out.push(m);
      }
      return out;
    }

    // Build the next few open days, skipping today once its last slot has gone
    function upcomingDays(limit) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var out = [], d = new Date(today), guard = 0;
      while (out.length < limit && guard < 30) {
        var dow = d.getDay(), diff = Math.round((d - today) / 86400000);
        if (HOURS[dow] && (diff > 0 || slotsFor(dow, true).length)) {
          out.push({
            iso: iso(d),
            dow: dow,
            label: diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : DAY_ABBR[dow] + " " + d.getDate()
          });
        }
        d.setDate(d.getDate() + 1); guard++;
      }
      return out;
    }

    function setTime(v) {
      timeInput.value = v;
      timeInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function renderSlots(isoDate) {
      slotWrap.innerHTML = "";
      if (!isoDate) {
        slotWrap.innerHTML = '<p class="slot-empty">Pick a day first and we\'ll show you the times.</p>';
        return;
      }
      var d = parseIso(isoDate);
      if (!d) return;
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var list = slotsFor(d.getDay(), d.getTime() === today.getTime());
      if (!list.length) {
        slotWrap.innerHTML = HOURS[d.getDay()]
          ? '<p class="slot-empty">No times left that day. Try the next one?</p>'
          : '<p class="slot-empty">We\'re closed that day. Tuesday to Saturday works best.</p>';
        setTime("");
        return;
      }
      var groups = [
        { title: "Morning", items: list.filter(function (m) { return m < 12 * 60; }) },
        { title: "Afternoon", items: list.filter(function (m) { return m >= 12 * 60 && m < 16 * 60; }) },
        { title: "Evening", items: list.filter(function (m) { return m >= 16 * 60; }) }
      ];
      var html = "";
      groups.forEach(function (g) {
        if (!g.items.length) return;
        html += '<div class="slot-group"><p class="slot-title">' + g.title + '</p><div class="slot-grid">';
        g.items.forEach(function (m) {
          var v = hhmm(m), id = "slot-" + v.replace(":", "");
          html += '<input class="choice-input slot-input" type="radio" name="slot" id="' + id + '" value="' + v + '" />' +
                  '<label class="choice-pill slot-pill" for="' + id + '">' + v + "</label>";
        });
        html += "</div></div>";
      });
      slotWrap.innerHTML = html;
      // keep a still-valid time selected across a day change
      var keep = slotWrap.querySelector('.slot-input[value="' + timeInput.value + '"]');
      if (keep) keep.checked = true; else setTime("");
    }

    // Day chips
    var days = upcomingDays(6);
    if (!days.length) return; // nothing sensible to offer; leave native inputs alone
    var dayHtml = "";
    days.forEach(function (d, i) {
      dayHtml += '<input class="choice-input day-input" type="radio" name="day" id="day-' + i + '" value="' + d.iso + '" />' +
                 '<label class="choice-pill day-pill" for="day-' + i + '">' + d.label + "</label>";
    });
    dayHtml += '<button type="button" class="choice-pill chip-more" id="bf-other-date">Another date</button>';
    dayWrap.innerHTML = dayHtml;

    bform.classList.add("is-enhanced");
    dayWrap.hidden = false;
    slotWrap.hidden = false;
    renderSlots(dateInput.value || "");

    dayWrap.addEventListener("change", function (e) {
      var el = e.target;
      if (!el.classList || !el.classList.contains("day-input")) return;
      dateInput.value = el.value;
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
      bform.classList.remove("show-native-date");
      renderSlots(el.value);
    });

    slotWrap.addEventListener("change", function (e) {
      var el = e.target;
      if (el.classList && el.classList.contains("slot-input")) setTime(el.value);
    });

    var other = document.getElementById("bf-other-date");
    if (other) {
      other.addEventListener("click", function () {
        bform.classList.add("show-native-date");
        Array.prototype.forEach.call(dayWrap.querySelectorAll(".day-input"), function (r) { r.checked = false; });
        dateInput.focus();
        if (dateInput.showPicker) { try { dateInput.showPicker(); } catch (err) {} }
      });
    }

    // A date typed straight into the native input still drives the slot grid
    dateInput.addEventListener("change", function () {
      var match = dayWrap.querySelector('.day-input[value="' + dateInput.value + '"]');
      Array.prototype.forEach.call(dayWrap.querySelectorAll(".day-input"), function (r) {
        r.checked = (r === match);
      });
      renderSlots(dateInput.value);
    });
  })();

  /* ---- Booking form: custom validation + demo success ---- */
  var form = document.getElementById("booking-form");
  if (form) {
    var dateField = form.querySelector('input[type="date"]');
    if (dateField) {
      var t = new Date();
      dateField.min = t.getFullYear() + "-" +
        String(t.getMonth() + 1).padStart(2, "0") + "-" +
        String(t.getDate()).padStart(2, "0");
    }

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
      if (firstInvalid) {
        // A native date/time input is hidden once the chip UI is active, so send
        // focus to the first chip in that field instead of nowhere.
        var target = firstInvalid;
        if (target.offsetParent === null) {
          var wrap = target.closest(".field");
          target = (wrap && wrap.querySelector(".choice-input, .chip-more")) || target;
        }
        target.focus();
        return;
      }

      var name = (document.getElementById("bf-name") || {}).value || "";
      var first = name.trim().split(/\s+/)[0].replace(/[<>&]/g, "");
      form.innerHTML =
        '<div class="form-success" role="status" aria-live="polite">' +
          '<span class="success-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
          '<h3>Thanks' + (first ? ", " + first : "") + '. We\'ll text you to confirm.</h3>' +
          '<p>We\'ve got your request for a chair at Blackthorn &amp; Co. and will send a confirmation text shortly.</p>' +
          '<p style="font-size:.82rem">Demo only. No message is actually sent, but this is ready to connect to Cal.com or your booking system.</p>' +
        '</div>';
      if (!reduce) form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
