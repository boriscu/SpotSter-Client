import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { publicApi } from "@/api/client";
import type { PublicStore, TagFilter } from "@/types";
import { TAG_LABELS } from "@/types";
import StoreDetailModal from "./StoreDetailModal";

function buildMarkerIcon(store: PublicStore): L.DivIcon {
  const monsters = store.available_monsters || [];
  const thumbs = monsters.slice(0, 3);
  const extra = monsters.length - 3;

  const thumbsHtml = thumbs
    .map(
      (m) =>
        m.image_url
          ? `<img src="${m.image_url}" style="width:22px;height:32px;object-fit:contain;border-radius:3px;" />`
          : `<div style="width:22px;height:32px;background:#2a2a2a;border-radius:3px;"></div>`
    )
    .join("");

  const extraBadge =
    extra > 0
      ? `<div style="width:22px;height:32px;background:#1a1f1a;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#00FF41;font-family:Oswald,sans-serif;">+${extra}</div>`
      : "";

  const hasMonsters = monsters.length > 0;

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
      ${
        hasMonsters
          ? `<div style="display:flex;gap:2px;padding:4px 5px;background:#141414;border:1px solid #2a2a2a;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              ${thumbsHtml}${extraBadge}
            </div>`
          : ""
      }
      <svg width="24" height="34" viewBox="0 0 28 40" style="margin-top:${hasMonsters ? "-2" : "0"}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="#00FF41"/>
        <circle cx="14" cy="14" r="6" fill="#0a0a0a"/>
        ${hasMonsters ? `<text x="14" y="17" text-anchor="middle" fill="#00FF41" font-size="10" font-family="Oswald,sans-serif" font-weight="700">${monsters.length}</text>` : ""}
      </svg>
    </div>
  `;

  const iconWidth = hasMonsters ? Math.max(36, thumbs.length * 24 + (extra > 0 ? 24 : 0) + 10) : 24;
  const iconHeight = hasMonsters ? 76 : 34;

  return L.divIcon({
    html,
    className: "spotster-marker",
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight],
  });
}

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [stores, setStores] = useState<PublicStore[]>([]);
  const [tags, setTags] = useState<TagFilter[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    publicApi.filters().then((r) => setTags(r.tags)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [44.8125, 20.4612],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    const fetchStores = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      publicApi
        .stores({
          sw_lat: bounds.getSouthWest().lat,
          sw_lng: bounds.getSouthWest().lng,
          ne_lat: bounds.getNorthEast().lat,
          ne_lng: bounds.getNorthEast().lng,
          lat: center.lat,
          lng: center.lng,
          limit: 100,
        })
        .then(setStores)
        .catch(() => {});
    };

    map.on("moveend", fetchStores);
    fetchStores();

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();

    const filtered = stores.filter((store) => {
      if (search) {
        const q = search.toLowerCase();
        if (!store.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    filtered.forEach((store) => {
      const marker = L.marker([store.latitude, store.longitude], {
        icon: buildMarkerIcon(store),
      });

      marker.on("click", () => {
        setSelectedStoreId(store.id);
      });

      const monsters = store.available_monsters || [];
      const tooltip = monsters.length
        ? `${store.name} · ${monsters.length} flavor${monsters.length !== 1 ? "s" : ""}`
        : store.name;

      marker.bindTooltip(tooltip, {
        className: "spotster-tooltip",
        direction: "top",
        offset: [0, -8],
      });

      marker.addTo(markersLayer.current!);
    });
  }, [stores, search]);

  const toggleTag = (tag: number) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    if (!mapInstance.current) return;
    const bounds = mapInstance.current.getBounds();
    const center = mapInstance.current.getCenter();
    const params: Record<string, string | number> = {
      sw_lat: bounds.getSouthWest().lat,
      sw_lng: bounds.getSouthWest().lng,
      ne_lat: bounds.getNorthEast().lat,
      ne_lng: bounds.getNorthEast().lng,
      lat: center.lat,
      lng: center.lng,
      limit: 100,
    };
    if (selectedTags.length) params.tags = selectedTags.join(",");
    if (search) params.search = search;
    publicApi.stores(params).then(setStores).catch(() => {});
  }, [selectedTags, search]);

  return (
    <section id="map" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-10">
          Explore <span className="text-spot-green">Nearby</span>
        </h2>

        <div className="mb-4 flex flex-wrap gap-3 items-center justify-center">
          <input
            type="text"
            placeholder="Search stores or flavors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-spot-card border border-spot-border rounded-full px-5 py-2 text-sm font-body text-white placeholder-spot-muted focus:outline-none focus:border-spot-green/50 w-64"
          />

          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => toggleTag(tag.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-heading font-medium border transition-colors ${
                selectedTags.includes(tag.value)
                  ? "bg-spot-green text-spot-dark border-spot-green"
                  : "border-spot-border text-gray-300 hover:border-spot-green/40"
              }`}
            >
              {TAG_LABELS[tag.value] || tag.label}
            </button>
          ))}
        </div>

        <div
          ref={mapRef}
          className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-spot-border"
        />
      </div>

      {selectedStoreId !== null && (
        <StoreDetailModal
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
        />
      )}

      <style>{`
        .spotster-marker {
          background: none !important;
          border: none !important;
        }
        .spotster-tooltip {
          background: #141414 !important;
          color: #fff !important;
          border: 1px solid #2a2a2a !important;
          border-radius: 8px !important;
          font-family: Inter, sans-serif !important;
          font-size: 12px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .spotster-tooltip::before {
          border-top-color: #2a2a2a !important;
        }
      `}</style>
    </section>
  );
}
