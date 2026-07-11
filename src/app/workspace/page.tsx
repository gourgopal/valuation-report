import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// 🛑 EXTREMELY IMPORTANT FOR CLOUDFLARE PAGES 🛑
// This forces Next.js to compile this entire route into a static HTML file at build time.
// It explicitly prevents Cloudflare from creating an Edge Worker for this route.
// This completely eliminates any possibility of a 500 Internal Server Error when loading the workspace!
export const dynamic = 'force-static';

// We dynamically import the wrapper with ssr: false so the search params are only evaluated in the browser
const WorkspaceWrapper = dynamic(
  () => import('@/components/widgets/WorkspaceWrapper'),
  { ssr: false }
);

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50"></div>}>
      <WorkspaceWrapper />
    </Suspense>
  );
}
