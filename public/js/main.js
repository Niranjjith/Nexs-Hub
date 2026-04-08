(function () {
  "use strict";

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
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
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
      image: "images/team/nxl.jpg",
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
      image: "/images/team/ansar.jpeg",
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
      name: "Vivek Jayapal",
      role: "Design Lead",
      image: "/images/team/vivek.jpg",
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
      name: "Shahala Rahshima",
      role: "Partnerships",
      image: "/images/team/Shahala.jpg",
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
      image: "images/team/rifad.jpg",
      bio:
        "Nina grows an inclusive culture: onboarding newcomers, moderating chat, and celebrating wins. She makes sure every voice gets heard in critiques and retros.",
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
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");

  const slides = [];
  galleryItems.forEach(function (btn) {
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

  let currentIndex = 0;
  let switchTimer = null;

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
    document.body.style.overflow = "hidden";
    applySlide(currentIndex, false);
    lightboxClose && lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (switchTimer) clearTimeout(switchTimer);
    stopVideo();
  }

  galleryItems.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idx = parseInt(btn.getAttribute("data-gallery-index"), 10);
      openLightbox(isNaN(idx) ? 0 : idx);
    });
  });

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

  // ——— Optional: members / announcements (admin or other pages) ———
  const membersEl = document.getElementById("members");
  if (membersEl) {
    fetch("/api/members")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        data.forEach(function (member) {
          membersEl.innerHTML +=
            "<div class=\"card\"><h3>" +
            member.name +
            "</h3><p>" +
            member.role +
            "</p><p>" +
            member.department +
            "</p></div>";
        });
      })
      .catch(function () {});
  }

  const announcementsEl = document.getElementById("announcements");
  if (announcementsEl) {
    fetch("/api/announcements")
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
})();
