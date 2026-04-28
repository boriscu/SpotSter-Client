import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminStores, adminMonsters } from "@/api/client";
import type { Store, MonsterDrink } from "@/types";

export default function Dashboard() {
  const [storeCount, setStoreCount] = useState(0);
  const [monsterCount, setMonsterCount] = useState(0);
  const [recentStores, setRecentStores] = useState<Store[]>([]);
  const [recentMonsters, setRecentMonsters] = useState<MonsterDrink[]>([]);

  useEffect(() => {
    adminStores.list().then((s) => {
      setStoreCount(s.length);
      setRecentStores(s.slice(-5).reverse());
    }).catch(() => {});

    adminMonsters.list().then((m) => {
      setMonsterCount(m.length);
      setRecentMonsters(m.slice(-5).reverse());
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          label="Stores"
          count={storeCount}
          link="/admin/stores"
          color="text-blue-400"
        />
        <StatCard
          label="Monster Drinks"
          count={monsterCount}
          link="/admin/monsters"
          color="text-spot-green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-spot-card border border-spot-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold">Recent Stores</h2>
            <Link
              to="/admin/stores"
              className="text-spot-green text-sm font-body hover:underline"
            >
              View all
            </Link>
          </div>
          {recentStores.length === 0 ? (
            <p className="text-spot-muted text-sm font-body">No stores yet</p>
          ) : (
            <ul className="space-y-3">
              {recentStores.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-sm font-body"
                >
                  <span>{s.name}</span>
                  <span className="text-spot-muted">{s.address || "No address"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-spot-card border border-spot-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold">Recent Monsters</h2>
            <Link
              to="/admin/monsters"
              className="text-spot-green text-sm font-body hover:underline"
            >
              View all
            </Link>
          </div>
          {recentMonsters.length === 0 ? (
            <p className="text-spot-muted text-sm font-body">
              No monsters yet
            </p>
          ) : (
            <ul className="space-y-3">
              {recentMonsters.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 text-sm font-body"
                >
                  {m.image_url && (
                    <img
                      src={m.image_url}
                      alt={m.flavour}
                      className="w-6 h-9 object-contain"
                    />
                  )}
                  <span className="flex-1">{m.name}</span>
                  <span className="text-spot-muted">{m.flavour}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  link,
  color,
}: {
  label: string;
  count: number;
  link: string;
  color: string;
}) {
  return (
    <Link
      to={link}
      className="bg-spot-card border border-spot-border rounded-xl p-6 hover:border-spot-green/30 transition-colors"
    >
      <p className="text-spot-muted text-sm font-body mb-1">{label}</p>
      <p className={`font-heading text-4xl font-bold ${color}`}>{count}</p>
    </Link>
  );
}
