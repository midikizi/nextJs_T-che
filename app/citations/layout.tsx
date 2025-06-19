import RequireAuth from "@/src/components/ui/RequireAuth";

export default function CitationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="container mx-auto py-6">
        {children}
      </div>
    </RequireAuth>
  );
} 