import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const ASSETS_DIR = join(process.cwd(), 'src', 'assets');

async function convertToWebP() {
  try {
    // Read all files in the assets directory
    const files = await readdir(ASSETS_DIR);

    // Filter for PNG files
    const pngFiles = files.filter((file) =>
      file.toLowerCase().endsWith('.png'),
    );

    console.log(`Found ${pngFiles.length} PNG files to convert`);

    // Convert each PNG file to WebP
    for (const file of pngFiles) {
      const inputPath = join(ASSETS_DIR, file);
      const outputPath = join(ASSETS_DIR, file.replace(/\.png$/i, '.webp'));

      console.log(`Converting ${file} to WebP...`);

      await sharp(inputPath)
        .webp({ quality: 80 }) // You can adjust the quality (0-100)
        .toFile(outputPath);

      console.log(`Successfully converted ${file} to WebP`);
    }

    console.log('All conversions completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

convertToWebP();
