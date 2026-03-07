import { HugeiconsIcon } from "@hugeicons/react";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube
} from '@hugeicons/core-free-icons';

const footer_sections = [
    {
        title: "Tentang Loket",
        links: ["Tentang Kami", "Biaya", "Blog", "Karir", "Kebijakan Privasi"]
    },
    {
        title: "Rayakan Eventmu",
        links: ["Cara Menjual Tiket", "LOKET Screen", "LOKET X", "LOKET Plus", "Distribusi Tiket"]
    },
    {
        title: "Pusat Bantuan",
        links: ["Cek Status Tiket", "Hubungi Kami", "FAQ", "Syarat & Ketentuan"]
    }
];

export default function Footer() {
    return (
        <footer className="bg-[#002558] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black italic tracking-tighter">LOKET</h2>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            Platform manajemen event dan penjualan tiket terpercaya di Indonesia. Rayakan momen serumu bersama kami.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <HugeiconsIcon icon={Icon} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    {footer_sections.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-lg font-bold">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
                    <p>© 2026 PT Global Tiket Network. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <span>Bagian dari Blibli Tiket Group</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}