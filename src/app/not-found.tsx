
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import nextConfig from '../../../next.config'

const basePath = nextConfig.basePath || ""

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <div className="flex items-center space-x-6">
        <h1 className="text-6xl font-bold font-headline">404</h1>
        <div className="border-l border-foreground/50 h-16"></div>
        <p className="text-2xl font-medium">This page could not be found.</p>
      </div>
      <Button variant="outline" asChild className="mt-8">
        <Link href={`${basePath}/`}>Go back home</Link>
      </Button>
    </div>
  )
}
