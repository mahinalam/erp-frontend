import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* <Sidebar /> */}

      {/* <main className="flex-1 overflow-y-auto p-6">{children}</main> */}
    </div>
  );
}
