import { put } from '@vercel/blob';

export default async function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, author, code } = request.body;

    // Buat nama file yang unik berdasarkan waktu
    const filename = `snippets/${Date.now()}-${author}.json`;
    
    // Simpan data sebagai file JSON di Vercel Blob
    const blob = await put(filename, JSON.stringify({ email, author, code, stars: 0 }), {
      access: 'public',
      contentType: 'application/json',
    });

    // Kirim kembali respons sukses
    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to save snippet.' });
  }
}