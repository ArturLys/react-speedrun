import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@radix-ui/themes/styles.css'
import Navbar from './Navbar'
import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GlobalStateProvider } from './contexts/GlobalContext'
config.autoAddCss = false

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GlobalStateProvider>
          <NextThemesProvider defaultTheme="system" enableSystem={true}>
            <Navbar />
            {children}
          </NextThemesProvider>
        </GlobalStateProvider>
      </body>
    </html>
  )
}
