import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@radix-ui/themes/styles.css'
import Navbar from './Navbar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemesProvider defaultTheme="system" enableSystem={true}>
          <Navbar />
          {children}
        </NextThemesProvider>
      </body>
    </html>
  )
}
