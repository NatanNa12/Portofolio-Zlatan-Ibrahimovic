import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // 1. Baca file metadata projects.json
  const filePath = path.join(process.cwd(), 'projects.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const projectsMeta = JSON.parse(fileContents);
  
  const githubToken = process.env.GITHUB_TOKEN;

  // 2. Ambil data detail dari GitHub API untuk setiap proyek
  const projectsData = await Promise.all(
    projectsMeta.map(async (meta) => {
      const repoRes = await fetch(`https://api.github.com/repos/${meta.repo}`, {
        headers: { 'Authorization': `token ${githubToken}` },
      });
      const repoData = await repoRes.json();
      
      let snippet = null;
      if (meta.isPrivate && meta.snippetFile) {
        // Ambil cuplikan kode untuk repo privat
        const snippetRes = await fetch(`https://api.github.com/repos/${meta.repo}/contents/${meta.snippetFile}`, {
          headers: { 'Authorization': `token ${githubToken}` },
        });
        const snippetData = await snippetRes.json();
        if (snippetData.content) {
          snippet = Buffer.from(snippetData.content, 'base64').toString('utf8').split('\n').slice(0, 10).join('\n');
        }
      }

      return {
        ...meta,
        name: repoData.name,
        description: repoData.description,
        url: repoData.html_url,
        snippet: snippet,
      };
    })
  );

  res.status(200).json(projectsData);
}