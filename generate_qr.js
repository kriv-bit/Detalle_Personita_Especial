import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL default or passed via argument
const targetUrl = process.argv[2] || 'https://shofis-josa.netlify.app';
const outputPng = path.join(__dirname, 'qr_dulce_shofis.png');
const outputSvg = path.join(__dirname, 'qr_dulce_shofis.svg');

async function generate() {
  console.log(`Generando QR de alta resolución para: ${targetUrl}`);

  // High quality PNG for printing
  await QRCode.toFile(outputPng, targetUrl, {
    errorCorrectionLevel: 'H', // High error tolerance for small prints
    type: 'png',
    margin: 2,
    width: 1024,
    color: {
      dark: '#0369a1', // Beautiful deep sky blue matching the palette
      light: '#ffffff'
    }
  });

  // Vector SVG for perfect sharpness
  const svgString = await QRCode.toString(targetUrl, {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin: 2,
    color: {
      dark: '#0369a1',
      light: '#ffffff'
    }
  });
  fs.writeFileSync(outputSvg, svgString);

  console.log(`✅ QR generado con éxito:`);
  console.log(`   PNG (1024px): ${outputPng}`);
  console.log(`   SVG:          ${outputSvg}`);
}

generate().catch(console.error);
