import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

interface Props {
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    return (
        <>
            <Header />
            <main>{props.children}</main>
            <Footer />
        </>
    );
}