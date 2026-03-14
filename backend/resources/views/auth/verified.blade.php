<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Berhasil Diverifikasi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-slate-50 min-h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-white shadow-2xl rounded-[2.5rem] p-10 text-center space-y-6">
        <div
            class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
        </div>

        <div class="space-y-2">
            <h1 class="text-2xl font-black text-[#002558] uppercase tracking-tighter">Akun Terverifikasi!</h1>
            <p class="text-slate-500 font-medium">
                Terima kasih, email kamu telah berhasil diverifikasi. Sekarang kamu bisa menikmati semua fitur kami.
            </p>
        </div>

        <a href="{{ config('app.frontend_url') }}/auth/login"
            class="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 uppercase tracking-wider">
            Masuk ke Aplikasi
        </a>
    </div>
</body>

</html>