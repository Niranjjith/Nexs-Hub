(function () {
  "use strict";
  document.documentElement.classList.add("js");

  function getApiBase() {
    try {
      const override = (window.NEXS_API_BASE || "").trim();
      if (override) return override.replace(/\/+$/, "");
    } catch {}
    const host = String(window.location && window.location.hostname ? window.location.hostname : "");
    if (host.endsWith("vercel.app")) return "https://nexs-hub-1.onrender.com";
    return "";
  }

  const API_BASE = getApiBase();
  function apiUrl(path) {
    return API_BASE ? API_BASE + path : path;
  }

  // ——— Theme toggle (Light / Dark) ———
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;

  function applyTheme(theme) {
    const isDark = theme === "dark";
    rootEl.classList.toggle("theme-dark", isDark);

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  (function initTheme() {
    if (!themeToggle) return;
    let saved = null;
    try {
      saved = window.localStorage ? localStorage.getItem("nexs-theme") : null;
    } catch (e) {}

    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = saved || (prefersDark ? "dark" : "light");
    applyTheme(initialTheme);

    themeToggle.addEventListener("click", function () {
      const next = rootEl.classList.contains("theme-dark") ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("nexs-theme", next);
      } catch (e) {}
    });
  })();

  // ——— Navbar scroll + mobile menu ———
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function setScrolled() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", setScrolled, { passive: true });
  setScrolled();

  if (navToggle && navMenu && navbar) {
    navToggle.addEventListener("click", function () {
      const open = navbar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    });
  }

  // ——— Smooth offset for anchor links (fixed header) ———
  const header = document.querySelector(".site-header");
  const navHeight = function () {
    return header ? header.offsetHeight : 0;
  };

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight() - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  });

  // ——— Scroll reveal ———
  const revealEls = document.querySelectorAll(".reveal");
  let revealObserver = null;
  if (revealEls.length && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function ensureVisible(el) {
    if (!el) return;
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("is-visible");
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;",
          "'": "&#39;",
        }[c] || c
      );
    });
  }

  // ——— Team profile modal ———
  var TEAM_PROFILES = {
    alex: {
      name: "Niranjan A R",
      role: "Director",
      image: "images/team/Niranjan.jpg",
      bio:
        "Alex sets the vision for NExs and keeps our programs aligned with student needs and industry partners. Former product lead at a campus spin-out, they care about sustainable teams and clear milestones.",
      meta: ["Leadership", "Strategy", "4 yrs with NExs"],
      projects: [
        {
          name: "NExs governance & OKRs",
          desc: "Defined quarterly goals and mentor matching so squads stay unblocked.",
        },
        {
          name: "Industry advisory board",
          desc: "Recruited partners for demo days and internship pipelines.",
        },
        {
          name: "Startup Launchpad v1",
          desc: "Co-designed the first incubator curriculum and pitch rubric.",
        },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Email", href: "mailto:alex@NExs.local" },
      ],
    },
    jordan: {
      name: "Nezal Muhammed",
      role: "Programs Lead",
      image: "/images/team/nxl.jpg",
      bio:
        "Jordan runs workshops, office hours, and the event calendar. They translate messy ideas into schedules people can actually follow—without killing creativity.",
      meta: ["Programs", "Events", "CS & HCI"],
      projects: [
        {
          name: "Hack night series",
          desc: "Monthly themes, judging criteria, and sponsor swag that actually helps teams ship.",
        },
        {
          name: "Mentor office hours",
          desc: "Rolled out booking system and mentor playbooks for consistent feedback.",
        },
        {
          name: "Smart Campus pilot",
          desc: "Coordinated student teams with facilities for the first IoT trial spaces.",
        },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "GitHub", href: "https://github.com/" },
      ],
    },
    sam: {
      name: "Ansar Ahamed",
      role: "Tech Mentor",
      image: "/images/team/Ansar.jpeg",
      bio:
        "Sam is our go-to for architecture reviews, security basics, and shipping on a deadline. They have shipped production APIs and enjoy helping teams pick the boring technology that scales.",
      meta: ["Backend & DevOps", "Mentor", "Security"],
      projects: [
        {
          name: "AI Security Lab",
          desc: "Mentored the ML pipeline design and evaluation metrics for malware classifiers.",
        },
        {
          name: "Campus API standards",
          desc: "Auth patterns and rate limits shared across NExs project teams.",
        },
        {
          name: "CI templates",
          desc: "Starter GitHub Actions workflows for Node and Python stacks.",
        },
      ],
      social: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
    priya: {
      name: "Adul Isham",
      role: "Design Lead",
      image: "/images/team/Athul.jpg",
      bio:
        "Priya leads UX critiques, design systems, and accessibility checks before demo day. She bridges designers and engineers so interfaces stay coherent under real data.",
      meta: ["UX / UI", "Design systems", "A11y"],
      projects: [
        {
          name: "NExs design kit",
          desc: "Figma libraries and tokens used across student projects for consistency.",
        },
        {
          name: "Smart Campus app flows",
          desc: "Mapped navigation and error states for the first campus companion prototype.",
        },
        {
          name: "Demo day decks",
          desc: "Templates and story structure so teams present outcomes, not only screenshots.",
        },
      ],
      social: [
        { label: "Portfolio", href: "#" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
    miguel: {
      name: "Sha Rahshima",
      role: "Partnerships",
      image: "images/team/Sha.jpg",
      bio:
        "Miguel connects NExs with labs, startups, and alumni who want to mentor or hire. He negotiates lightweight agreements so students can use real datasets and tools ethically.",
      meta: ["Partnerships", "Legal basics", "Alumni"],
      projects: [
        {
          name: "Sponsor playbook",
          desc: "Clear packages for companies supporting hackathons without heavy contracts.",
        },
        {
          name: "Data-use guidelines",
          desc: "Templates for student teams working with partner-provided samples.",
        },
        {
          name: "Career fair bridge",
          desc: "Coordinated intros between top teams and hiring managers post-demo.",
        },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Email", href: "mailto:miguel@NExs.local" },
      ],
    },
    nina: {
      name: "Rifad",
      role: "Community",
      image: "/images/team/rifad.jpg",
      bio:
        "Iam grows an inclusive culture: onboarding newcomers, moderating chat, and celebrating wins. She makes sure every voice gets heard in critiques and retros.",
      meta: ["Community", "Comms", "DEI"],
      projects: [
        {
          name: "Onboarding cohorts",
          desc: "Buddy system and first-week checklist for new NExs members.",
        },
        {
          name: "Community guidelines",
          desc: "Code of conduct and escalation paths for online and in-person events.",
        },
        {
          name: "Showcase newsletter",
          desc: "Monthly highlights of shipped work and open roles inside the hub.",
        },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Twitter / X", href: "https://twitter.com/" },
      ],
    },
  };

  var teamModal = document.getElementById("teamModal");
  var teamModalClose = document.getElementById("teamModalClose");
  var teamModalImg = document.getElementById("teamModalImg");
  var teamModalName = document.getElementById("teamModalName");
  var teamModalRole = document.getElementById("teamModalRole");
  var teamModalBio = document.getElementById("teamModalBio");
  var teamModalMeta = document.getElementById("teamModalMeta");
  var teamModalProjects = document.getElementById("teamModalProjects");
  var teamModalSocial = document.getElementById("teamModalSocial");
  var teamModalKicker = document.getElementById("teamModalKicker");
  var teamModalLastFocus = null;

  function renderTeamProfile(id) {
    var p = TEAM_PROFILES[id];
    if (!p || !teamModalName) return;
    if (teamModalKicker) teamModalKicker.textContent = "NExs team";
    teamModalName.textContent = p.name;
    teamModalRole.textContent = p.role;
    if (teamModalBio) teamModalBio.textContent = p.bio;
    if (teamModalImg) {
      teamModalImg.src = p.image;
      teamModalImg.alt = "Photo of " + p.name;
    }
    if (teamModalMeta) {
      teamModalMeta.innerHTML = "";
      (p.meta || []).forEach(function (m) {
        var s = document.createElement("span");
        s.textContent = m;
        teamModalMeta.appendChild(s);
      });
    }
    if (teamModalProjects) {
      teamModalProjects.innerHTML = "";
      (p.projects || []).forEach(function (proj) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        strong.textContent = proj.name;
        li.appendChild(strong);
        var span = document.createElement("span");
        span.textContent = proj.desc;
        li.appendChild(span);
        teamModalProjects.appendChild(li);
      });
    }
    if (teamModalSocial) {
      teamModalSocial.innerHTML = "";
      (p.social || []).forEach(function (link) {
        var a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label;
        if (link.href.indexOf("mailto:") !== 0 && link.href !== "#") {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        teamModalSocial.appendChild(a);
      });
    }
  }

  function openTeamModal(id) {
    if (!teamModal) return;
    renderTeamProfile(id);
    teamModalLastFocus = document.activeElement;
    teamModal.removeAttribute("hidden");
    requestAnimationFrame(function () {
      teamModal.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
    if (teamModalClose) {
      setTimeout(function () {
        teamModalClose.focus();
      }, 50);
    }
  }

  function closeTeamModal() {
    if (!teamModal) return;
    teamModal.classList.remove("is-open");
    setTimeout(function () {
      teamModal.setAttribute("hidden", "");
      document.body.style.overflow = "";
      if (teamModalLastFocus && typeof teamModalLastFocus.focus === "function") {
        teamModalLastFocus.focus();
      }
    }, 360);
  }

  function renderTeamFromAPI(list) {
    var wrap = document.querySelector(".team-scroll");
    if (!wrap) return false;
    if (!Array.isArray(list) || list.length === 0) return false;

    // Replace team list
    wrap.innerHTML = "";
    TEAM_PROFILES = {};

    list
      .filter(function (m) {
        return m && m.active !== false;
      })
      .sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      })
      .forEach(function (m) {
        var slug = m.slug || String(m._id || "");
        TEAM_PROFILES[slug] = {
          name: m.name,
          role: m.role,
          image: m.image || "",
          bio: m.bio || "",
          meta: m.meta || [],
          projects: m.projects || [],
          social: m.social || [],
        };

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "team-member reveal";
        btn.setAttribute("role", "listitem");
        btn.setAttribute("data-team-id", slug);
        btn.setAttribute("aria-haspopup", "dialog");
        btn.setAttribute("aria-controls", "teamModal");
        btn.innerHTML =
          '<div class="team-avatar">' +
          '<img src="' +
          (m.image || "") +
          '" alt="Portrait of ' +
          (m.name || "Team member") +
          '" width="140" height="140" loading="lazy">' +
          "</div>" +
          '<span class="team-member-name">' +
          (m.name || "") +
          "</span>" +
          '<span class="team-role">' +
          (m.role || "") +
          "</span>" +
          '<span class="team-tap-hint">View profile</span>';
        wrap.appendChild(btn);
        ensureVisible(btn);
      });

    // attach click handlers
    wrap.querySelectorAll(".team-member[data-team-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-team-id");
        if (id) openTeamModal(id);
      });
    });

    return true;
  }

  // Existing static team handlers (fallback)
  document.querySelectorAll(".team-member[data-team-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-team-id");
      if (id) openTeamModal(id);
    });
  });

  if (teamModalClose) teamModalClose.addEventListener("click", closeTeamModal);
  document.querySelectorAll("[data-team-modal-close]").forEach(function (el) {
    el.addEventListener("click", closeTeamModal);
  });

  // ——— Gallery lightbox ———
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");

  let slides = [];

  let currentIndex = 0;
  let switchTimer = null;

  function buildSlidesFromDOM() {
    slides = [];
    document.querySelectorAll(".gallery-item").forEach(function (btn) {
      const typeAttr = btn.getAttribute("data-gallery-type");
      if (typeAttr === "video") {
        const src = btn.getAttribute("data-gallery-src") || "";
        slides.push({ type: "video", src: src, alt: "Gallery video" });
        return;
      }
      const img = btn.querySelector("img");
      if (!img) return;
      slides.push({ type: "image", src: img.src, alt: img.alt || "Gallery image" });
    });
  }

  function updateCounter() {
    if (lightboxCounter && slides.length) {
      lightboxCounter.textContent = currentIndex + 1 + " / " + slides.length;
    }
  }

  function stopVideo() {
    if (!lightboxVideo) return;
    try {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.load();
    } catch (e) {}
  }

  function showImage() {
    if (!lightboxImg) return;
    lightboxImg.classList.remove("is-hidden");
    if (lightboxVideo) lightboxVideo.classList.remove("is-active");
  }

  function showVideo() {
    if (!lightboxVideo) return;
    if (lightboxImg) lightboxImg.classList.add("is-hidden");
    lightboxVideo.classList.add("is-active");
  }

  function applySlide(index, animate) {
    if (!slides.length) return;
    const i = ((index % slides.length) + slides.length) % slides.length;
    currentIndex = i;

    const s = slides[currentIndex];

    function setContent() {
      if (!s) return;
      if (s.type === "video") {
        if (lightboxImg) lightboxImg.classList.remove("is-switching");
        showVideo();
        stopVideo();
        if (lightboxVideo) {
          lightboxVideo.src = s.src;
          try {
            lightboxVideo.play().catch(function () {});
          } catch (e) {}
        }
        updateCounter();
        return;
      }

      stopVideo();
      showImage();
      if (!lightboxImg) return;
      lightboxImg.src = s.src;
      lightboxImg.alt = s.alt;
      lightboxImg.classList.remove("is-switching");
      updateCounter();
    }

    if (animate) {
      if (lightboxImg) lightboxImg.classList.add("is-switching");
      if (switchTimer) clearTimeout(switchTimer);
      switchTimer = setTimeout(setContent, 220);
    } else {
      setContent();
    }
  }

  function openLightbox(index) {
    if (!lightbox || !slides.length) return;
    currentIndex = index;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
    applySlide(currentIndex, false);
    lightboxClose && lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "";
    if (switchTimer) clearTimeout(switchTimer);
    stopVideo();
  }

  function attachGalleryHandlers() {
    document.querySelectorAll(".gallery-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-gallery-index"), 10);
        openLightbox(isNaN(idx) ? 0 : idx);
      });
    });
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      applySlide(currentIndex - 1, true);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (e) {
      e.stopPropagation();
      applySlide(currentIndex + 1, true);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (teamModal && !teamModal.hidden) {
        closeTeamModal();
        return;
      }
      if (lightbox && !lightbox.hidden) {
        closeLightbox();
      }
      return;
    }
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "ArrowLeft") {
      applySlide(currentIndex - 1, true);
    } else if (e.key === "ArrowRight") {
      applySlide(currentIndex + 1, true);
    }
  });

  // ——— Members (preview on home + full list on /members) ———
  function renderMembersFromAPI(list) {
    var grid = document.getElementById("membersGrid");
    if (!grid) return false;
    if (!Array.isArray(list) || list.length === 0) return false;

    var isFull = document.body && document.body.classList.contains("page-members");
    var items = list.filter(function (m) {
      return m && m.active !== false;
    });

    if (!isFull) items = items.slice(0, 3);

    grid.innerHTML = "";

    items.forEach(function (m, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "member-card reveal";
      btn.setAttribute("role", "listitem");
      btn.setAttribute("data-member-index", String(idx));
      btn.setAttribute("aria-expanded", "false");

      var name = esc(m.name || "Member");
      var role = esc(m.role || "");
      var dept = esc(m.department || "");
      var bio = esc(m.bio || "Bio coming soon.");
      var img = m.image ? String(m.image) : "";
      var linkedin = m.linkedin ? String(m.linkedin) : "";
      var github = m.github ? String(m.github) : "";

      btn.innerHTML =
        '<span class="member-media">' +
        (img
          ? '<img class="member-img" src="' + esc(img) + '" alt="Photo of ' + name + '" loading="lazy">'
          : '<span class="member-img member-img--placeholder" aria-hidden="true"></span>') +
        "</span>" +
        '<span class="member-main">' +
        '<span class="member-name">' +
        name +
        "</span>" +
        (role ? '<span class="member-role">' + role + "</span>" : "") +
        (dept ? '<span class="member-dept">' + dept + "</span>" : "") +
        '<span class="member-hint">Tap for bio</span>' +
        "</span>" +
        '<span class="member-expand" hidden>' +
        '<span class="member-bio">' +
        bio +
        "</span>" +
        '<span class="member-links">' +
        (linkedin ? '<a class="member-link" href="' + esc(linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' : "") +
        (github ? '<a class="member-link" href="' + esc(github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' : "") +
        "</span>" +
        "</span>";

      grid.appendChild(btn);
      ensureVisible(btn);
    });

    // expand / collapse
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".member-card");
      if (!card) return;
      var expanded = card.getAttribute("aria-expanded") === "true";
      var all = Array.from(grid.querySelectorAll(".member-card"));
      all.forEach(function (c) {
        c.setAttribute("aria-expanded", "false");
        var ex = c.querySelector(".member-expand");
        if (ex) ex.hidden = true;
      });
      if (!expanded) {
        card.setAttribute("aria-expanded", "true");
        var expandEl = card.querySelector(".member-expand");
        if (expandEl) expandEl.hidden = false;
      }
    });

    return true;
  }

  const announcementsEl = document.getElementById("announcements");
  if (announcementsEl) {
    fetch(apiUrl("/api/announcements"))
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        data.forEach(function (a) {
          announcementsEl.innerHTML +=
            "<div class=\"announce\"><h3>" + a.title + "</h3><p>" + a.description + "</p></div>";
        });
      })
      .catch(function () {});
  }

  // ——— Optional: dynamic content from DB (team + media) ———
  // If admin has created records, the public pages will render from API.
  // Otherwise, the existing hardcoded HTML remains.
  (function initDynamicContent() {
    function applyHomeSettings(s) {
      if (!s || typeof s !== "object") return;
      var root = document.documentElement;

      if (s.heroImage) {
        root.style.setProperty("--home-hero-image", 'url("' + String(s.heroImage) + '")');
      }

      if (typeof s.heroOverlayOpacity === "number" && !isNaN(s.heroOverlayOpacity)) {
        var op = Math.max(0, Math.min(1, s.heroOverlayOpacity));
        root.style.setProperty("--home-hero-overlay-opacity", String(op));
      }

      var main = document.getElementById("aboutImgMain");
      var one = document.getElementById("aboutImgOne");
      var two = document.getElementById("aboutImgTwo");
      if (main && s.aboutImageMain) main.src = String(s.aboutImageMain);
      if (one && s.aboutImageOne) one.src = String(s.aboutImageOne);
      if (two && s.aboutImageTwo) two.src = String(s.aboutImageTwo);

      var aboutTextWrap = document.getElementById("aboutText");
      if (aboutTextWrap && typeof s.aboutText === "string" && s.aboutText.trim()) {
        var escText = function (str) {
          return String(str || "").replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
          });
        };
        var parts = s.aboutText
          .split(/\n\s*\n/g)
          .map(function (p) { return p.trim(); })
          .filter(Boolean);
        aboutTextWrap.innerHTML = parts.map(function (p) { return "<p>" + escText(p) + "</p>"; }).join("");
      }
    }

    function renderProjectsFromAPI(list) {
      var grid = document.getElementById("projectsGrid");
      if (!grid) return false;
      if (!Array.isArray(list) || list.length === 0) return false;

      grid.innerHTML = "";

      var items = list
        .filter(function (p) {
          return p && p.active !== false;
        })
        .sort(function (a, b) {
          return (a.order || 0) - (b.order || 0);
        });

      // Public projects page: show a single numbered list (1..N).
      var defaultImg = "/images/NCA07661.jpg";

      function renderProjectCard(p) {
          var slug = String(p.slug || "");
          var card = document.createElement("details");
          card.className = "project-item reveal";
          if (slug) card.id = slug;

          var title = esc(p.title || "Project");
          var shortDesc = esc(p.shortDescription || p.description || "");
          var img = p.image ? String(p.image) : defaultImg;
          var problem = esc(p.problem || "");
          var solution = esc(p.solution || "");
          var status = esc(p.status || "");
          var languages = Array.isArray(p.languages) ? p.languages : [];
          var github = String(p.github || "").trim();
          if (github && github.indexOf("http://") !== 0 && github.indexOf("https://") !== 0) {
            github = "https://" + github;
          }

          card.innerHTML =
            "<summary>" +
            '<div class="project-num" aria-hidden="true"></div>' +
            '<img class="project-thumb" src="' + esc(img) + '" alt="">' +
            '<div class="project-main">' +
            '<div class="project-top">' +
            '<h3 class="project-title">' + title + "</h3>" +
            (status ? '<span class="pill">' + status + "</span>" : "") +
            "</div>" +
            (shortDesc ? '<p class="project-desc">' + shortDesc + "</p>" : "") +
            "</div>" +
            "</summary>" +
            '<div class="project-expand">' +
            (problem ? '<div class="project-block"><h4>Problem</h4><p>' + problem + "</p></div>" : "") +
            (solution ? '<div class="project-block"><h4>Solution</h4><p>' + solution + "</p></div>" : "") +
            (languages.length
              ? '<div class="project-block"><h4>Languages / Tech</h4><p>' +
                esc(languages.join(", ")) +
                "</p></div>"
              : "") +
            (github
              ? '<div class="project-block"><h4>GitHub</h4><p><a class="project-link" href="' +
                esc(github) +
                '" target="_blank" rel="noopener noreferrer">' +
                esc(github) +
                "</a></p></div>"
              : "") +
            "</div>";

          ensureVisible(card);
          return card;
      }

      var listEl = document.createElement("div");
      listEl.className = "projects-grid";
      listEl.setAttribute("role", "list");
      items.forEach(function (p, idx) {
        var el = renderProjectCard(p);
        var num = el.querySelector(".project-num");
        if (num) num.textContent = String(idx + 1);
        listEl.appendChild(el);
      });
      grid.appendChild(listEl);

      // if user came via hash, open that item
      try {
        var hash = (window.location.hash || "").replace("#", "");
        if (hash) {
          var el = document.getElementById(hash);
          if (el && el.tagName === "DETAILS") {
            el.open = true;
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } catch (e) {}

      return true;
    }

    // Members
    fetch(apiUrl("/api/members"))
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (list) {
        renderMembersFromAPI(list);
      })
      .catch(function () {});

    // Team
    fetch(apiUrl("/api/team"))
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (list) {
        renderTeamFromAPI(list);
      })
      .catch(function () {});

    // Home settings (hero bg + about images)
    fetch(apiUrl("/api/home-settings"))
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (settings) {
        applyHomeSettings(settings);
      })
      .catch(function () {});

    // Media
    var grids = document.querySelectorAll("#galleryGrid");
    if (!grids || !grids.length) {
      // Not a gallery page (ex: /projects). Skip gallery rendering but continue other fetches.
    } else {
      fetch(apiUrl("/api/media"))
        .then(function (res) {
          return res.ok ? res.json() : [];
        })
        .then(function (list) {
          if (!Array.isArray(list) || list.length === 0) {
            buildSlidesFromDOM();
            attachGalleryHandlers();
            return;
          }

          var isFull = document.body && document.body.classList.contains("page-gallery");
          var items = list.filter(function (m) {
            return m && m.active !== false;
          });

          if (!isFull) items = items.slice(0, 3);

          grids.forEach(function (grid) {
            grid.innerHTML = "";
            items.forEach(function (m, idx) {
              var btn = document.createElement("button");
              btn.type = "button";
              btn.className = "gallery-item reveal" + (m.type === "video" ? " gallery-item--video" : "");
              btn.setAttribute("data-gallery-index", String(idx));
              if (m.type === "video") {
                btn.setAttribute("data-gallery-type", "video");
                btn.setAttribute("data-gallery-src", m.src);
                btn.setAttribute("aria-label", "Open gallery video");
                btn.innerHTML =
                  '<video class="gallery-video" src="' +
                  m.src +
                  '" muted playsinline preload="metadata"></video>' +
                  '<span class="gallery-item-zoom">Play</span>';
              } else {
                btn.setAttribute("aria-label", "Open gallery image " + (idx + 1));
                btn.innerHTML =
                  '<img src="' +
                  m.src +
                  '" alt="' +
                  (m.alt || "Gallery image") +
                  '" width="400" height="300" loading="lazy">' +
                  '<span class="gallery-item-zoom">View</span>';
              }
              grid.appendChild(btn);
              ensureVisible(btn);
            });
          });

          buildSlidesFromDOM();
          attachGalleryHandlers();
        })
        .catch(function () {
          buildSlidesFromDOM();
          attachGalleryHandlers();
        });
    }

    // Projects (projects page)
    fetch(apiUrl("/api/projects"))
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (list) {
        renderProjectsFromAPI(list);
      })
      .catch(function () {});
  })();
})();
