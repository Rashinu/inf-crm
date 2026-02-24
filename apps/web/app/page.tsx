import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
          INF <span className="text-blue-600">CRM</span>
        </h1>
        <p className="text-xl text-gray-600">
          The ultimate multi-tenant CRM for influencers and brands.
          Manage deals, deliverables, and payments in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-32">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" className="w-32">
              Register
            </Button>
          </Link>
        </div>
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900">Multi-tenant</h3>
            <p className="text-sm text-gray-500">Secure isolation for your influencer data.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900">Pipeline</h3>
            <p className="text-sm text-gray-500">Visual Kanban board for tracking deals.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900">Automation</h3>
            <p className="text-sm text-gray-500">Reminders for payments and posts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
