"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "admin";

  const navigation = [
    { name: "Tâches", href: "/taches" },
    { name: "Citations", href: "/citations" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  return (
    <aside className="w-64 bg-white shadow-sm p-4">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded-md text-sm font-medium",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}