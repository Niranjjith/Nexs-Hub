(function () {
  "use strict";

  const logoutBtn = document.getElementById("logoutBtn");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const panelTitle = document.getElementById("panelTitle");
  const panelBody = document.getElementById("panelBody");
  const addBtn = document.getElementById("addBtn");

  const dialog = document.getElementById("editorDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogFields = document.getElementById("dialogFields");
  const dialogHint = document.getElementById("dialogHint");
  const editorForm = document.getElementById("editorForm");
  const cancelBtn = document.getElementById("cancelBtn");

  let activeTab = "media";
  let editing = null;
  let imageLibrary = null;

  async function getImageLibrary() {
    if (imageLibrary) return imageLibrary;
    const list = await api("/admin/api/image-library");
    imageLibrary = Array.isArray(list) ? list : [];
    return imageLibrary;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    }[c]));
  }

  async function api(path, options) {
    const res = await fetch(path, options);
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return null;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async function logout() {
    await api("/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  function setActive(tab) {
    activeTab = tab;
    navItems.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));
    panelTitle.textContent =
      tab === "media" ? "Gallery Media" :
        tab === "team" ? "Meet Our Team" :
          tab === "joinRequests" ? "Join Requests" :
            tab === "members" ? "Members" :
              tab === "announcements" ? "Announcements" :
                tab === "projects" ? "Projects" :
                  tab === "homeSettings" ? "Home Settings" : "Admin Settings";

    addBtn.style.display = tab === "joinRequests" || tab === "settings" || tab === "homeSettings" ? "none" : "";
    loadTab();
  }

  function renderTable(headers, rowsHtml) {
    return `
      <table class="admin-table">
        <thead>
          <tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="${headers.length}">No records yet.</td></tr>`}
        </tbody>
      </table>
    `;
  }

  async function loadTab() {
    panelBody.innerHTML = `<p class="pill">Loading…</p>`;

    if (activeTab === "media") {
      const data = await api("/admin/api/media");
      if (!data) return;
      const rows = data
        .map((m) => `
          <tr>
            <td>
              ${m.type === "video"
                ? `<span class="pill">▶</span>`
                : m.src
                  ? `<img class="admin-thumb" src="${esc(m.src)}" alt="" loading="lazy" />`
                  : ""}
            </td>
            <td><span class="pill">${esc(m.type)}</span></td>
            <td style="max-width:420px; word-break:break-all">${esc(m.src)}</td>
            <td>${esc(m.title || "")}</td>
            <td>${esc(m.order ?? 0)}</td>
            <td>${m.active ? "Yes" : "No"}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${m._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${m._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Preview", "Type", "Src", "Title", "Order", "Active", "Actions"], rows);
      return;
    }

    if (activeTab === "team") {
      const data = await api("/admin/api/team");
      if (!data) return;
      const rows = data
        .map((t) => `
          <tr>
            <td>${esc(t.name)}</td>
            <td>${esc(t.role)}</td>
            <td style="max-width:320px; word-break:break-all">${esc(t.image || "")}</td>
            <td>${esc(t.order ?? 0)}</td>
            <td>${t.active ? "Yes" : "No"}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${t._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${t._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Name", "Role", "Image", "Order", "Active", "Actions"], rows);
      return;
    }

    if (activeTab === "joinRequests") {
      const data = await api("/admin/api/join-requests");
      if (!data) return;
      const rows = data
        .map((r) => `
          <tr>
            <td><span class="pill">${esc(r.status || "new")}</span></td>
            <td>${esc(r.name)}</td>
            <td style="max-width:260px; word-break:break-all">${esc(r.email)}</td>
            <td>${esc(r.phone || "")}</td>
            <td>${esc(r.department || "")}</td>
            <td>${esc(r.yearOfStudy || "")}</td>
            <td>${esc(r.preferredDomain || "")}</td>
            <td>${esc(r.hoursPerWeek || "")}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${r._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${r._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Status", "Name", "Email", "Phone", "Dept", "Year", "Domain", "Hours/wk", "Actions"], rows);
      return;
    }

    if (activeTab === "members") {
      const data = await api("/admin/api/members");
      if (!data) return;
      const rows = data
        .map((m) => `
          <tr>
            <td>${esc(m.name)}</td>
            <td>${esc(m.role)}</td>
            <td>${esc(m.department)}</td>
            <td style="max-width:220px; word-break:break-all">${esc(m.image || "")}</td>
            <td style="max-width:220px; word-break:break-all">${esc(m.linkedin || "")}</td>
            <td style="max-width:220px; word-break:break-all">${esc(m.github || "")}</td>
            <td>${esc(m.order ?? 0)}</td>
            <td>${m.active ? "Yes" : "No"}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${m._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${m._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Name", "Role", "Department", "Image", "LinkedIn", "GitHub", "Order", "Active", "Actions"], rows);
      return;
    }

    if (activeTab === "announcements") {
      const data = await api("/admin/api/announcements");
      if (!data) return;
      const rows = data
        .map((a) => `
          <tr>
            <td>${esc(a.title)}</td>
            <td style="max-width:520px">${esc(a.description)}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${a._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${a._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Title", "Description", "Actions"], rows);
      return;
    }

    if (activeTab === "projects") {
      const data = await api("/admin/api/projects");
      if (!data) return;
      const rows = data
        .map((p) => `
          <tr>
            <td>${p.image ? `<img class="admin-thumb" src="${esc(p.image)}" alt="" loading="lazy" />` : ""}</td>
            <td>${esc(p.title || "")}</td>
            <td><span class="pill">${esc(p.status || "")}</span></td>
            <td style="max-width:260px; word-break:break-all">${esc(p.slug || "")}</td>
            <td>${esc(p.order ?? 0)}</td>
            <td>${p.active ? "Yes" : "No"}</td>
            <td>
              <div class="row-actions">
                <button class="admin-btn admin-btn--ghost" data-action="edit" data-id="${p._id}">Edit</button>
                <button class="admin-btn admin-btn--danger" data-action="delete" data-id="${p._id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join("");
      panelBody.innerHTML = renderTable(["Image", "Title", "Status", "Slug", "Order", "Active", "Actions"], rows);
      return;
    }

    if (activeTab === "homeSettings") {
      const data = await api("/admin/api/home-settings");
      if (!data) return;
      panelBody.innerHTML = `
        <div class="admin-card">
          <p class="pill">Home hero + About images</p>
          <form id="homeSettingsForm" class="dialog-fields" style="margin-top:12px">
            <label class="field" style="grid-column:1/-1">
              <span>Home hero image URL</span>
              <input name="heroImage" value="${esc(data.heroImage || "")}" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Upload home hero image (optional)</span>
              <input name="heroFile" type="file" accept="image/*" />
            </label>
            <label class="field">
              <span>Overlay opacity (0 to 1)</span>
              <input name="heroOverlayOpacity" type="number" min="0" max="1" step="0.05" value="${esc(String(data.heroOverlayOpacity ?? 0.6))}" />
            </label>

            <label class="field" style="grid-column:1/-1">
              <span>About image (main)</span>
              <input name="aboutImageMain" value="${esc(data.aboutImageMain || "")}" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Upload about image (main)</span>
              <input name="aboutMainFile" type="file" accept="image/*" />
            </label>

            <label class="field" style="grid-column:1/-1">
              <span>About image (small 1)</span>
              <input name="aboutImageOne" value="${esc(data.aboutImageOne || "")}" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Upload about image (small 1)</span>
              <input name="aboutOneFile" type="file" accept="image/*" />
            </label>

            <label class="field" style="grid-column:1/-1">
              <span>About image (small 2)</span>
              <input name="aboutImageTwo" value="${esc(data.aboutImageTwo || "")}" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Upload about image (small 2)</span>
              <input name="aboutTwoFile" type="file" accept="image/*" />
            </label>

            <div class="row-actions" style="grid-column:1/-1; justify-content:flex-start; gap:10px">
              <button class="admin-btn" type="submit">Save Home Settings</button>
            </div>
            <p id="homeSettingsMsg" class="pill" style="display:none; margin-top:10px"></p>
          </form>
        </div>
      `;

      const form = document.getElementById("homeSettingsForm");
      const msg = document.getElementById("homeSettingsMsg");
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const fd = new FormData(form);

          const payload = {
            heroImage: String(fd.get("heroImage") || ""),
            heroOverlayOpacity: Number(fd.get("heroOverlayOpacity") || 0.6),
            aboutImageMain: String(fd.get("aboutImageMain") || ""),
            aboutImageOne: String(fd.get("aboutImageOne") || ""),
            aboutImageTwo: String(fd.get("aboutImageTwo") || ""),
          };

          async function uploadOptional(name, targetKey) {
            const file = fd.get(name);
            if (file && file instanceof File && file.size > 0) {
              const up = await uploadFile(file);
              if (up && up.src) payload[targetKey] = up.src;
            }
          }

          await uploadOptional("heroFile", "heroImage");
          await uploadOptional("aboutMainFile", "aboutImageMain");
          await uploadOptional("aboutOneFile", "aboutImageOne");
          await uploadOptional("aboutTwoFile", "aboutImageTwo");

          const res = await api("/admin/api/home-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (msg) {
            msg.textContent = res && res.ok ? "Home settings updated." : (res?.message || "Could not save.");
            msg.style.display = "";
          }
        });
      }
      return;
    }

    if (activeTab === "settings") {
      const settings = await api("/admin/api/settings");
      if (!settings) return;
      panelBody.innerHTML = `
        <div class="admin-card">
          <p class="pill">Change admin username/password</p>
          <form id="settingsForm" class="dialog-fields" style="margin-top:12px">
            <label class="field">
              <span>Username</span>
              <input name="username" required value="${esc(settings.username || "")}" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>New password <span class="pill">leave blank to keep</span></span>
              <input name="password" type="password" placeholder="••••••••" />
            </label>
            <label class="field" style="grid-column:1/-1">
              <span>Confirm new password</span>
              <input name="passwordConfirm" type="password" placeholder="••••••••" />
            </label>
            <div class="row-actions" style="grid-column:1/-1; justify-content:flex-start; gap:10px">
              <button class="admin-btn" type="submit">Save settings</button>
            </div>
            <p id="settingsMsg" class="pill" style="display:none; margin-top:10px"></p>
          </form>
        </div>
      `;

      const form = document.getElementById("settingsForm");
      const msg = document.getElementById("settingsMsg");
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const username = String(fd.get("username") || "").trim();
          const password = String(fd.get("password") || "");
          const passwordConfirm = String(fd.get("passwordConfirm") || "");

          if (password && password !== passwordConfirm) {
            if (msg) {
              msg.textContent = "Passwords do not match.";
              msg.style.display = "";
            }
            return;
          }

          const payload = { username };
          if (password) payload.password = password;

          const res = await api("/admin/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (msg) {
            msg.textContent = res && res.ok ? "Saved. Use the new credentials next login." : (res?.message || "Could not save settings.");
            msg.style.display = "";
          }
        });
      }
      return;
    }
  }

  function fieldInput(label, name, value, opts) {
    const type = (opts && opts.type) || "text";
    const full = (opts && opts.full) || false;
    const hint = (opts && opts.hint) || "";
    const input =
      type === "textarea"
        ? `<textarea name="${esc(name)}">${esc(value || "")}</textarea>`
        : type === "select"
          ? `<select name="${esc(name)}">${(opts.options || [])
            .map((o) => `<option value="${esc(o.value)}" ${o.value === value ? "selected" : ""}>${esc(o.label)}</option>`)
            .join("")}</select>`
          : `<input name="${esc(name)}" type="${esc(type)}" value="${esc(value || "")}" />`;
    return `<label class="field" style="${full ? "grid-column:1/-1" : ""}">
      <span>${esc(label)} ${hint ? `<span class="pill">${esc(hint)}</span>` : ""}</span>
      ${input}
    </label>`;
  }

  function normalizeHref(label, href) {
    const raw = String(href || "").trim();
    if (!raw) return "";
    const l = String(label || "").toLowerCase();
    if (l === "email") {
      return raw.startsWith("mailto:") ? raw : "mailto:" + raw;
    }
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("mailto:")) return raw;
    // allow bare domains like arjith.vercel.app
    return "https://" + raw;
  }

  function repeatableSection(title, items, rowRenderer) {
    const rows = (items && items.length ? items : [null])
      .map((it, idx) => `<div class="rep-row" data-idx="${idx}">${rowRenderer(it || {}, idx)}</div>`)
      .join("");
    return `
      <section class="rep" style="grid-column:1/-1">
        <div class="rep-head">
          <p class="rep-title">${esc(title)}</p>
          <button type="button" class="admin-btn admin-btn--ghost rep-add" data-rep-add="${esc(title)}">+ Add</button>
        </div>
        <div class="rep-body" data-rep="${esc(title)}">${rows}</div>
      </section>
    `;
  }

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return null;
    }
    return await res.json();
  }

  function openEditor(mode, record) {
    editing = { mode, record: record || null };
    dialogHint.textContent = "";
    dialogFields.innerHTML = "";

    if (activeTab === "media") {
      dialogTitle.textContent = record ? "Edit media" : "Add media";
      dialogFields.innerHTML =
        fieldInput("Type", "type", record?.type || "image", {
          type: "select",
          options: [
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ],
        }) +
        `<label class="field" style="grid-column:1/-1">
          <span>Pick from /public/images (optional)</span>
          <select name="pickSrc" id="pickSrcSelect">
            <option value="">Loading…</option>
          </select>
        </label>` +
        `<label class="field" style="grid-column:1/-1">
          <span>Upload file (optional)</span>
          <input name="file" type="file" accept="image/*,video/*" />
        </label>` +
        fieldInput("Src", "src", record?.src || "", { full: true, hint: "or paste URL (/uploads/...)" }) +
        fieldInput("Title", "title", record?.title || "") +
        fieldInput("Alt", "alt", record?.alt || "") +
        fieldInput("Order", "order", record?.order ?? 0, { type: "number" }) +
        fieldInput("Active", "active", String(record?.active ?? true), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        });
      dialogHint.textContent = "Tip: Use “Pick from /public/images” to choose existing local photos for Moments/Gallery.";
    } else if (activeTab === "team") {
      dialogTitle.textContent = record ? "Edit team member" : "Add team member";
      dialogFields.innerHTML =
        fieldInput("Slug", "slug", record?.slug || "", { hint: "unique id (eg alex)" }) +
        fieldInput("Name", "name", record?.name || "") +
        fieldInput("Role", "role", record?.role || "") +
        `<label class="field" style="grid-column:1/-1">
          <span>Upload photo (optional)</span>
          <input name="file" type="file" accept="image/*" />
        </label>` +
        fieldInput("Image URL", "image", record?.image || "", { full: true, hint: "or paste /uploads/.." }) +
        fieldInput("Bio", "bio", record?.bio || "", { type: "textarea" }) +
        fieldInput("Meta (comma separated)", "meta", (record?.meta || []).join(", "), { full: true }) +
        repeatableSection("Projects", record?.projects || [], (p, idx) => `
          <label class="field">
            <span>Project name</span>
            <input name="project_name_${idx}" value="${esc(p.name || "")}" placeholder="Eg: Startup Launchpad v1" />
          </label>
          <label class="field" style="grid-column:1/-1">
            <span>Description</span>
            <textarea name="project_desc_${idx}" placeholder="What did they do?">${esc(p.desc || "")}</textarea>
          </label>
          <div class="rep-actions">
            <button type="button" class="admin-btn admin-btn--danger rep-remove" data-rep-remove="project" data-idx="${idx}">Remove</button>
          </div>
        `) +
        repeatableSection("Social links", record?.social || [], (s, idx) => `
          <label class="field">
            <span>Label</span>
            <select name="social_label_${idx}">
              ${["LinkedIn", "GitHub", "Portfolio", "Email", "Website", "Other"].map((lab) =>
                `<option value="${esc(lab)}" ${lab === (s.label || "") ? "selected" : ""}>${esc(lab)}</option>`
              ).join("")}
            </select>
          </label>
          <label class="field" style="grid-column:1/-1">
            <span>Link / Email</span>
            <input name="social_href_${idx}" value="${esc(s.href || "")}" placeholder="https://... or name@gmail.com" />
          </label>
          <div class="rep-actions">
            <button type="button" class="admin-btn admin-btn--danger rep-remove" data-rep-remove="social" data-idx="${idx}">Remove</button>
          </div>
        `) +
        fieldInput("Order", "order", record?.order ?? 0, { type: "number" }) +
        fieldInput("Active", "active", String(record?.active ?? true), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        });
      dialogHint.textContent = "Add projects and links using the + Add buttons (no JSON needed).";
    } else if (activeTab === "members") {
      dialogTitle.textContent = record ? "Edit member" : "Add member";
      dialogFields.innerHTML =
        fieldInput("Name", "name", record?.name || "") +
        fieldInput("Role", "role", record?.role || "") +
        fieldInput("Department", "department", record?.department || "") +
        `<label class="field" style="grid-column:1/-1">
          <span>Upload photo (optional)</span>
          <input name="file" type="file" accept="image/*" />
        </label>` +
        fieldInput("Image URL", "image", record?.image || "", { full: true, hint: "or paste /uploads/.." }) +
        fieldInput("Bio", "bio", record?.bio || "", { type: "textarea", full: true }) +
        fieldInput("LinkedIn", "linkedin", record?.linkedin || "", { full: true }) +
        fieldInput("GitHub", "github", record?.github || "", { full: true }) +
        fieldInput("Order", "order", record?.order ?? 0, { type: "number" }) +
        fieldInput("Active", "active", String(record?.active ?? true), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        });
    } else if (activeTab === "joinRequests") {
      dialogTitle.textContent = record ? "Edit join request" : "Join request";
      dialogFields.innerHTML =
        fieldInput("Name", "name", record?.name || "", { full: true }) +
        fieldInput("Email", "email", record?.email || "", { full: true }) +
        fieldInput("Phone", "phone", record?.phone || "") +
        fieldInput("Department", "department", record?.department || "") +
        fieldInput("Year of Study", "yearOfStudy", record?.yearOfStudy || "") +
        fieldInput("Register Number / ID", "registerNumber", record?.registerNumber || "") +
        fieldInput("Stream", "stream", record?.stream || "") +
        fieldInput("Preferred Domain", "preferredDomain", record?.preferredDomain || "") +
        fieldInput("Hours per week", "hoursPerWeek", record?.hoursPerWeek || "") +
        fieldInput("Skill Level", "skillLevel", record?.skillLevel || "", {
          type: "select",
          options: [
            { label: "—", value: "" },
            { label: "Beginner", value: "Beginner" },
            { label: "Intermediate", value: "Intermediate" },
            { label: "Advanced", value: "Advanced" },
          ],
        }) +
        fieldInput("Status", "status", record?.status || "new", {
          type: "select",
          options: [
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
          ],
        }) +
        fieldInput("Skills", "skills", record?.skills || "", { type: "textarea", full: true }) +
        fieldInput("Motivation", "motivation", record?.motivation || "", { type: "textarea", full: true }) +
        fieldInput("GitHub", "github", record?.github || "", { full: true }) +
        fieldInput("Portfolio / LinkedIn", "portfolio", record?.portfolio || "", { full: true }) +
        fieldInput("Commitment", "commitment", String(record?.commitment ?? false), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        }) +
        fieldInput("Message", "message", record?.message || "", { type: "textarea", full: true }) +
        fieldInput("Admin Notes", "adminNotes", record?.adminNotes || "", { type: "textarea", full: true });
    } else if (activeTab === "announcements") {
      dialogTitle.textContent = record ? "Edit announcement" : "Add announcement";
      dialogFields.innerHTML =
        fieldInput("Title", "title", record?.title || "", { full: true }) +
        fieldInput("Description", "description", record?.description || "", { type: "textarea" });
    } else if (activeTab === "projects") {
      dialogTitle.textContent = record ? "Edit project" : "Add project";
      dialogFields.innerHTML =
        fieldInput("Title", "title", record?.title || "", { full: true }) +
        fieldInput("Slug", "slug", record?.slug || "", { hint: "unique (eg smart-wayanad)" }) +
        fieldInput("Short description", "shortDescription", record?.shortDescription || "", { type: "textarea", full: true }) +
        `<label class="field" style="grid-column:1/-1">
          <span>Upload image (optional)</span>
          <input name="file" type="file" accept="image/*" />
        </label>` +
        fieldInput("Image URL", "image", record?.image || "", { full: true, hint: "or paste /uploads/.." }) +
        fieldInput("GitHub link", "github", record?.github || "", { full: true, hint: "https://github.com/..." }) +
        fieldInput("Problem", "problem", record?.problem || "", { type: "textarea", full: true }) +
        fieldInput("Solution", "solution", record?.solution || "", { type: "textarea", full: true }) +
        fieldInput("Languages (comma separated)", "languages", (record?.languages || []).join(", "), { full: true }) +
        fieldInput("Tags (comma separated)", "tags", (record?.tags || []).join(", "), { full: true }) +
        fieldInput("Status", "status", record?.status || "ongoing", {
          type: "select",
          options: [
            { label: "Ongoing", value: "ongoing" },
            { label: "Completed", value: "completed" },
            { label: "Sold", value: "sold" },
            { label: "Paused", value: "paused" },
          ],
        }) +
        fieldInput("Order", "order", record?.order ?? 0, { type: "number" }) +
        fieldInput("Active", "active", String(record?.active ?? true), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        });
    }

    dialog.showModal();

    // Populate image library picker for Media editor
    if (activeTab === "media") {
      const select = dialog.querySelector("#pickSrcSelect");
      const srcInput = dialog.querySelector('input[name="src"]');
      if (select && srcInput) {
        getImageLibrary()
          .then((list) => {
            const opts = ['<option value="">Select an existing file…</option>']
              .concat((list || []).map((p) => `<option value="${esc(p)}">${esc(p)}</option>`));
            select.innerHTML = opts.join("");
            select.value = "";
          })
          .catch(() => {
            select.innerHTML = `<option value="">(Could not load image library)</option>`;
          });

        select.addEventListener("change", () => {
          const v = select.value || "";
          if (!v) return;
          srcInput.value = v;
        });
      }
    }
  }

  async function onSave(e) {
    e.preventDefault();
    const fd = new FormData(editorForm);
    const obj = {};
    fd.forEach((v, k) => {
      if (k === "file") return;
      if (k === "pickSrc") return;
      obj[k] = String(v);
    });

    // type conversions
    if (obj.order != null) obj.order = Number(obj.order);
    if (obj.active != null) obj.active = obj.active === "true";
    if (obj.commitment != null) obj.commitment = obj.commitment === "true";

    if (activeTab === "projects") {
      obj.languages = (obj.languages || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      obj.tags = (obj.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (activeTab === "team") {
      obj.meta = (obj.meta || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Collect repeatable projects/social rows
      const projects = [];
      const socials = [];
      Object.keys(obj).forEach((k) => {
        const pm = k.match(/^project_name_(\d+)$/);
        if (pm) {
          const i = pm[1];
          const name = String(obj["project_name_" + i] || "").trim();
          const desc = String(obj["project_desc_" + i] || "").trim();
          if (name || desc) projects.push({ name, desc });
        }
        const sm = k.match(/^social_label_(\d+)$/);
        if (sm) {
          const i = sm[1];
          const label = String(obj["social_label_" + i] || "").trim();
          const hrefRaw = String(obj["social_href_" + i] || "").trim();
          const href = normalizeHref(label, hrefRaw);
          if (label && href) socials.push({ label, href });
        }
      });
      obj.projects = projects;
      obj.social = socials;

      // Remove temp fields so backend doesn't store them
      Object.keys(obj).forEach((k) => {
        if (/^project_(name|desc)_\d+$/.test(k)) delete obj[k];
        if (/^social_(label|href)_\d+$/.test(k)) delete obj[k];
      });
    }

    const file = fd.get("file");
    if (file && file instanceof File && file.size > 0) {
      const up = await uploadFile(file);
      if (up && up.src) {
        if (activeTab === "media") obj.src = up.src;
        if (activeTab === "team") obj.image = up.src;
        if (activeTab === "members") obj.image = up.src;
        if (activeTab === "projects") obj.image = up.src;
      }
    }

    const isEdit = Boolean(editing && editing.record && editing.record._id);
    const base =
      activeTab === "media" ? "/admin/api/media" :
        activeTab === "team" ? "/admin/api/team" :
          activeTab === "joinRequests" ? "/admin/api/join-requests" :
            activeTab === "members" ? "/admin/api/members" :
              activeTab === "announcements" ? "/admin/api/announcements" :
                "/admin/api/projects";

    const url = isEdit ? base + "/" + editing.record._id : base;
    const method = isEdit ? "PUT" : "POST";

    await api(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    dialog.close();
    loadTab();
  }

  async function onDelete(id) {
    if (!confirm("Delete this item?")) return;
    const base =
      activeTab === "media" ? "/admin/api/media" :
        activeTab === "team" ? "/admin/api/team" :
          activeTab === "joinRequests" ? "/admin/api/join-requests" :
            activeTab === "members" ? "/admin/api/members" :
              activeTab === "announcements" ? "/admin/api/announcements" :
                "/admin/api/projects";
    await api(base + "/" + id, { method: "DELETE" });
    loadTab();
  }

  // Events
  navItems.forEach((b) => b.addEventListener("click", () => setActive(b.dataset.tab)));
  addBtn.addEventListener("click", () => openEditor("create", null));
  logoutBtn.addEventListener("click", logout);

  panelBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!id) return;

    if (action === "delete") {
      onDelete(id);
      return;
    }

    if (action === "edit") {
      const base =
        activeTab === "media" ? "/admin/api/media" :
          activeTab === "team" ? "/admin/api/team" :
            activeTab === "joinRequests" ? "/admin/api/join-requests" :
              activeTab === "members" ? "/admin/api/members" :
                activeTab === "announcements" ? "/admin/api/announcements" :
                  "/admin/api/projects";
      const list = await api(base);
      const rec = (list || []).find((x) => x._id === id);
      openEditor("edit", rec);
    }
  });

  // Repeatable controls (Team projects/social)
  dialogFields.addEventListener("click", (e) => {
    const add = e.target.closest("button[data-rep-add]");
    if (add && activeTab === "team") {
      const title = add.getAttribute("data-rep-add");
      const body = dialogFields.querySelector(`.rep-body[data-rep="${title}"]`);
      if (!body) return;

      const isProjects = title === "Projects";
      const isSocial = title === "Social links";
      const idx = body.querySelectorAll(".rep-row").length;
      const row = document.createElement("div");
      row.className = "rep-row";
      row.setAttribute("data-idx", String(idx));
      row.innerHTML = isProjects
        ? `
          <label class="field">
            <span>Project name</span>
            <input name="project_name_${idx}" placeholder="Eg: Startup Launchpad v1" />
          </label>
          <label class="field" style="grid-column:1/-1">
            <span>Description</span>
            <textarea name="project_desc_${idx}" placeholder="What did they do?"></textarea>
          </label>
          <div class="rep-actions">
            <button type="button" class="admin-btn admin-btn--danger rep-remove" data-rep-remove="project" data-idx="${idx}">Remove</button>
          </div>
        `
        : isSocial
          ? `
          <label class="field">
            <span>Label</span>
            <select name="social_label_${idx}">
              ${["LinkedIn", "GitHub", "Portfolio", "Email", "Website", "Other"].map((lab) => `<option value="${esc(lab)}">${esc(lab)}</option>`).join("")}
            </select>
          </label>
          <label class="field" style="grid-column:1/-1">
            <span>Link / Email</span>
            <input name="social_href_${idx}" placeholder="https://... or name@gmail.com" />
          </label>
          <div class="rep-actions">
            <button type="button" class="admin-btn admin-btn--danger rep-remove" data-rep-remove="social" data-idx="${idx}">Remove</button>
          </div>
        `
          : "";
      body.appendChild(row);
      return;
    }

    const rem = e.target.closest("button[data-rep-remove]");
    if (rem && activeTab === "team") {
      const row = rem.closest(".rep-row");
      if (row) row.remove();
    }
  });

  editorForm.addEventListener("submit", onSave);
  cancelBtn.addEventListener("click", () => dialog.close());

  // Init
  setActive("media");
})();

