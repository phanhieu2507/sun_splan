import { NextResponse } from "next/server";

const privateRoute = {
    superAdmin: [
        '/setting',
    ],
    naiteisha: [
        '/home',
    ],
    mentor: [
        '/setting',
        '/home',
        '/documents',
        '/edit-document'
    ],
    teacher: [
        '/home',
    ],
    manager: [
        '/home',
    ],
}

export default function middleware(req) {
    const role = req.cookies.get('role');
    const verify = req.cookies.get('token');
    const url = req.url;
    const pathname = req.nextUrl.pathname;

    if(!verify && !pathname.includes('/login')) {
        return NextResponse.redirect(new URL('/login', url));
    }
    if(verify) {
        if(pathname.includes('/login'))
            return NextResponse.redirect(new URL('/', url));
        else if(pathname === '/' && role !== "0")
            return NextResponse.next();
        else {
            switch(role) {
                case "0":
                    if(privateRoute?.superAdmin.map(each => pathname.includes(each)).includes(true))
                        return NextResponse.next();
                    else
                        return NextResponse.redirect(new URL('/404', url));
                case "1":
                    if(privateRoute?.naiteisha.map(each => pathname.includes(each)).includes(true))
                        return NextResponse.next();
                    else
                        return NextResponse.redirect(new URL('/404', url));
                case "2":
                    if(privateRoute?.mentor.map(each => url.includes(each)).includes(true))
                        return NextResponse.next();
                    else
                        return NextResponse.redirect(new URL('/404', url));
                case "3":
                    if(privateRoute?.teacher.map(each => url.includes(each)).includes(true))
                        return NextResponse.next();
                    else
                        return NextResponse.redirect(new URL('/404', url));
                case "4":
                    if(privateRoute?.manager.map(each => url.includes(each)).includes(true))
                        return NextResponse.next();
                    else
                        return NextResponse.redirect(new URL('/404', url));
                default:
                    return NextResponse.redirect(new URL('/404', url));
            }
        }
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/home/:path*',
        '/setting/:path*',
    ],
}