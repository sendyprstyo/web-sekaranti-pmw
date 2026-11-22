'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types/database'

interface NavbarProps {
  profile: Profile | null
  cartCount?: number
}

export default function Navbar({ profile, cartCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div
        className={`relative mx-auto max-w-6xl w-full rounded-full transition-all duration-500 pointer-events-auto border ${
          scrolled
            ? 'bg-[#fcf9f4]/95 backdrop-blur-2xl border-[#d4c3bb]/70 shadow-[0_16px_40px_rgba(49,25,8,0.12)] py-2 px-4 sm:px-6'
            : 'bg-[#fcf9f4]/90 backdrop-blur-xl border-[#d4c3bb]/50 shadow-[0_10px_32px_rgba(49,25,8,0.07)] py-2.5 px-4 sm:px-7'
        }`}
      >
        {/* Golden bevel */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none rounded-full" />

        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-[#D4AF37]/60 ring-offset-2 ring-offset-[#fcf9f4] shadow-[0_2px_10px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300">
              <Image src="/assets/LOGO-SEKARANTI.jpg" alt="SEKARANTI" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="tracking-[0.24em] text-[#311908] uppercase font-semibold text-[14.5px]" style={{ fontFamily: 'var(--font-playfair)' }}>
                SEKARANTI
              </span>
              <span className="text-[8.5px] text-[#8C7D73] tracking-[0.26em] uppercase hidden md:flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                Elegance in Every Pattern
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/shop', label: 'Shop' },
              { href: '/bundle', label: 'Bundle' },
              { href: '/about', label: 'Tentang Kami' },
              { href: '/contact', label: 'Kontak' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] uppercase tracking-[0.18em] font-semibold py-1.5 px-3.5 rounded-full text-[#50443e] hover:text-[#311908] hover:bg-[#311908]/[0.04] transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#311908]/5 transition-colors"
              aria-label="Keranjang"
            >
              <svg className="w-5 h-5 text-[#311908]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#6B1D2F] text-white text-[9px] font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#311908]/5 hover:bg-[#311908]/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#311908] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {profile.full_name?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#311908] hidden sm:block max-w-24 truncate">
                    {profile.full_name?.split(' ')[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-[#8C7D73] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#d4c3bb]/60 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#f0ede9]">
                      <p className="text-[12px] font-semibold text-[#311908] truncate">{profile.full_name}</p>
                      <p className="text-[11px] text-[#8C7D73] truncate">{profile.email}</p>
                    </div>
                    <div className="py-1">
                      {profile.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-[#311908] hover:bg-[#f6f3ee] transition-colors font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          Dashboard Admin
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-[#311908] hover:bg-[#f6f3ee] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Akun Saya
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-[#311908] hover:bg-[#f6f3ee] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Pesanan Saya
                      </Link>
                    </div>
                    <div className="py-1 border-t border-[#f0ede9]">
                      <form action={signOut}>
                        <button
                          type="submit"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Keluar
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-[11px] uppercase tracking-[0.18em] font-semibold py-1.5 px-4 rounded-full text-[#311908] hover:bg-[#311908]/5 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[11px] uppercase tracking-[0.18em] font-semibold py-1.5 px-4 rounded-full bg-[#311908] text-white hover:bg-[#4A2E1B] transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-full bg-[#311908]/5 border border-[#d4c3bb]/50 hover:bg-[#311908]/10 transition-colors gap-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-0.5 bg-[#311908] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#d4c3bb]/40 flex flex-col gap-1">
            {[
              { href: '/shop', label: 'Shop' },
              { href: '/bundle', label: 'Bundle Collection' },
              { href: '/about', label: 'Tentang Kami' },
              { href: '/contact', label: 'Kontak' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-[12px] uppercase tracking-[0.18em] font-semibold py-2.5 px-4 rounded-xl text-[#50443e] hover:text-[#311908] hover:bg-[#311908]/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {!profile && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-[#d4c3bb]/40">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-[11px] uppercase tracking-widest font-semibold py-2.5 rounded-xl border border-[#311908] text-[#311908] hover:bg-[#311908]/5 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-[11px] uppercase tracking-widest font-semibold py-2.5 rounded-xl bg-[#311908] text-white hover:bg-[#4A2E1B] transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
            {profile && (
              <div className="mt-2 pt-2 border-t border-[#d4c3bb]/40">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-[12px] font-semibold text-[#311908] py-2.5 px-4 rounded-xl hover:bg-[#311908]/5 transition-colors"
                >
                  Akun Saya ({profile.full_name?.split(' ')[0]})
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

