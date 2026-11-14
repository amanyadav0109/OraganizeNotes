import {
  Users,
  FileText,
  ClipboardList,
  ShoppingBag,
  CreditCard,
  BrainCircuit,
  Settings,
} from "lucide-react";

const pageConfig = {
  users: {
    title: "User Management",
    description: "Manage student accounts and access.",
    icon: Users,
    features: ["View all students", "Search and filter users", "Manage account status"],
  },
  notes: {
    title: "Notes Management",
    description: "Manage educational notes on GetNotes.",
    icon: FileText,
    features: ["Add new notes", "Edit existing notes", "Publish or remove notes"],
  },
  "mock-tests": {
    title: "Mock Test Management",
    description: "Manage categories, subjects, tests and questions.",
    icon: ClipboardList,
    features: ["Manage test categories", "Create test sets", "Manage questions and answers"],
  },
  marketplace: {
    title: "Marketplace Management",
    description: "Manage marketplace notes, purchases and orders.",
    icon: ShoppingBag,
    features: ["View marketplace notes", "Manage prices", "Track orders"],
  },
  subscriptions: {
    title: "Subscription Management",
    description: "Monitor student premium subscriptions.",
    icon: CreditCard,
    features: ["View premium users", "Check subscription expiry", "Review payments"],
  },
  "ai-usage": {
    title: "AI Usage Analytics",
    description: "Monitor AI assistant usage and limits.",
    icon: BrainCircuit,
    features: ["Track AI requests", "Monitor free usage", "View premium usage"],
  },
  settings: {
    title: "Admin Settings",
    description: "Manage administrator preferences.",
    icon: Settings,
    features: ["Admin profile", "Security settings", "Platform configuration"],
  },
};

function AdminSections({ type }) {
  const page = pageConfig[type];
  const Icon = page.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {page.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {page.description}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={28} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          {page.title}
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
          This section is ready for its management features. We will connect
          it to your GetNotes backend and MySQL database in the next stages.
        </p>

        <div className="mt-7 space-y-3">
          {page.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSections;