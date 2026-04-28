import { useEffect, useState } from "react";
import { publicApi } from "@/api/client";
import { TAG_LABELS } from "@/types";
import type { StoreDetail } from "@/types";

export default function StoreDetailModal({
  storeId,
  onClose,
}: {
  storeId: number;
  onClose: () => void;
}) {
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .storeDetail(storeId)
      .then(setStore)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [storeId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") lightbox ? setLightbox(null) : onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, lightbox]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-spot-card border border-spot-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-spot-green font-heading animate-pulse">
              Loading...
            </div>
          </div>
        ) : !store ? (
          <div className="p-6 text-center text-spot-muted font-body">
            Store not found
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-spot-card/95 backdrop-blur-sm border-b border-spot-border p-5 flex items-start justify-between z-10">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  {store.name}
                </h2>
                {store.address && (
                  <p className="text-spot-muted text-sm font-body mt-1">
                    {store.address}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-spot-muted hover:text-white transition-colors ml-4 mt-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="px-5 py-4 flex gap-4">
              <div className="flex-1 bg-spot-surface rounded-xl p-3 text-center">
                <div className="font-heading text-2xl font-bold text-spot-green">
                  {store.flavour_count || 0}
                </div>
                <div className="text-spot-muted text-xs font-body mt-0.5">
                  Flavors
                </div>
              </div>
              <div className="flex-1 bg-spot-surface rounded-xl p-3 text-center">
                <div className="font-heading text-2xl font-bold text-spot-green">
                  {store.total_spottings || 0}
                </div>
                <div className="text-spot-muted text-xs font-body mt-0.5">
                  Spottings
                </div>
              </div>
            </div>

            {/* Available Monsters */}
            {store.available_monsters && store.available_monsters.length > 0 && (
              <div className="px-5 pb-4">
                <h3 className="font-heading text-sm font-bold text-spot-muted uppercase tracking-wider mb-3">
                  Available Monsters
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {store.available_monsters.map((m) => (
                    <div
                      key={m.id}
                      className="bg-spot-surface rounded-xl p-3 flex items-center gap-3"
                    >
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.flavour}
                          className="w-8 h-12 object-contain flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-12 bg-spot-border rounded flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium truncate">
                          {m.flavour}
                        </p>
                        {m.tag && (
                          <span className="text-xs text-spot-green font-body">
                            {TAG_LABELS[m.tag]}
                          </span>
                        )}
                        {m.last_spotted_at && (
                          <p className="text-xs text-spot-muted font-body mt-0.5">
                            {formatTimeAgo(m.last_spotted_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Spottings */}
            {store.recent_spottings && store.recent_spottings.length > 0 && (
              <div className="px-5 pb-5">
                <h3 className="font-heading text-sm font-bold text-spot-muted uppercase tracking-wider mb-3">
                  Recent Spottings
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {store.recent_spottings.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setLightbox(s.image_url)}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-spot-surface"
                    >
                      <img
                        src={s.image_url}
                        alt={`Spotting of ${s.matched_monster.flavour}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white font-body truncate">
                          {s.matched_monster.flavour}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(!store.available_monsters || store.available_monsters.length === 0) &&
              (!store.recent_spottings || store.recent_spottings.length === 0) && (
              <div className="px-5 pb-5 text-center text-spot-muted font-body text-sm">
                No spottings at this store yet. Be the first!
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Spotting"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1 hr ago";
  if (hours < 6) return `${hours}h ago`;
  if (hours < 24) return "Today";
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
