import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Ensure public and photos directories exist
  const publicDir = path.join(__dirname, 'public');
  const photosDir = path.join(publicDir, 'photos');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });

  // Increased body limit for high-res photo and audio base64 uploads
  app.use(express.json({ limit: '75mb' }));
  app.use(express.urlencoded({ limit: '75mb', extended: true }));

  // Serve static files from public
  app.use(express.static(publicDir));

  // --- API Endpoints for permanent media storage ---

  // Check which photos and music exist on server
  app.get('/api/media-status', (req, res) => {
    try {
      const musicExists = fs.existsSync(path.join(publicDir, 'music.mp3'));
      const giftExists = fs.existsSync(path.join(publicDir, 'gift.jpg'));
      const lizardExists = fs.existsSync(path.join(publicDir, 'lizard.jpg'));
      const savedSlots: number[] = [];

      for (let i = 1; i <= 40; i++) {
        if (
          fs.existsSync(path.join(photosDir, `photo-${i}.jpg`)) ||
          fs.existsSync(path.join(photosDir, `photo-${i}.webp`)) ||
          fs.existsSync(path.join(photosDir, `photo-${i}.png`))
        ) {
          savedSlots.push(i);
        }
      }

      res.json({
        music: musicExists,
        gift: giftExists,
        lizard: lizardExists,
        photos: savedSlots,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to check media status' });
    }
  });

  // Save audio file (Malang Sajna)
  app.post('/api/upload-music', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No audio data provided' });
      }

      // Extract base64
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : dataUrl;
      const buffer = Buffer.from(base64Data, 'base64');

      const targetPath = path.join(publicDir, 'music.mp3');
      fs.writeFileSync(targetPath, buffer);

      res.json({ success: true, message: 'Music saved successfully to public/music.mp3' });
    } catch (err) {
      console.error('Error saving music:', err);
      res.status(500).json({ error: 'Failed to save music' });
    }
  });

  // Download music from Google Drive or direct URL
  app.post('/api/download-drive-music', async (req, res) => {
    try {
      let { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
      }

      // Convert Google Drive link to direct download link if needed
      const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (driveMatch) {
        const fileId = driveMatch[1];
        url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (!response.ok) {
        return res.status(400).json({ error: `Failed to download: status ${response.status}` });
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const targetPath = path.join(publicDir, 'music.mp3');
      fs.writeFileSync(targetPath, buffer);

      res.json({ success: true, message: 'Music downloaded and saved successfully!' });
    } catch (err) {
      console.error('Error downloading music from URL:', err);
      res.status(500).json({ error: 'Failed to download audio from URL' });
    }
  });

  // Save photo slot (1 to 40)
  app.post('/api/upload-photo', (req, res) => {
    try {
      const { slot, dataUrl } = req.body;
      if (!slot || !dataUrl) {
        return res.status(400).json({ error: 'Missing slot or dataUrl' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : dataUrl;
      const buffer = Buffer.from(base64Data, 'base64');

      const targetPath = path.join(photosDir, `photo-${slot}.jpg`);
      fs.writeFileSync(targetPath, buffer);

      res.json({ success: true, slot, message: `Photo ${slot} saved successfully` });
    } catch (err) {
      console.error('Error saving photo:', err);
      res.status(500).json({ error: 'Failed to save photo' });
    }
  });

  // Save special asset (gift / lizard)
  app.post('/api/upload-asset', (req, res) => {
    try {
      const { key, dataUrl } = req.body;
      if (!key || !dataUrl) {
        return res.status(400).json({ error: 'Missing key or dataUrl' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : dataUrl;
      const buffer = Buffer.from(base64Data, 'base64');

      const filename = key === 'lizard' ? 'lizard.jpg' : key === 'gift' ? 'gift.jpg' : 'love-letter.jpg';
      const targetPath = path.join(publicDir, filename);
      fs.writeFileSync(targetPath, buffer);

      res.json({ success: true, key, message: `${key} saved successfully` });
    } catch (err) {
      console.error('Error saving asset:', err);
      res.status(500).json({ error: 'Failed to save asset' });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
