const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const scrollTargetKey = "ecotech-scroll-target";
const mobileMenuBreakpoint = window.matchMedia("(max-width: 920px)");

function updateHeaderOffset() {
  if (!siteHeader) {
    return 116;
  }

  const headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-offset", headerHeight + "px");
  return headerHeight;
}

function resolveScrollTarget(hash) {
  const target = document.querySelector(hash);

  if (!target) {
    return null;
  }

  if (target.classList.contains("section-anchor")) {
    const heading = target.parentElement ? target.parentElement.querySelector(".section-heading") : null;
    return heading || target.parentElement || target;
  }

  return target;
}

function scrollToSection(hash, replaceState = false, behavior = "smooth") {
  if (!hash) {
    return;
  }

  const target = resolveScrollTarget(hash);

  if (!target) {
    return;
  }

  const headerHeight = updateHeaderOffset();
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerHeight - 16);

  window.scrollTo({
    top,
    behavior
  });

  if (replaceState) {
    history.replaceState(null, "", hash);
  }
}

function setMenuState(isOpen) {
  if (!topbar || !menuToggle) {
    return;
  }

  topbar.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu principal" : "Abrir menu principal");
  document.body.classList.toggle("menu-open", isOpen && mobileMenuBreakpoint.matches);
}

function closeMenu() {
  setMenuState(false);
}

function initMenu() {
  updateHeaderOffset();

  if (!topbar || !menuToggle) {
    return;
  }

  setMenuState(false);

  menuToggle.addEventListener("click", () => {
    setMenuState(!topbar.classList.contains("is-open"));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);

      if (url.pathname === window.location.pathname && url.hash) {
        event.preventDefault();
        closeMenu();
        scrollToSection(url.hash, true);
        return;
      }

      if (url.hash) {
        event.preventDefault();
        closeMenu();
        sessionStorage.setItem(scrollTargetKey, url.hash);
        window.location.href = url.href.split("#")[0];
        return;
      }

      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenuBreakpoint.matches || !topbar.classList.contains("is-open")) {
      return;
    }

    if (topbar.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !topbar.classList.contains("is-open")) {
      return;
    }

    closeMenu();
    menuToggle.focus();
  });

  const handleBreakpointChange = (event) => {
    if (!event.matches) {
      closeMenu();
    }
  };

  if (typeof mobileMenuBreakpoint.addEventListener === "function") {
    mobileMenuBreakpoint.addEventListener("change", handleBreakpointChange);
  } else {
    mobileMenuBreakpoint.addListener(handleBreakpointChange);
  }
}

function initTopicTransitions() {
  if (!document.documentElement.classList.contains("js")) {
    return;
  }

  window.requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
}

function markActivePage() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll(".nav-links a");
  let activeLink = null;

  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    const url = new URL(link.href, window.location.href);
    const targetPath = url.pathname.split("/").pop() || "index.html";

    if (targetPath === currentPath && url.hash && url.hash === currentHash) {
      activeLink = link;
    }
  });

  if (!activeLink) {
    navLinks.forEach((link) => {
      const url = new URL(link.href, window.location.href);
      const targetPath = url.pathname.split("/").pop() || "index.html";

      if (!activeLink && targetPath === currentPath) {
        activeLink = link;
      }
    });
  }

  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setMapFallback(message) {
  const mapElement = document.getElementById("ecopontos-map");

  if (!mapElement) {
    return;
  }

  mapElement.innerHTML = `<p class="map-fallback">${escapeHtml(message)}</p>`;
}

function sanitizeEcopointsData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((point) => {
    return point &&
      typeof point.name === "string" &&
      typeof point.address === "string" &&
      typeof point.materials === "string" &&
      typeof point.hours === "string" &&
      typeof point.mapsUrl === "string" &&
      Number.isFinite(point.lat) &&
      Number.isFinite(point.lon);
  });
}

function getEmbeddedEcopointsData() {
  const script = document.getElementById("ecopoints-data");

  if (!script) {
    return [];
  }

  try {
    return sanitizeEcopointsData(JSON.parse(script.textContent || "[]"));
  } catch {
    return [];
  }
}

function normalizePoints(points) {
  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lon);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const latRange = Math.max(maxLat - minLat, 0.0001);
  const lonRange = Math.max(maxLon - minLon, 0.0001);
  const padding = 12;

  return points.map((point, index) => {
    const x = padding + ((point.lon - minLon) / lonRange) * (100 - padding * 2);
    const y = padding + ((maxLat - point.lat) / latRange) * (100 - padding * 2);
    const shiftOptions = ["-20px", "-6px", "14px", "-14px", "18px", "2px"];
    const isLeft = x > 58;

    return {
      ...point,
      markerX: `${x.toFixed(2)}%`,
      markerY: `${y.toFixed(2)}%`,
      labelClass: isLeft ? "label-left" : "label-right",
      shiftY: shiftOptions[index % shiftOptions.length],
      shortAddress: point.address.replace(/^Cruzamento entre /i, "")
    };
  });
}

function renderSchematicMap(points) {
  const mapElement = document.getElementById("ecopontos-map");

  if (!mapElement) {
    return;
  }

  const normalizedPoints = normalizePoints(points);
  const markersMarkup = normalizedPoints.map((point, index) => {
    return `
      <a
        class="map-marker ${point.labelClass}"
        href="${escapeHtml(point.mapsUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        style="--x:${point.markerX}; --y:${point.markerY}; --shift-y:${point.shiftY};"
        aria-label="${escapeHtml(point.name)}. Abrir localização no mapa."
      >
        <span class="marker-dot" aria-hidden="true"></span>
        <span class="marker-label">
          <strong>${index + 1}. ${escapeHtml(point.name)}</strong>
          <span>${escapeHtml(point.shortAddress)}</span>
        </span>
      </a>
    `;
  }).join("");

  mapElement.innerHTML = `
    <div class="schematic-map">
      <div class="schematic-map-canvas" role="img" aria-label="Mapa esquemático com a posição relativa dos ecopontos de Araçatuba">
        ${markersMarkup}
      </div>
      <p class="map-caption">Mapa esquemático baseado nas coordenadas dos ecopontos. Use os marcadores ou os cartões ao lado para abrir a localização completa.</p>
    </div>
  `;
}

async function loadEcopointsData() {
  const embeddedData = getEmbeddedEcopointsData();

  if (embeddedData.length) {
    return embeddedData;
  }

  const response = await fetch("data/ecopontos-aracatuba.json", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar ecopontos: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Formato inválido dos ecopontos.");
  }

  return sanitizeEcopointsData(data);
}

function initEcopointsPage() {
  const mapElement = document.getElementById("ecopontos-map");

  if (!mapElement) {
    return;
  }

  loadEcopointsData()
    .then((ecopoints) => {
      if (!ecopoints.length) {
        setMapFallback("Não foi possível carregar os dados dos ecopontos agora.");
        return;
      }

      renderSchematicMap(ecopoints);
    })
    .catch(() => {
      setMapFallback("Não foi possível carregar o mapa agora. Os cartões com endereços continuam disponíveis nesta página.");
    });
}

function syncInitialHashPosition() {
  const storedHash = sessionStorage.getItem(scrollTargetKey);
  const pendingHash = storedHash || window.location.hash;

  if (!pendingHash) {
    return;
  }

  if (storedHash) {
    sessionStorage.removeItem(scrollTargetKey);
  }

  const alignHash = () => {
    scrollToSection(pendingHash, Boolean(storedHash), "auto");
  };

  if (storedHash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(alignHash);
  });
  window.addEventListener("load", alignHash, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignHash);
  }
}

initMenu();
initTopicTransitions();
markActivePage();
initEcopointsPage();
syncInitialHashPosition();

window.addEventListener("resize", () => {
  updateHeaderOffset();

  if (!mobileMenuBreakpoint.matches) {
    closeMenu();
  }
});

window.addEventListener("hashchange", () => {
  if (window.location.hash) {
    scrollToSection(window.location.hash, false, "auto");
  }
});
