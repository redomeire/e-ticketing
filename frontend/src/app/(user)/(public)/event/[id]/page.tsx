import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar,
    Location,
    Info,
    Ticket,
    DashboardBrowsingIcon,
    Twitter,
    Facebook,
    WhatsappIcon
} from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const event_data = {
    title: "The Grand Line Trials: One Piece Fan Fest 2026",
    date: "Sabtu, 25 April 2026",
    time: "10:00 - 22:00 WIB",
    location: "ICE BSD Hall 10, Tangerang",
    price: "Rp 150.000",
    image_url: "https://images.unsplash.com/photo-1772090049995-6116febe0d60?q=80&w=735&auto=format&fit=crop",
    categories: ["Anime & Cosplay", "Media & Hiburan", "Media & Konten Digital"]
};

export default function Page() {
    return (
        <div className=" bg-black/80">
            <section className="relative w-full md:h-75">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-60"
                    style={{ backgroundImage: `url(${event_data.image_url})` }}
                />

                <div className="container mx-auto px-0 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="absolute bottom-0 right-0 w-50 md:w-120 h-2/3 rounded-t-2xl overflow-hidden mt-8 md:mt-0 order-2 md:block hidden">
                        <div className="">
                            <Image
                                src={event_data.image_url}
                                alt={event_data.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 h-50 rounded-t-2xl overflow-hidden mt-8 md:mt-0 order-1 md:hidden block">
                        <Image
                            src={event_data.image_url}
                            alt={event_data.title}
                            width={200}
                            height={500}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left md:p-0 p-5 pb-4 md:order-1 order-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-sm">
                            {event_data.title}
                        </h1>
                        <div className="flex flex-col md:items-start items-center justify-center md:justify-start gap-4 md:gap-4">
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <HugeiconsIcon icon={Calendar} size={20} className="text-white" />
                                <span className="md:text-lg text-md">{event_data.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <HugeiconsIcon icon={Location} size={20} className="text-white" />
                                <span className="md:text-lg text-md">{event_data.location}</span>
                            </div>
                            <div className="flex items-center md:gap-2 gap-1 text-white font-semibold">
                                <HugeiconsIcon icon={DashboardBrowsingIcon} size={20} className="text-white" />
                                <span className="md:text-lg text-md md:line-clamp-none line-clamp-1">
                                    {event_data.categories.join(" • ")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="md:px-20 px-5 py-12 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="deskripsi" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-8">
                                <TabsTrigger value="deskripsi" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-0 py-4 text-base font-bold">
                                    Deskripsi
                                </TabsTrigger>
                                <TabsTrigger value="tiket" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-0 py-4 text-base font-bold">
                                    Tiket
                                </TabsTrigger>
                                <TabsTrigger value="s&k" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-0 py-4 text-base font-bold">
                                    Syarat & Ketentuan
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="deskripsi" className="py-8 prose prose-blue max-w-none">
                                <h3 className="text-xl font-bold text-[#002558] mb-4">Tentang Event</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Bersiaplah untuk petualangan terbesar tahun ini! One Piece Fan Fest 2026 hadir membawa atmosfer Grand Line langsung ke hadapan Anda. Nikmati berbagai galeri seni eksklusif, talkshow bersama komunitas, hingga kompetisi cosplay dengan hadiah jutaan rupiah.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        Eksklusif merchandise untuk 100 pendaftar pertama.
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        Akses penuh ke semua area pameran.
                                    </li>
                                </ul>
                            </TabsContent>

                            <TabsContent value="tiket" className="py-8">
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                                    <HugeiconsIcon icon={Ticket} size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium">Pilih kategori tiket di kolom sebelah kanan atau scroll ke bawah pada mobile.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="s&k" className="py-8">
                                <h3 className="text-xl font-bold text-[#002558] mb-4">Syarat & Ketentuan</h3>
                                <ol className="space-y-3 list-decimal">
                                    <li className="text-base gap-2 text-gray-600">
                                        Setiap pengunjung hanya dapat melakukan reservasi untuk 1 tiket dan 1 sesi selama event ini berlangsung. Pengunjung diwajibkan untuk membawa kartu identitas yang berlaku (Kartu Pelajar/KTP/Paspor/SIM, dll) saat melakukan registrasi ulang.
                                    </li>
                                    <li className="text-base gap-2 text-gray-600">
                                        2. Registrasi tidak dapat diwakilkan oleh orang lain. Tiket tidak dapat dipindahtangankan ke orang lain selain dari yang sudah terdaftar di sistem Loket.com.
                                    </li>
                                </ol>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="relative">
                        <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
                            <div className="flex flex-col justify-between">
                                <p className="text-sm text-gray-400 font-medium">Harga Mulai dari</p>
                                <p className="text-2xl font-black text-blue-600">{event_data.price}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex-1 text-center md:text-left pb-4 order-1">
                                    <h1 className="my-5 text-2xl font-bold mb-4 drop-shadow-sm">
                                        {event_data.title}
                                    </h1>
                                    <div className="flex flex-col justify-center md:justify-start gap-4 md:gap-4">
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={Calendar} size={20} className="" />
                                            <span className="text-lg">{event_data.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={Location} size={20} className="" />
                                            <span className="text-lg">{event_data.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={DashboardBrowsingIcon} size={20} className="" />
                                            <span className="text-lg line-clamp-1 w-5/6">
                                                {event_data.categories.join(" • ")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link href="/event/1/order" className="w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold shadow-lg shadow-blue-200">
                                    Beli Tiket Sekarang
                                </Button>
                            </Link>
                            <div>
                                <h2 className="mt-5 mb-3 text-xl font-bold drop-shadow-sm">
                                    Bagikan Event
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-green-600 hover:bg-green-600/80">
                                        <HugeiconsIcon className="text-white" icon={WhatsappIcon} size={12} />
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-600/80">
                                        <HugeiconsIcon className="text-white" icon={Facebook} size={12} />
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-black hover:bg-black/80">
                                        <HugeiconsIcon className="text-white" icon={Twitter} size={12} />
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                    <HugeiconsIcon icon={Info} size={20} className="text-blue-600" />
                                    <p className="text-[11px] text-blue-800 font-medium leading-tight">
                                        Tiket yang sudah dibeli tidak dapat dikembalikan/refund.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Harga Mulai</p>
                    <p className="text-xl font-black text-blue-600">{event_data.price}</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 h-12 font-bold">
                    Beli Tiket
                </Button>
            </div>
        </div>
    );
}