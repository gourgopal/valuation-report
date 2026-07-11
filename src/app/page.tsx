import { Plus, Clock, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Jobs</h1>
          <Link href="/workspace/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Valuation</span>
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-500">
                <th className="p-4">Job ID</th>
                <th className="p-4">Template</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">VAL-2024-001</td>
                <td className="p-4 text-slate-600">Commercial Valuation v1</td>
                <td className="p-4">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </span>
                </td>
                <td className="p-4 text-slate-500">2 hours ago</td>
                <td className="p-4">
                  <Link href="/workspace?id=VAL-2024-001" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Open Workspace</Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">VAL-2024-002</td>
                <td className="p-4 text-slate-600">Residential Inspection</td>
                <td className="p-4">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Ready for Review</span>
                  </span>
                </td>
                <td className="p-4 text-slate-500">Yesterday</td>
                <td className="p-4">
                  <Link href="/workspace?id=VAL-2024-002" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">View Report</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
