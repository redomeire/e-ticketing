"use client";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";
import UpdateProfileForm from "@/modules/profile/components/form/UpdateProfileForm";
import { useGetProfile } from "@/modules/profile/hooks/useProfileRepository";

export default function StandardProfilePage() {
    const {
        data: profile,
        isPending,
        isError
    } = useGetProfile({}, {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-black text-[#002558]">Pengaturan Profil</h1>
                <p className="text-slate-500 font-medium">Kelola informasi personal kamu untuk keperluan verifikasi dan akun.</p>
            </div>

            <QueryStateHandler
                data={profile?.data}
                isPending={isPending}
                isError={isError}
            >
                {profile?.data && <UpdateProfileForm profile={profile?.data} />}
            </QueryStateHandler>
        </div>
    );
}