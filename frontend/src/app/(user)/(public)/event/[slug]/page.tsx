import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar,
    Location,
    Ticket,
    DashboardBrowsingIcon,
} from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import eventRepository from "@/modules/event/repositories/event.repository";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import EventDetailSummaryCard from "@/modules/event/components/card/EventDetailSummaryCard";
import BottomDrawer from "@/modules/order/components/drawer/BottomDrawer";
import HTMLRenderer from "@/components/ui/html-renderer";

const event_data = {
    image_url: "https://images.unsplash.com/photo-1772090049995-6116febe0d60?q=80&w=735&auto=format&fit=crop",
};

async function getEvent(slug: string) {
    const res = await eventRepository.getEventDetail({
        payload: {
            slug
        }
    });

    return res.data;
}

interface Props {
    params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Event tidak ditemukan</p>
            </div>
        );
    }
    const event = await getEvent(slug);
    const priceStartFrom = event.ticket_categories.reduce((minPrice, category) => {
        return category.base_price < minPrice ? category.base_price : minPrice;
    }, Infinity);
    return (
        <div className=" bg-black/80">
            <section className="relative w-full md:h-75">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-60"
                    style={{ backgroundImage: `url(${event.cover_image_url ?? "/images/placeholder.png"})` }}
                />

                <div className="container mx-auto px-0 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="absolute bottom-0 right-0 w-50 md:w-120 h-2/3 rounded-t-2xl overflow-hidden mt-8 md:mt-0 order-2 md:block hidden">
                        <div className="">
                            <Image
                                src={event.cover_image_url ?? "/images/placeholder.png"}
                                alt={event.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 h-50 rounded-t-2xl overflow-hidden mt-8 md:mt-0 order-1 md:hidden block">
                        <Image
                            src={event.cover_image_url ?? event_data.image_url}
                            alt={event.name}
                            width={200}
                            height={500}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left md:p-0 p-5 pb-4 md:order-1 order-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-sm">
                            {event.name}
                        </h1>
                        <div className="flex flex-col md:items-start items-center justify-center md:justify-start gap-4 md:gap-4">
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <HugeiconsIcon icon={Calendar} size={20} className="text-white" />
                                <span className="md:text-lg text-md">{formatDate(event.start_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <HugeiconsIcon icon={Location} size={20} className="text-white" />
                                <span className="md:text-lg text-md">{event.location}</span>
                            </div>
                            <div className="flex items-center md:gap-2 gap-1 text-white font-semibold">
                                <HugeiconsIcon icon={DashboardBrowsingIcon} size={20} className="text-white" />
                                <span className="md:text-lg text-md md:line-clamp-none line-clamp-1">
                                    {event.categories.map((category) => category.name).join(" • ")}
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
                                <HTMLRenderer html={event.description as string} />
                            </TabsContent>

                            <TabsContent value="tiket" className="py-8">
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                                    {event.ticket_categories.length > 0 ? (
                                        <div className="space-y-4">
                                            {event.ticket_categories.map((category) => (
                                                <div key={category.id} className="grid grid-cols-3 items-center justify-between border border-gray-100 rounded-lg p-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">{category.name}</h4>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {formatCurrency(category.base_price)}
                                                    </div>
                                                    <div>
                                                        {
                                                            category.available_tickets_count === 0 ?
                                                                <Image
                                                                    src="/images/event/ticket-sold-out.webp"
                                                                    alt="Available"
                                                                    width={120}
                                                                    height={120}
                                                                    className="inline-block mr-1"
                                                                />
                                                                :
                                                                <p className="text-lg text-gray-500">
                                                                    Sisa {category.available_tickets_count} tiket
                                                                </p>
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                        :
                                        (
                                            <>
                                                <HugeiconsIcon icon={Ticket} size={48} className="mx-auto text-gray-300 mb-4" />
                                                <p className="text-gray-500 font-medium">Tiket tidak ditemukan. Nantikan informasi selanjutnya</p>
                                            </>
                                        )
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="s&k" className="py-8">
                                <h3 className="text-xl font-bold text-[#002558] mb-4">Syarat & Ketentuan</h3>
                                <HTMLRenderer html={event.terms_and_conditions as string} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <EventDetailSummaryCard
                        event={event}
                        priceStartFrom={priceStartFrom}
                    />
                </div>
            </section>

            <BottomDrawer
                event={event}
                priceStartFrom={priceStartFrom}
            />
        </div>
    );
}