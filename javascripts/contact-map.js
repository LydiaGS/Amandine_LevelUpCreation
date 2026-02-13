/* contact-map.js — Level Up Creation (Google Maps)
   - Anti double load (évite "redeclaration of const")
   - Style dark
   - Pin rose + logo au centre (fallback si logo introuvable)
*/

if (window.__LUC_MAP_LOADED__) {
  console.warn("[maps] contact-map.js déjà chargé");
} else {
  window.__LUC_MAP_LOADED__ = true;

  // Coordonnées Rdpt Robert Schuman 6, 1040 Bruxelles
  const LUC_POS = { lat: 50.8419009, lng: 4.3838207 };

  // ✅ Si ton fichier a des espaces, garde encodeURI
  // Sinon renomme le fichier sans espaces (recommandé).
  const LOGO_PATH = encodeURI("./asset/image/LOGO LVLUP_Framboise 1.png");
  // Exemple sans espaces (si tu renommes):
  // const LOGO_PATH = "./asset/image/LOGO_LVLUP_Framboise_1.png";

  const LEVELUP_STYLE = [
    { elementType: "geometry", stylers: [{ color: "#0b0b0d" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#c7c7cc" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9a9aa1" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1f" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2a2a31" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2f2f33" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#070708" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#131318" }] }
  ];

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Logo introuvable : " + src));
      img.src = src;
    });
  }

  // Pin rose “goutte” + logo rond => retourne une dataURL PNG
  async function makePinIcon(logoSrc) {
    const size = 112;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    const img = await loadImage(logoSrc);

    // === Pin ===
    ctx.save();
    ctx.translate(size / 2, size / 2);

    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;

    ctx.beginPath();
    ctx.arc(0, -14, 30, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.quadraticCurveTo(30, 18, 0, 46);
    ctx.quadraticCurveTo(-30, 18, -30, -14);
    ctx.closePath();

    ctx.fillStyle = "#df437c";
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.stroke();

    ctx.restore();

    // === Cercle logo ===
    const cx = size / 2;
    const cy = size / 2 - 22;
    const r = 24;

    // Fond cercle clair
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#f2f2f4";
    ctx.fill();

    // Clip cercle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Logo centré
    const scale = Math.min((r * 2) / img.width, (r * 2) / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);

    ctx.restore();

    // Glow rose
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(223,67,124,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    return canvas.toDataURL("image/png");
  }

  // ⚠️ IMPORTANT : cette fonction doit être globale (callback Google)
  window.initMap = async function initMap() {
    const el = document.getElementById("gmap");
    if (!el) {
      console.error("[maps] #gmap introuvable. Ajoute <div id='gmap'></div> dans le HTML.");
      return;
    }

    // Crée la map
    const map = new google.maps.Map(el, {
      center: LUC_POS,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      gestureHandling: "cooperative",
      styles: LEVELUP_STYLE
    });

    // Pin custom
    let pinUrl = null;
    try {
      pinUrl = await makePinIcon(LOGO_PATH);
    } catch (e) {
      console.warn("[maps] pin custom impossible, fallback logo simple.", e);
      pinUrl = LOGO_PATH; // fallback (logo seul)
    }

    const marker = new google.maps.Marker({
      position: LUC_POS,
      map,
      title: "Level Up Creation — Rdpt Robert Schuman 6, 1040 Bruxelles",
      icon: pinUrl
        ? {
            url: pinUrl,
            scaledSize: new google.maps.Size(60, 60),
            anchor: new google.maps.Point(30, 56)
          }
        : undefined
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="font-family:Inter,system-ui; padding:6px 8px; max-width:240px;">
          <div style="font-weight:900; color:#df437c; margin-bottom:4px;">Level Up Creation</div>
          <div style="font-size:13px; opacity:.85; margin-bottom:6px;">
            Rdpt Robert Schuman 6, 1040 Bruxelles
          </div>
          <a target="_blank" rel="noopener"
             href="https://www.google.com/maps/dir/?api=1&destination=Rdpt+Robert+Schuman+6,+1040+Bruxelles"
             style="color:#df437c; font-weight:800; text-decoration:none;">
            Obtenir l’itinéraire
          </a>
        </div>
      `
    });

    marker.addListener("click", () => info.open({ anchor: marker, map }));

    console.log("[maps] ✅ Map initialisée");
  };
}
console.log("INITMAP RUN", document.getElementById("gmap"));
