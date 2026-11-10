import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/auth";
import { getContent, listRecords } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <section className="section">
        <div className="container max-w-xl">
          <h1 className="text-3xl font-bold">Admin is disabled</h1>
          <p className="lead mt-3">Set <code className="text-accent">ADMIN_PASSWORD</code> in your <code>.env.local</code> and restart the server.</p>
        </div>
      </section>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;
  const [content, regs] = await Promise.all([getContent(), listRecords("registrations")]);
  return <AdminDashboard initial={content} registrationCount={regs.length} />;
}
