import { Navigate, Outlet, NavLink } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const { isAuthenticated, checking, logout } = useAuth();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spot-dark">
        <div className="text-spot-green font-heading text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-spot-dark flex">
      <aside className="w-64 bg-spot-card border-r border-spot-border flex flex-col">
        <div className="p-6 border-b border-spot-border">
          <NavLink to="/admin">
            <Logo className="text-2xl" />
          </NavLink>
          <p className="text-spot-muted text-xs font-body mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink to="/admin" end label="Dashboard" icon="grid" />
          <SidebarLink to="/admin/stores" label="Stores" icon="map-pin" />
          <SidebarLink to="/admin/monsters" label="Monsters" icon="zap" />
        </nav>

        <div className="p-4 border-t border-spot-border space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 w-full text-left text-spot-muted hover:text-white text-sm font-body py-2 px-3 rounded-lg hover:bg-spot-surface transition-colors"
          >
            <IconByName name="external" />
            View Site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full text-left text-spot-muted hover:text-white text-sm font-body py-2 px-3 rounded-lg hover:bg-spot-surface transition-colors"
          >
            <IconByName name="logout" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  end,
}: {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
          isActive
            ? "bg-spot-green/10 text-spot-green"
            : "text-gray-400 hover:text-white hover:bg-spot-surface"
        }`
      }
    >
      <IconByName name={icon} />
      {label}
    </NavLink>
  );
}

function IconByName({ name }: { name: string }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "zap":
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "external":
      return (
        <svg {...props}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}
