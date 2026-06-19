import { AppInsights } from './appInsights'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppInsights />
        {children}
      </body>
    </html>
  )
}
