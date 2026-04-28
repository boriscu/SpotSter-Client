import { useEffect, useState, FormEvent } from "react";
import { adminStores } from "@/api/client";
import type { Store } from "@/types";

export default function StoreManager() {
  const [stores, setStores] = useState<Store[]>([]);
  const [editing, setEditing] = useState<Store | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStores = () => {
    setLoading(true);
    adminStores
      .list()
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchStores, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this store?")) return;
    await adminStores.delete(id);
    fetchStores();
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (store: Store) => {
    setEditing(store);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Stores</h1>
        <button
          onClick={openCreate}
          className="bg-spot-green text-spot-dark font-heading font-bold px-5 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          + Add Store
        </button>
      </div>

      {showForm && (
        <StoreForm
          store={editing}
          onClose={() => setShowForm(false)}
          onSaved={fetchStores}
        />
      )}

      {loading ? (
        <p className="text-spot-muted font-body">Loading...</p>
      ) : stores.length === 0 ? (
        <p className="text-spot-muted font-body">
          No stores yet. Click &quot;Add Store&quot; to create one.
        </p>
      ) : (
        <div className="bg-spot-card border border-spot-border rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-spot-border text-left text-spot-muted">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Lat</th>
                <th className="px-4 py-3">Lng</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-spot-border/50 hover:bg-spot-surface/50"
                >
                  <td className="px-4 py-3 text-spot-muted">{s.id}</td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {s.address || "—"}
                  </td>
                  <td className="px-4 py-3 text-spot-muted">
                    {s.latitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-spot-muted">
                    {s.longitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-spot-green hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StoreForm({
  store,
  onClose,
  onSaved,
}: {
  store: Store | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(store?.name || "");
  const [address, setAddress] = useState(store?.address || "");
  const [lat, setLat] = useState(store?.latitude?.toString() || "");
  const [lng, setLng] = useState(store?.longitude?.toString() || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const data = {
      name,
      address: address || undefined,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    };

    try {
      if (store) {
        await adminStores.update(store.id, data);
      } else {
        await adminStores.create(data);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-spot-card border border-spot-border rounded-xl p-6 mb-6">
      <h2 className="font-heading text-xl font-bold mb-4">
        {store ? "Edit Store" : "New Store"}
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 font-body mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-spot-green text-spot-dark font-heading font-bold px-6 py-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : store ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-spot-border text-gray-400 font-body px-6 py-2 rounded-lg hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
