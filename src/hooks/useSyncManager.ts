'use client';
import { useEffect } from 'react';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';

export function useSyncManager() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const supabase = createClient();
    let isSyncing = false;

    const syncQueue = async () => {
      if (isSyncing || !navigator.onLine) return;
      isSyncing = true;
      
      try {
        const items = await db.syncQueue.orderBy('createdAt').toArray();
        if (items.length === 0) {
          isSyncing = false;
          return;
        }

        console.log(`[SyncManager] Syncing ${items.length} items to Supabase...`);
        
        for (const item of items) {
          if (item.action === 'UPSERT_JOB') {
            const { error } = await supabase.from('jobs').upsert(item.payload);
            
            if (!error) {
              await db.syncQueue.delete(item.id);
              console.log(`[SyncManager] Successfully synced job payload ${item.payload.id}`);
            } else {
              console.error(`[SyncManager] Failed to sync job ${item.payload.id}:`, error);
            }
          }
          // Add other actions like UPLOAD_IMAGE here
        }
      } catch (error) {
        console.error('[SyncManager] Critical sync process failure', error);
      } finally {
        isSyncing = false;
      }
    };

    window.addEventListener('online', syncQueue);
    
    // Initial check
    if (navigator.onLine) {
       syncQueue();
    }
    
    const interval = setInterval(() => {
       if (navigator.onLine) syncQueue();
    }, 60000);

    return () => {
      window.removeEventListener('online', syncQueue);
      clearInterval(interval);
    };
  }, []);
}
