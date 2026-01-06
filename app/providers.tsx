'use client'

import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // Don't refetch when window regains focus
        revalidateOnReconnect: true, // Refetch when internet reconnects
        dedupingInterval: 60000, // Dedupe requests within 60 seconds
        refreshInterval: 0, // Disable auto-refresh (set to 0)
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 5000, // Wait 5 seconds between retries
      }}
    >
      {children}
    </SWRConfig>
  )
}

