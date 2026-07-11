'use client';
import { useRef, useState } from 'react';
import { Download } from 'lucide-react';

export function ReportPreview({ data, jobId }: { data: any, jobId: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);
    
    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      const opt: any = {
        margin:       [0.5, 0.5] as [number, number],
        filename:     `${jobId}-Report.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 shrink-0 px-8 pt-8">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Live Preview</p>
          <h2 className="text-2xl font-bold text-slate-900">Report Generator</h2>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 flex justify-center">
        {/* The PDF Canvas Container */}
        <div 
          ref={contentRef} 
          className="bg-white w-[8.5in] min-h-[11in] shadow-lg p-12 text-slate-900 font-sans rounded-sm shrink-0"
        >
          <header className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">Valuation Report</h1>
            </div>
            <div className="text-right">
              <p className="text-slate-600 font-medium">Job ID: {jobId}</p>
              <p className="text-slate-500 text-sm mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </header>

          <main className="space-y-8">
            <section>
              <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-800">Property Details</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                 <div>
                   <span className="block text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">Property Type</span>
                   <span className="font-semibold text-slate-900 text-base">{data.PropertyType || 'N/A'}</span>
                 </div>
                 <div>
                   <span className="block text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">Land Area</span>
                   <span className="font-semibold text-slate-900 text-base">{data.LandArea ? `${data.LandArea} SqFt` : 'N/A'}</span>
                 </div>
                 <div>
                   <span className="block text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">Adopted Rate</span>
                   <span className="font-semibold text-slate-900 text-base">{data.AdoptedRate ? `$${data.AdoptedRate}/SqFt` : 'N/A'}</span>
                 </div>
                 <div>
                   <span className="block text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">Amenities Value</span>
                   <span className="font-semibold text-slate-900 text-base">{data.TotalAmenities ? `$${data.TotalAmenities}` : 'N/A'}</span>
                 </div>
              </div>
            </section>

            {data.DepreciationPenalty && (
              <section className="bg-amber-50 p-5 border border-amber-200 rounded-md">
                <h3 className="text-sm font-bold text-amber-900 mb-1">Depreciation Applied</h3>
                <p className="text-amber-700 text-sm">A penalty of ${data.DepreciationPenalty} was applied to this commercial property.</p>
              </section>
            )}

            <section className="pt-6">
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-lg font-bold text-slate-700">Final Market Value</span>
                <span className="text-3xl font-bold text-blue-600 tracking-tight">
                  {data.FinalMarketValue ? `$${data.FinalMarketValue.toLocaleString()}` : 'Pending calculation...'}
                </span>
              </div>
            </section>
            
            {data.SitePhoto && (
               <section className="pt-4 break-inside-avoid">
                 <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-800">Site Photo</h3>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={data.SitePhoto} alt="Site Elevation" className="w-full h-auto max-h-96 object-cover rounded-md shadow-sm border border-slate-200" />
               </section>
            )}
          </main>
          
          <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>Confidential Valuation Report. Do not distribute.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
