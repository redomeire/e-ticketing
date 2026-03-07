<x-mail::message>
    # Pembayaran Gagal 😥

    Halo **{{ $user->name ?? 'Pelanggan' }}**,

    Kami ingin menginformasikan bahwa pembayaran Anda untuk tagihan **#{{ $order->invoice_id }}** tidak berhasil
    diproses. Ini bisa disebabkan oleh beberapa hal, seperti:
    * **Dana tidak mencukupi**
    * **Kesalahan teknis** pada bank penerbit
    * **Batas waktu pembayaran** yang telah habis

    ---

    ### Detail Tagihan

    * **Nomor Tagihan:** {{ $order->id }}
    * **Tanggal Transaksi:** {{ $order->created_at->format('d M Y, H:i') }} WIB
    * **Total Tagihan:** Rp{{ number_format($order_item->amount, 0, ',', '.') }}

    Jika Anda merasa ini adalah kesalahan atau memiliki pertanyaan, mohon hubungi tim dukungan kami dengan menyertakan
    nomor tagihan Anda.

    Hormat kami,
    **{{ config('app.name') }}**
</x-mail::message>