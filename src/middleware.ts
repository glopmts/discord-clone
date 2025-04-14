import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/channels(.*)'])

const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)'])

export default clerkMiddleware(async (auth, req) => {

  if (req.nextUrl.pathname.startsWith('/api/uploadthing')) {
    return NextResponse.next()
  }

  const { userId, redirectToSignIn } = await auth()

  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/channels/me', req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
