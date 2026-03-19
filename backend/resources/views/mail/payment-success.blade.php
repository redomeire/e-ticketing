<x-mail::message>
    Pesanan Dikirim! 🎉
    Halo {{ $user->name ?? 'Pelanggan' }},

    Pesanan Anda telah berhasil diproses. Kami berharap Anda menyukainya!

    Rincian Pesanan
    Nomor Pesanan: {{ $order->invoice_id }}
    Tanggal Kirim: {{ now()->format('d M Y') }}
    Metode Pembayaran: {{ $payment->payment_method }}
    Channel Pembayaran: {{ $payment->payment_channel }}
    <br>
    Terima kasih,
    PayTrack
</x-mail::message>