"use client";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import EventCard from "@/modules/event/components/card/EventCard";
import Link from "next/link";

const event_list = [
    {
        id: 1,
        title: "TEDxBandung 2026: Ideas Worth Spreading",
        date: "25 Apr 2026, 19:00",
        location: "ICE BSD Hall 10, Tangerang",
        price: "Rp 150.000",
        organizer: "TEDxBandung",
        image_url: "https://images.unsplash.com/photo-1772090049995-6116febe0d60?q=80&w=735&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Java Jazz Festival 2026 - Special Show",
        date: "02 Mei 2026, 15:00",
        location: "JIExpo Kemayoran, Jakarta",
        price: "Rp 750.000",
        organizer: "Java Festival Prod.",
        image_url: "https://images.unsplash.com/flagged/photo-1569231290377-072234d3ee57?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        title: "Happy Music: NFT & Royalty Workshop",
        date: "10 Jun 2026, 10:00",
        location: "Gedung Filateli, Jakarta",
        price: "Rp 50.000",
        organizer: "Happy Music Project",
        image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Brawijaya IT Conference: Future of AI",
        date: "15 Jul 2026, 08:00",
        location: "Universitas Brawijaya, Malang",
        price: "Gratis",
        organizer: "FILKOM UB",
        image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
    }
];

export default function Page() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#002558] tracking-tight">
                            Featured Events
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Temukan berbagai event seru dan inspiratif di sekitarmu.
                        </p>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-45 border-blue-600 ring-blue-600">
                                <SelectValue placeholder="Items per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10 per page</SelectItem>
                                    <SelectItem value="20">20 per page</SelectItem>
                                    <SelectItem value="50">50 per page</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {event_list.map((event) => (
                        <Link href={`/event/${event.id}`} key={event.id} className="block">
                            <EventCard
                                title={event.title}
                                date={event.date}
                                location={event.location}
                                price={event.price}
                                organizer={event.organizer}
                                image_url={event.image_url}
                            />
                        </Link>
                    ))}
                </div>
                <Pagination className="mt-10">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive className="bg-blue-600 text-white hover:bg-blue-400">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}