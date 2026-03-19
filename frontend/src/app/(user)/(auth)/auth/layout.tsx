interface Props {
    children: React.ReactNode
}

export default function layout({ children }: Props) {
    return (
        <main>
            <div className="flex min-h-screen bg-white">
                <div className="hidden lg:flex lg:w-1/2 bg-[#002558] relative overflow-hidden items-center justify-center p-12">
                    <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-30" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400 rounded-full blur-[120px] opacity-20" />

                    <div className="relative z-10 max-w-md text-center">
                        <h1 className="text-6xl font-black italic tracking-tighter text-white mb-6">LOKET</h1>
                        <p className="text-xl text-blue-100 font-medium leading-relaxed">
                            Rayakan momen serumu. Masuk untuk akses tiket event favoritmu dengan lebih cepat.
                        </p>
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}