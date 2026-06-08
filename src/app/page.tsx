import Image from "next/image";
import Link from "next/link";
import { Users, Boxes, Ticket, Wrench } from "lucide-react";

const modules = [
  {
    icon: Users,
    title: "Users",
    description: "Manage employees, technicians, and admins by department.",
  },
  {
    icon: Boxes,
    title: "Assets",
    description: "Track company assets, their status, and assignments.",
  },
  {
    icon: Ticket,
    title: "Service Requests",
    description: "Create, assign, and resolve service tickets.",
  },
  {
    icon: Wrench,
    title: "Maintenance Logs",
    description: "Record maintenance activity for each asset.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Image
            src="/megasoft-logo.png"
            alt="MegaSoft"
            width={156}
            height={52}
            priority
            className="h-8 w-auto"
          />
          <Link
            href="/dashboard"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Enterprise Service & Asset Management
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
          One workspace for managing users, assets, service requests, and
          maintenance logs.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-brand px-6 py-3 text-base font-semibold text-brand-foreground"
          >
            Open Dashboard
          </Link>
          <a
            href="#modules"
            className="rounded-md border px-6 py-3 text-base font-semibold"
          >
            View Modules
          </a>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="border-t bg-zinc-50">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
              <div key={m.title} className="rounded-lg border bg-white p-6">
                <m.icon className="size-6 text-brand" />
                <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} MegaSoft.
          Management.
        </div>
      </footer>
    </div>
  );
}
