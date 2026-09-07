(function () {
  const root = document.documentElement;
  const base = root.dataset.base || ".";
  const config = window.SPRAI_CONFIG || {};

  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-repository-link]").forEach((link) => {
    if (config.repository) {
      link.href = config.repository;
      link.hidden = false;
    }
  });

  document.querySelectorAll("[data-contribute-link]").forEach((link) => {
    if (config.repository) {
      link.href = `${config.repository}/issues/new?template=add-resource.yml`;
      link.hidden = false;
    }
  });

  if (config.repository) {
    document.querySelectorAll("[data-repository-pending]").forEach((node) => { node.hidden = true; });
  }

  const grid = document.querySelector("[data-resource-grid]");
  if (!grid) return;

  const featuredOnly = grid.dataset.featured === "true";
  const searchInput = document.querySelector("[data-search]");
  const typeSelect = document.querySelector("[data-type]");
  const flowSelect = document.querySelector("[data-flow]");
  const methodSelect = document.querySelector("[data-method]");
  const resetButton = document.querySelector("[data-reset]");
  const resultCount = document.querySelector("[data-result-count]");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function uniqueValues(resources, field) {
    return [...new Set(resources.flatMap((resource) => resource[field] || []))].sort();
  }

  function populateSelect(select, values) {
    if (!select) return;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function resourceCard(resource) {
    const types = resource.types.map((type) => `<span class="tag">${escapeHtml(type)}</span>`).join("");
    const preparation = resource.status !== "Available" ? " preparation" : "";
    const action = resource.url
      ? `<a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener">Open resource <span aria-hidden="true">↗</span></a>`
      : `<span>Release link forthcoming</span>`;

    return `
      <article class="resource-card">
        <div class="resource-top">
          <div class="tags">${types}</div>
          <span class="status${preparation}">${escapeHtml(resource.status)}</span>
        </div>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.summary)}</p>
        <div class="resource-meta">
          <strong>${escapeHtml(resource.provider)}</strong><br>
          ${escapeHtml(resource.flows.join(" · "))}
        </div>
        <!-- 
        <div class="resource-meta">
          <strong>${"Authors"}</strong>:
          ${escapeHtml(resource.authors)}
        </div>
        -->
        <div class="resource-actions">
          ${action}
          <span>${escapeHtml(resource.access)}</span>
        </div>
      </article>`;
  }

  function render(resources) {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const selectedType = typeSelect?.value || "";
    const selectedFlow = flowSelect?.value || "";
    const selectedMethod = methodSelect?.value || "";

    let matches = resources.filter((resource) => {
      const searchable = [resource.title, resource.summary, resource.provider, ...resource.types, ...resource.flows, ...resource.methods, ...resource.outputs].join(" ").toLowerCase();
      return (!query || searchable.includes(query))
        && (!selectedType || resource.types.includes(selectedType))
        && (!selectedFlow || resource.flows.includes(selectedFlow))
        && (!selectedMethod || resource.methods.includes(selectedMethod));
    });

    if (featuredOnly) matches = matches.filter((resource) => resource.featured).slice(0, 4);

    if (resultCount) resultCount.textContent = `${matches.length} ${matches.length === 1 ? "resource" : "resources"}`;
    grid.innerHTML = matches.length
      ? matches.map(resourceCard).join("")
      : `<div class="empty-state"><h3>No matching resources</h3><p>Try a broader term or clear the filters.</p></div>`;
  }

  fetch(`${base}/assets/resources.json`)
    .then((response) => {
      if (!response.ok) throw new Error("Resource catalogue could not be loaded.");
      return response.json();
    })
    .then((resources) => {
      populateSelect(typeSelect, uniqueValues(resources, "types"));
      populateSelect(flowSelect, uniqueValues(resources, "flows"));
      populateSelect(methodSelect, uniqueValues(resources, "methods"));

      const typeCount = new Set(resources.flatMap((resource) => resource.types)).size;
      document.querySelectorAll("[data-total-resources]").forEach((node) => { node.textContent = String(resources.length); });
      document.querySelectorAll("[data-total-types]").forEach((node) => { node.textContent = String(typeCount); });
      document.querySelectorAll("[data-total-providers]").forEach((node) => {
        node.textContent = String(new Set(resources.map((resource) => resource.provider)).size);
      });
      document.querySelectorAll("[data-open-resources]").forEach((node) => {
        node.textContent = String(resources.filter((resource) => resource.access === "Open").length);
      });

      [searchInput, typeSelect, flowSelect, methodSelect].forEach((control) => control?.addEventListener("input", () => render(resources)));
      resetButton?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (typeSelect) typeSelect.value = "";
        if (flowSelect) flowSelect.value = "";
        if (methodSelect) methodSelect.value = "";
        render(resources);
      });

      const params = new URLSearchParams(window.location.search);
      if (typeSelect && params.get("type")) typeSelect.value = params.get("type");
      if (searchInput && params.get("q")) searchInput.value = params.get("q");
      render(resources);
    })
    .catch((error) => {
      grid.innerHTML = `<div class="empty-state"><h3>Catalogue unavailable</h3><p>${escapeHtml(error.message)}</p></div>`;
    });
})();
