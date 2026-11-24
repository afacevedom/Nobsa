/**
 * Script opcional para convertir tus imágenes locales de public/imagenes/ a formato WebP.
 * Requiere tener sharp instalado temporalmente:
 *   npm i -D sharp && node scripts/optimize-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const IMG_DIR = path.resolve(process.cwd(), 'public/imagenes');

async function run() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.log('Para optimizar imágenes a WebP instala sharp: npm i -D sharp');
    process.exit(0);
  }

  const files = fs.readdirSync(IMG_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
  if (files.length === 0) {
    console.log('No se encontraron archivos .jpg/.png en public/imagenes/.');
    return;
  }

  for (const file of files) {
    const input = path.join(IMG_DIR, file);
    const output = path.join(IMG_DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    await sharp(input)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(output);
    console.log('Generado:', path.basename(output));
  }
}

run();
