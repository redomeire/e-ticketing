import UserAside from "@/modules/user/components/aside/UserAside";

interface Props {
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    return (
        <div className="min-h-screen bg-[#f4f2ee] font-sans pb-20">
            <div className="pt-10 md:px-20 px-5 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <UserAside />
                <main className="lg:col-span-3 space-y-8">
                    {props.children}
                </main>
            </div>
        </div>
    );
}