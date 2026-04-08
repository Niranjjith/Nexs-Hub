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
            tab === "members" ? "Members" : "Announcements";

    addBtn.style.display = tab === "joinRequests" ? "none" : "";
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
      panelBody.innerHTML = renderTable(["Type", "Src", "Title", "Order", "Active", "Actions"], rows);
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
        fieldInput("Projects (JSON array)", "projects", JSON.stringify(record?.projects || [], null, 2), { type: "textarea" }) +
        fieldInput("Social links (JSON array)", "social", JSON.stringify(record?.social || [], null, 2), { type: "textarea" }) +
        fieldInput("Order", "order", record?.order ?? 0, { type: "number" }) +
        fieldInput("Active", "active", String(record?.active ?? true), {
          type: "select",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        });
      dialogHint.textContent =
        'Projects JSON example: [{ "name": "AI Security Lab", "desc": "Mentored pipeline" }]. Social JSON example: [{ "label": "LinkedIn", "href": "https://..." }].';
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
    }

    dialog.showModal();
  }

  async function onSave(e) {
    e.preventDefault();
    const fd = new FormData(editorForm);
    const obj = {};
    fd.forEach((v, k) => {
      if (k === "file") return;
      obj[k] = String(v);
    });

    // type conversions
    if (obj.order != null) obj.order = Number(obj.order);
    if (obj.active != null) obj.active = obj.active === "true";
    if (obj.commitment != null) obj.commitment = obj.commitment === "true";

    if (activeTab === "team") {
      obj.meta = (obj.meta || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      try {
        obj.projects = JSON.parse(obj.projects || "[]");
      } catch {
        alert("Projects JSON is invalid.");
        return;
      }
      try {
        obj.social = JSON.parse(obj.social || "[]");
      } catch {
        alert("Social JSON is invalid.");
        return;
      }
    }

    const file = fd.get("file");
    if (file && file instanceof File && file.size > 0) {
      const up = await uploadFile(file);
      if (up && up.src) {
        if (activeTab === "media") obj.src = up.src;
        if (activeTab === "team") obj.image = up.src;
        if (activeTab === "members") obj.image = up.src;
      }
    }

    const isEdit = Boolean(editing && editing.record && editing.record._id);
    const base =
      activeTab === "media" ? "/admin/api/media" :
        activeTab === "team" ? "/admin/api/team" :
          activeTab === "joinRequests" ? "/admin/api/join-requests" :
            activeTab === "members" ? "/admin/api/members" :
              "/admin/api/announcements";

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
              "/admin/api/announcements";
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
                "/admin/api/announcements";
      const list = await api(base);
      const rec = (list || []).find((x) => x._id === id);
      openEditor("edit", rec);
    }
  });

  editorForm.addEventListener("submit", onSave);
  cancelBtn.addEventListener("click", () => dialog.close());

  // Init
  setActive("media");
})();

