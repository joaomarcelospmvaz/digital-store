'use client'

import { PropsWithChildren, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { httpBatchLink } from "@trpc/client"

export default function Providers({ children }: PropsWithChildren) {
  const [queryCLient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        }
      })
    ]
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryCLient}>
      <QueryClientProvider client={queryCLient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}