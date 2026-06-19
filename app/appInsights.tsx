'use client'

import { useEffect } from 'react'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

/**
 * Initializes browser App Insights once, on the client. The connection string
 * is inlined at build time from NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
 * which the deploy workflow sets from the APPLICATIONINSIGHTS_CONNECTION_STRING
 * repo secret the kiosk pushes when the "app-insights" component is enabled.
 * Absent (opted out, or local dev) → telemetry stays off.
 */
export function AppInsights() {
  useEffect(() => {
    const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING
    if (!connectionString) return
    const appInsights = new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
      },
    })
    appInsights.loadAppInsights()
    // Powers the dashboard's uptime + page-load p95 (the `pageViews` table the
    // kiosk health query reads).
    appInsights.trackPageView()
  }, [])
  return null
}
