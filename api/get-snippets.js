import { list } from '@vercel/blob';

export default async function handler(request, response) {
  try {
    // Ambil daftar semua file dari Vercel Blob
    const { blobs } = await list();

    // Ambil konten dari setiap file blob
    const snippets = await Promise.all(
      blobs.map(async (blob) => {
        const blobResponse = await fetch(blob.url);
        return blobResponse.json(); // Ubah konten file menjadi objek JSON
      })
    );

    // Kirim semua data snippet sebagai respons
    return response.status(200).json(snippets);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch snippets.' });
  }
}

// Konfigurasi tambahan agar fungsi tidak timeout saat mengambil banyak data
export const config = {
  maxDuration: 30,
};