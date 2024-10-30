// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Mengambil token dari cookies

  // Daftar route yang tidak memerlukan autentikasi
  const publicPaths = ['/login', '/'];

  // Cek jika user mencoba mengakses route yang dilindungi
  if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
    // Redirect ke halaman login jika tidak terautentikasi
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ['/home', '/monitor', '/dokumen', '/user', '/logout'], // Route yang ingin dilindungi
};
