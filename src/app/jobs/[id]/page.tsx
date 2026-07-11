import dynamic from 'next/dynamic';

// Disable Server-Side Rendering (SSR) completely for this route.
// This prevents Cloudflare's Edge Runtime from attempting to evaluate heavy 
// client-side libraries (like mathjs) or browser APIs during RSC payload generation.
const JobExecutionClient = dynamic(
  () => import('@/components/widgets/JobExecutionClient').then(mod => mod.JobExecutionClient),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Loading Workspace...</div>
      </div>
    )
  }
);

export default function JobExecutionPage({ params }: { params: { id: string } }) {
  return <JobExecutionClient jobId={params.id} />;
}
