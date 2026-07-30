import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    redirect('/login')
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let currentRole = null
  let errorMessage = null
  const { data: existingUser } = await supabaseAdmin
    .from('admin_roles')
    .select('role')
    .eq('email', user.email)
    .single()

  if (existingUser) {
    currentRole = existingUser.role
  } else {
    const { error: insertError } = await supabaseAdmin
      .from('admin_roles')
      .insert([{ email: user.email, role: 'pending' }])

    if (insertError) {
      errorMessage = "Akses admin saat ini sedang penuh. Silakan hubungi Admin."
    } else {
      currentRole = 'pending'
    }
  }

  async function handleLogout() {
    'use server'
    const supabaseAuth = await createClient()
    await supabaseAuth.auth.signOut()
    redirect('/login')
  }

  if (errorMessage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 font-sans p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-red-500 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛑</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Ditolak</h2>
          <p className="text-gray-600 mb-6 text-sm">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg transition-colors">Kembali ke Beranda Publik</Link>
            <form action={handleLogout}>
              <button type="submit" className="w-full text-red-600 hover:text-red-800 font-semibold underline text-sm py-2">Gunakan email lain</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (currentRole === 'pending') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 font-sans p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-yellow-500 text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Tertunda</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Email <span className="font-bold text-gray-900">{user.email}</span> sedang menunggu persetujuan dari Super Admin. Silakan hubungi admin utama EWS untuk mendapatkan akses.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">Kembali ke Beranda Dashboard Utama</Link>
            <form action={handleLogout}>
              <button type="submit" className="w-full text-slate-500 hover:text-slate-800 font-semibold underline text-sm py-2">Batalkan / Logout</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (currentRole === 'super_admin' || currentRole === 'admin') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-red-500 font-bold">Terjadi kesalahan sistem. Status akun tidak valid.</p>
    </div>
  )
}