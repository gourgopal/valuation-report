'use client';
import { useState } from 'react';
import { DynamicForm } from '@/components/form/DynamicForm';
import { LofiWidget } from '@/components/widgets/LofiWidget';
import { ReportPreview } from '@/components/widgets/ReportPreview';
import { FileSearch, ArrowLeft } from 'lucide-react';
import { FormSchema } from '@/types/schema';
import Link from 'next/link';

const mockSchema: FormSchema = {
  templateId: 'demo_1',
  domain: 'valuation',
  attributes: [
    { elementIdentifier: 'PropertyType', label: 'Property Type', type: 'select', required: true, options: [{label: 'Residential', value: 'Residential'}, {label: 'Commercial', value: 'Commercial'}] },
    { elementIdentifier: 'LandArea', label: 'Total Land Area (SqFt)', type: 'number', required: true },
    { elementIdentifier: 'AdoptedRate', label: 'Adopted Rate per SqFt', type: 'price', required: true },
    { elementIdentifier: 'TotalAmenities', label: 'Value of Amenities', type: 'price' },
    { elementIdentifier: 'FinalMarketValue', label: 'Final Market Value', type: 'price', readonly: true, calculationFormula: "(CONVERT(LandArea) * CONVERT(AdoptedRate)) + CONVERT(TotalAmenities)" },
    { elementIdentifier: 'DepreciationPenalty', label: 'Depreciation Penalty', type: 'price' },
    { elementIdentifier: 'SitePhoto', label: 'Front Elevation Photo', type: 'image' },
  ],
  visibilityRules: [
    { targetField: 'DepreciationPenalty', condition: "PropertyType == 'Commercial'" }
  ]
};

export function JobExecutionClient({ jobId }: { jobId: string }) {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSave = async (data: any) => {
    // Construct sync payload
    const payload = {
      id: jobId,
      org_id: '00000000-0000-0000-0000-000000000000', // Mock org
      user_id: '00000000-0000-0000-0000-000000000000', // Mock user
      template_id: mockSchema.templateId,
      status: 'In Progress',
      data_json: data,
      updated_at: new Date().toISOString()
    };

    try {
      const { db } = await import('@/lib/db');
      
      // 1. Save to local jobs table
      await db.jobs.put({
        id: payload.id,
        templateId: payload.template_id,
        data: payload.data_json,
        status: 'In Progress',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // 2. Queue for background sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        action: 'UPSERT_JOB',
        payload,
        createdAt: Date.now()
      });

      console.log("Saved to Dexie and queued for sync.");
      setFormData(data);
    } catch (err) {
      console.error("Failed to save job locally", err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
        <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
        <div className="mx-auto flex items-center space-x-3">
           <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
           <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online & Synced</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Pane - Form */}
        <div className={`w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-8 border-r border-slate-200 transition-all ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <div className="max-w-2xl mx-auto">
             <DynamicForm schema={mockSchema} onSave={handleSave} />
          </div>
        </div>

        {/* Right Pane - Preview */}
        <div className={`w-full lg:w-1/2 h-full overflow-hidden transition-all ${!showPreview ? 'hidden lg:block' : 'block'}`}>
          <ReportPreview data={formData} jobId={jobId} />
        </div>

        {/* Mobile FAB */}
        <button 
          className="lg:hidden fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-transform active:scale-95"
          onClick={() => setShowPreview(!showPreview)}
          title="Toggle Preview"
        >
          <FileSearch className="w-6 h-6" />
        </button>

        <LofiWidget />
      </div>
    </div>
  );
}
