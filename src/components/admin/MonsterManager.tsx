import { useEffect, useState, FormEvent, useRef } from "react";
import { adminMonsters } from "@/api/client";
import { TAG_LABELS } from "@/types";
import type { MonsterDrink } from "@/types";

export default function MonsterManager() {
  const [monsters, setMonsters] = useState<MonsterDrink[]>([]);
  const [editing, setEditing] = useState<MonsterDrink | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMonsters = () => {
    setLoading(true);
    adminMonsters
      .list()
      .then(setMonsters)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchMonsters, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this monster drink?")) return;
    await adminMonsters.delete(id);
    fetchMonsters();
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (monster: MonsterDrink) => {
    setEditing(monster);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Monster Drinks</h1>
        <button
          onClick={openCreate}
          className="bg-spot-green text-spot-dark font-heading font-bold px-5 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          + Add Monster
        </button>
      </div>

      {showForm && (
        <MonsterForm
          monster={editing}
          onClose={() => setShowForm(false)}
          onSaved={fetchMonsters}
        />
      )}

      {loading ? (
        <p className="text-spot-muted font-body">Loading...</p>
      ) : monsters.length === 0 ? (
        <p className="text-spot-muted font-body">
          No monsters yet. Click &quot;Add Monster&quot; to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monsters.map((m) => (
            <div
              key={m.id}
              className="bg-spot-card border border-spot-border rounded-xl p-5 hover:border-spot-green/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {m.image_url ? (
                  <img
                    src={m.image_url}
                    alt={m.flavour}
                    className="w-14 h-20 object-contain flex-shrink-0 rounded"
                  />
                ) : (
                  <div className="w-14 h-20 bg-spot-surface rounded flex items-center justify-center text-spot-muted text-xs flex-shrink-0">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-lg truncate">
                    {m.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-body">{m.flavour}</p>
                  {m.tag && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-body bg-spot-surface text-spot-green">
                      {TAG_LABELS[m.tag] || `Tag ${m.tag}`}
                    </span>
                  )}
                  <div className="mt-2 text-xs text-spot-muted font-body space-x-3">
                    {m.calories != null && <span>{m.calories} cal</span>}
                    {m.caffeine_mg != null && <span>{m.caffeine_mg}mg caffeine</span>}
                    {m.is_zero_sugar && (
                      <span className="text-spot-green">Zero Sugar</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-spot-border/50">
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 text-center text-sm text-spot-green hover:underline font-body py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex-1 text-center text-sm text-red-400 hover:underline font-body py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MonsterForm({
  monster,
  onClose,
  onSaved,
}: {
  monster: MonsterDrink | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(monster?.name || "");
  const [flavour, setFlavour] = useState(monster?.flavour || "");
  const [description, setDescription] = useState(monster?.description || "");
  const [calories, setCalories] = useState(monster?.calories?.toString() || "");
  const [sugarGrams, setSugarGrams] = useState(monster?.sugar_grams?.toString() || "");
  const [caffeineMg, setCaffeineMg] = useState(monster?.caffeine_mg?.toString() || "");
  const [isZeroSugar, setIsZeroSugar] = useState(monster?.is_zero_sugar || false);
  const [tag, setTag] = useState(monster?.tag?.toString() || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("flavour", flavour);
    if (description) formData.append("description", description);
    if (calories) formData.append("calories", calories);
    if (sugarGrams) formData.append("sugar_grams", sugarGrams);
    if (caffeineMg) formData.append("caffeine_mg", caffeineMg);
    formData.append("is_zero_sugar", String(isZeroSugar));
    if (tag) formData.append("tag", tag);

    const file = fileRef.current?.files?.[0];
    if (file) formData.append("image", file);

    try {
      if (monster) {
        await adminMonsters.update(monster.id, formData);
      } else {
        await adminMonsters.create(formData);
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
        {monster ? "Edit Monster" : "New Monster"}
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 font-body mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Flavour *</label>
          <input
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
            required
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 font-body mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Calories</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Sugar (g)</label>
          <input
            type="number"
            step="0.1"
            value={sugarGrams}
            onChange={(e) => setSugarGrams(e.target.value)}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Caffeine (mg)</label>
          <input
            type="number"
            value={caffeineMg}
            onChange={(e) => setCaffeineMg(e.target.value)}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Tag</label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full bg-spot-dark border border-spot-border rounded-lg px-4 py-2 text-white font-body focus:outline-none focus:border-spot-green/50"
          >
            <option value="">None</option>
            {Object.entries(TAG_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 font-body mb-1">Image</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-sm text-gray-400 font-body file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-spot-surface file:text-white file:font-body file:cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="zero-sugar"
            checked={isZeroSugar}
            onChange={(e) => setIsZeroSugar(e.target.checked)}
            className="accent-spot-green"
          />
          <label htmlFor="zero-sugar" className="text-sm text-gray-400 font-body">
            Zero Sugar
          </label>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-spot-green text-spot-dark font-heading font-bold px-6 py-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : monster ? "Update" : "Create"}
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
