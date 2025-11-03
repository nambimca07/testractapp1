import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import QueryProvider from '@/components/query-provider'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Financial Dashboard',
  description: 'Track your finances with our comprehensive dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}