"use client";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
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
import { useGetEvents } from "@/modules/event/hooks/useEventRepository";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const pageQuery = searchParams.get("page") || "1";
    const limitQuery = searchParams.get("limit") || "10";

    const { data: events, isPending, isError, error } = useGetEvents({
        options: {
            params: {
                page: parseInt(pageQuery, 10),
                limit: parseInt(limitQuery, 10),
                search: searchQuery
            }
        }
    }, {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });
    const setParams = (param: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(Object.keys(param)[0], Object.values(param)[0].toString());
        router.push(`?${newParams.toString()}`);
    }
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-12">
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
                        <Select onValueChange={(val) => {
                            setParams({ limit: val });
                        }}>
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
                <QueryStateHandler
                    data={events?.data.data}
                    isPending={isPending}
                    isError={isError}
                    error={error as unknown as Error}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {events?.data.data.map((event) => (
                            <Link key={event.id} href={`/event/${event.slug}`}>
                                <EventCard
                                    event={event}
                                    ticketCategories={event.ticket_categories}
                                />
                            </Link>
                        ))}
                    </div>
                </QueryStateHandler>
                <Pagination className="mt-10">
                    <PaginationContent>
                        {
                            events?.data.links &&
                            events?.data.links.length > 0 &&
                            events?.data.links.map((link, index) => {
                                if (link.label.includes("Previous")) {
                                    return (
                                        <PaginationPrevious key={index} href="#" className="cursor-not-allowed opacity-50">
                                            Previous
                                        </PaginationPrevious>
                                    )
                                }
                                else if (link.label.includes("Next")) {
                                    return (
                                        <PaginationNext key={index} href="#" className="cursor-not-allowed opacity-50">
                                            Next
                                        </PaginationNext>
                                    )
                                }
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={`?${new URLSearchParams({
                                                ...Object.fromEntries(searchParams.entries()),
                                                page: link.page ? link.page.toString() : pageQuery
                                            }).toString()}`}
                                            isActive={link.active}
                                            className={link.active ? "bg-blue-600 text-white hover:bg-blue-400" : ""}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })
                        }
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Memuat halaman...</p>
            </div>
        }>
            <PageContent />
        </Suspense>
    )
}