import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetUrl = 'https://kriv-bit.github.io/Detalle_Personita_Especial/';
const outputIndividualPdf = path.join(__dirname, 'sticker_qr_5x5cm.pdf');
const outputSheetPdf = path.join(__dirname, 'plantilla_imprimir_stickers_5x5cm.pdf');
const qrTempPng = path.join(__dirname, 'temp_qr_for_pdf.png');

async function createPDFs() {
  console.log(`Generando QR para URL: ${targetUrl}`);

  // Generate high-res QR PNG for embedding in PDF
  await QRCode.toFile(qrTempPng, targetUrl, {
    errorCorrectionLevel: 'H',
    width: 600,
    margin: 1,
    color: {
      dark: '#0284c7', // Sky blue dark tone
      light: '#ffffff'
    }
  });

  // 1 cm = 28.3465 points
  const cmToPt = 28.3465;
  const boxSize = 5 * cmToPt; // ~141.73 pt

  // ==========================================
  // 1. PDF INDIVIDUAL (Página exacta de 5x5 cm)
  // ==========================================
  const docSingle = new PDFDocument({
    size: [boxSize, boxSize],
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  const writeStreamSingle = fs.createWriteStream(outputIndividualPdf);
  docSingle.pipe(writeStreamSingle);

  drawSticker(docSingle, 0, 0, boxSize);
  docSingle.end();

  // ========================================================
  // 2. PLANTILLA LISTA PARA IMPRIMIR (Hoja A4 con 6 stickers)
  // ========================================================
  const docSheet = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });
  const writeStreamSheet = fs.createWriteStream(outputSheetPdf);
  docSheet.pipe(writeStreamSheet);

  docSheet.fontSize(14).fillColor('#0f172a').text('Plantilla de Stickers QR (5 x 5 cm)', { align: 'center' });
  docSheet.fontSize(9).fillColor('#64748b').text('Imprimir en escala 100% (tamaño real). Cortar por las líneas punteadas.', { align: 'center' });
  docSheet.moveDown(1.5);

  const startX = 80;
  const startY = 100;
  const gapX = 30;
  const gapY = 25;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const x = startX + col * (boxSize + gapX);
      const y = startY + row * (boxSize + gapY);
      drawSticker(docSheet, x, y, boxSize, true);
    }
  }

  docSheet.end();

  // Clean temp file when done
  writeStreamSheet.on('finish', () => {
    if (fs.existsSync(qrTempPng)) fs.unlinkSync(qrTempPng);
    console.log(`✅ PDFs generados con éxito:`);
    console.log(`   1. Individual (5x5 cm): ${outputIndividualPdf}`);
    console.log(`   2. Hoja A4 con copias:   ${outputSheetPdf}`);
  });
}

function drawSticker(doc, x, y, size, drawCutBorder = false) {
  // Background card
  doc.save();
  
  if (drawCutBorder) {
    // Dashed cut guide around the box
    doc.dash(3, { space: 3 })
       .strokeColor('#94a3b8')
       .lineWidth(0.8)
       .rect(x, y, size, size)
       .stroke();
    doc.undash();
  }

  // Inner card background
  const padding = 6;
  const innerX = x + padding;
  const innerY = y + padding;
  const innerSize = size - padding * 2;

  doc.roundedRect(innerX, innerY, innerSize, innerSize, 8)
     .fillColor('#f0f9ff')
     .fill();

  doc.roundedRect(innerX, innerY, innerSize, innerSize, 8)
     .strokeColor('#7dd3fc')
     .lineWidth(1)
     .stroke();

  // Header Title: "Escanea el QR :3"
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .fillColor('#0369a1')
     .text('Escanea el QR :3', innerX, innerY + 10, {
       width: innerSize,
       align: 'center'
     });

  // Centered QR Image
  const qrDisplaySize = innerSize - 34;
  const qrX = innerX + (innerSize - qrDisplaySize) / 2;
  const qrY = innerY + 28;

  doc.image(qrTempPng, qrX, qrY, {
    width: qrDisplaySize,
    height: qrDisplaySize
  });

  doc.restore();
}

createPDFs().catch(console.error);
