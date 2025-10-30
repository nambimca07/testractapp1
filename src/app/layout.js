import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import '@fortawesome/fontawesome-free/css/all.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Financial Dashboard',
  description: 'Track your finances with our comprehensive dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}