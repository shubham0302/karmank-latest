import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Apply vintage print styling for PDF export - dark brown text on parchment
 */
const applyVintagePrintStyles = (element) => {
  // Create and inject style element for PDF export
  const styleId = 'pdf-export-vintage-styles';
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = `
    /* Force white background for body and html during PDF export */
    body.pdf-exporting,
    html {
      background-color: white !important;
      background: white !important;
    }

    /* Hide screen-only content during PDF export */
    .pdf-exporting .screen-only-content {
      display: none !important;
    }

    /* Show print-only content during PDF export */
    .pdf-exporting .print-only-content {
      display: block !important;
    }

    /* Legacy support - Hide elements marked as print:hidden during PDF export */
    .pdf-exporting .print\\:hidden {
      display: none !important;
    }

    /* Legacy support - Show elements marked as hidden print:block during PDF export */
    .pdf-exporting .hidden.print\\:block {
      display: block !important;
    }

    /* PDF Export Vintage Brown Styling */
    .pdf-exporting,
    .pdf-exporting * {
      color: #4A2F18 !important; /* Dark brown like greeting page */
      border-color: #4A2F18 !important; /* Brown borders */
      background: transparent !important; /* Remove all backgrounds */
    }

    /* Compact font sizes for readability */
    .pdf-exporting {
      font-size: 18px !important; /* Base font size +2px */
      line-height: 1.5 !important; /* Tighter line spacing */
    }

    .pdf-exporting p {
      font-size: 18px !important;
      line-height: 1.5 !important;
      margin-bottom: 10px !important; /* Reduced spacing */
    }

    .pdf-exporting li {
      font-size: 18px !important;
      line-height: 1.4 !important;
      margin-bottom: 6px !important; /* Reduced spacing */
    }

    /* Preserve specific background for better readability */
    .pdf-exporting .bg-white,
    .pdf-exporting .bg-cyan-500,
    .pdf-exporting .bg-purple-500,
    .pdf-exporting .bg-gradient-to-r {
      background: rgba(245, 237, 220, 0.3) !important; /* Light parchment tint */
    }

    /* Tables - brown styling with compact font */
    .pdf-exporting table,
    .pdf-exporting table * {
      color: #4A2F18 !important;
      border-color: #4A2F18 !important;
      font-size: 17px !important;
    }

    .pdf-exporting th {
      background: rgba(139, 90, 43, 0.15) !important; /* Light brown header */
      font-weight: bold !important;
      font-size: 18px !important;
      padding: 8px !important;
    }

    .pdf-exporting td {
      padding: 6px !important;
    }

    .pdf-exporting tr:nth-child(even) {
      background: rgba(245, 237, 220, 0.3) !important; /* Alternating rows */
    }

    /* Headings - Times serif font with compact sizes */
    .pdf-exporting h1 {
      color: #4A2F18 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 25px !important;
      line-height: 1.3 !important;
      margin-bottom: 12px !important;
    }

    .pdf-exporting h2 {
      color: #4A2F18 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 23px !important;
      line-height: 1.3 !important;
      margin-bottom: 10px !important;
    }

    .pdf-exporting h3 {
      color: #4A2F18 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 21px !important;
      line-height: 1.3 !important;
      margin-bottom: 8px !important;
    }

    .pdf-exporting h4 {
      color: #4A2F18 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 19px !important;
      line-height: 1.3 !important;
      margin-bottom: 8px !important;
    }

    .pdf-exporting h5,
    .pdf-exporting h6 {
      color: #4A2F18 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 18px !important;
      line-height: 1.3 !important;
      margin-top: 8px !important;
      margin-bottom: 6px !important;
    }

    /* Ancient Kundli Grid Styling - Compact */
    .pdf-exporting .grid.grid-cols-3 {
      background: linear-gradient(135deg, rgba(139, 90, 43, 0.1), rgba(101, 67, 33, 0.1)) !important;
      border: 2px solid #8B5A2B !important;
      border-radius: 3px !important;
      padding: 5px !important;
      box-shadow:
        inset 0 0 15px rgba(139, 90, 43, 0.15),
        0 3px 8px rgba(74, 47, 24, 0.2) !important;
    }

    .pdf-exporting .grid.grid-cols-3 > div {
      background: rgba(245, 237, 220, 0.8) !important;
      border: 1.5px solid #4A2F18 !important;
      border-radius: 2px !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-weight: bold !important;
      font-size: 23px !important;
      color: #4A2F18 !important;
      padding: 10px !important;
      min-height: 45px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: relative !important;
      box-shadow:
        inset 0 0 6px rgba(139, 90, 43, 0.1),
        0 2px 3px rgba(74, 47, 24, 0.15) !important;
    }

    /* Ancient decorative corners for kundli cells */
    .pdf-exporting .grid.grid-cols-3 > div::before {
      content: '✦' !important;
      position: absolute !important;
      top: 4px !important;
      left: 4px !important;
      font-size: 10px !important;
      color: #8B5A2B !important;
      opacity: 0.5 !important;
    }

    .pdf-exporting .grid.grid-cols-3 > div::after {
      content: '✦' !important;
      position: absolute !important;
      bottom: 4px !important;
      right: 4px !important;
      font-size: 10px !important;
      color: #8B5A2B !important;
      opacity: 0.5 !important;
    }

    /* Remove shadows and glows */
    .pdf-exporting * {
      box-shadow: none !important;
      text-shadow: none !important;
    }

    /* Re-apply box shadows only for kundli */
    .pdf-exporting .grid.grid-cols-3,
    .pdf-exporting .grid.grid-cols-3 > div {
      box-shadow: inherit !important;
    }

    /* Make icons dark brown */
    .pdf-exporting svg,
    .pdf-exporting svg * {
      color: #654321 !important;
      fill: #654321 !important;
      stroke: #654321 !important;
    }

    /* Compact spacing between sections and cards */
    .pdf-exporting .space-y-3 > * + *,
    .pdf-exporting .space-y-4 > * + *,
    .pdf-exporting .space-y-5 > * + *,
    .pdf-exporting .space-y-6 > * + *,
    .pdf-exporting .space-y-8 > * + * {
      margin-top: 12px !important; /* Reduced spacing */
    }

    /* Compact padding in cards and containers */
    .pdf-exporting .p-4 {
      padding: 10px !important;
    }

    .pdf-exporting .p-6 {
      padding: 12px !important;
    }

    .pdf-exporting .rounded-xl,
    .pdf-exporting .rounded-lg {
      margin-bottom: 12px !important; /* Reduced spacing after cards */
    }

    /* Section spacing */
    .pdf-exporting .bg-gray-900\\/50,
    .pdf-exporting .bg-gray-900\\/60,
    .pdf-exporting .bg-gray-950\\/50 {
      margin-bottom: 14px !important;
    }
  `;

  // Add class to trigger styles
  element.classList.add('pdf-exporting');

  return styleElement;
};

/**
 * Remove vintage print styles after PDF export
 */
const removeVintagePrintStyles = (element, styleElement) => {
  element.classList.remove('pdf-exporting');
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
};

/**
 * Remove height restrictions from scrollable elements before PDF export
 */
const removeHeightRestrictions = (element) => {
  const elementsToExpand = element.querySelectorAll('[style*="max-height"], .max-h-60, .overflow-y-auto, .overflow-auto');
  const originalStyles = new Map();

  elementsToExpand.forEach((el) => {
    // Save original styles
    originalStyles.set(el, {
      maxHeight: el.style.maxHeight,
      overflow: el.style.overflow,
      height: el.style.height,
    });

    // Remove restrictions
    el.style.maxHeight = 'none';
    el.style.overflow = 'visible';
    el.style.height = 'auto';
  });

  return originalStyles;
};

/**
 * Restore original height restrictions
 */
const restoreHeightRestrictions = (originalStyles) => {
  originalStyles.forEach((styles, el) => {
    el.style.maxHeight = styles.maxHeight;
    el.style.overflow = styles.overflow;
    el.style.height = styles.height;
  });
};

/**
 * Load and convert embossed seal image to base64
 */
let embossedSealDataUrl = null;

const loadEmbossedSeal = async () => {
  if (embossedSealDataUrl) return embossedSealDataUrl;

  try {
    const response = await fetch('/seal-karmank.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        embossedSealDataUrl = reader.result;
        resolve(embossedSealDataUrl);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load seal:', error);
    return null;
  }
};

/**
 * Draw embossed seal on PDF
 */
const drawEmbossedSeal = (pdf, x, y, size, sealImage) => {
  if (!sealImage) return;

  pdf.saveGraphicsState();

  // Draw the embossed seal image
  pdf.addImage(sealImage, 'PNG', x - size/2, y - size/2, size, size);

  pdf.restoreGraphicsState();
};

/**
 * Add vintage ornate border to PDF page
 */
const addDecorativeBorder = (pdf) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;

  pdf.saveGraphicsState();

  // Outer border - Dark brown
  pdf.setDrawColor(74, 47, 24); // Dark brown #4A2F18
  pdf.setLineWidth(1.2);
  pdf.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));

  // Inner decorative line - Medium brown
  pdf.setDrawColor(101, 67, 33); // Medium brown #654321
  pdf.setLineWidth(0.5);
  pdf.rect(margin + 2, margin + 2, pageWidth - (margin * 2) - 4, pageHeight - (margin * 2) - 4);

  // Inner-most fine line - Lighter brown
  pdf.setDrawColor(139, 90, 43); // Lighter brown #8B5A2B
  pdf.setLineWidth(0.3);
  pdf.rect(margin + 4, margin + 4, pageWidth - (margin * 2) - 8, pageHeight - (margin * 2) - 8);

  // Corner ornaments (simple decorative squares)
  const cornerSize = 3;
  const offset = margin + 1;

  pdf.setFillColor(101, 67, 33); // Medium brown
  // Top-left corner
  pdf.rect(offset, offset, cornerSize, cornerSize, 'F');
  // Top-right corner
  pdf.rect(pageWidth - offset - cornerSize, offset, cornerSize, cornerSize, 'F');
  // Bottom-left corner
  pdf.rect(offset, pageHeight - offset - cornerSize, cornerSize, cornerSize, 'F');
  // Bottom-right corner
  pdf.rect(pageWidth - offset - cornerSize, pageHeight - offset - cornerSize, cornerSize, cornerSize, 'F');

  pdf.restoreGraphicsState();
};

/**
 * Add vintage KarmAnk watermark and branding to PDF page
 */
const addWatermark = (pdf, pageNumber, totalPages, sealImage) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;

  // Add decorative border
  addDecorativeBorder(pdf);

  // Add semi-transparent diagonal watermark in center - vintage brown
  pdf.saveGraphicsState();
  pdf.setGState(new pdf.GState({ opacity: 0.04 }));
  pdf.setFontSize(70);
  pdf.setTextColor(74, 47, 24); // Dark brown
  pdf.setFont('times', 'bolditalic');

  // Center and rotate the watermark
  pdf.text('KarmAnk™', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
  });

  pdf.restoreGraphicsState();

  // === HEADER SECTION ===
  pdf.saveGraphicsState();

  // Vintage header with ornate divider
  const headerY = margin + 12;

  // KarmAnk™ logo text in vintage serif
  pdf.setFontSize(22);
  pdf.setTextColor(74, 47, 24); // Dark brown
  pdf.setFont('times', 'bold');
  const centerX = pageWidth / 2;
  pdf.text('KarmAnk™', centerX, headerY, { align: 'center', baseline: 'middle' });

  // Tagline in elegant script - centered (2px gap = ~0.7mm)
  pdf.setFontSize(9);
  pdf.setTextColor(101, 67, 33); // Medium brown
  pdf.setFont('times', 'italic');
  pdf.text('Vedic Numerology System', centerX, headerY + 5.7, { align: 'center', baseline: 'alphabetic', maxWidth: pageWidth - 40 });

  // Decorative horizontal line below header
  pdf.setDrawColor(139, 90, 43); // Lighter brown
  pdf.setLineWidth(0.5);
  const lineY = headerY + 8;
  pdf.line(margin + 30, lineY, pageWidth - margin - 30, lineY);

  // Small ornamental dots
  pdf.setFillColor(101, 67, 33);
  pdf.circle(margin + 28, lineY, 0.8, 'F');
  pdf.circle(pageWidth - margin - 28, lineY, 0.8, 'F');

  pdf.restoreGraphicsState();

  // === FOOTER SECTION ===
  pdf.saveGraphicsState();

  const footerY = pageHeight - margin - 12;

  // Decorative horizontal line above footer
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  const footerLineY = footerY - 8;
  pdf.line(margin + 30, footerLineY, pageWidth - margin - 30, footerLineY);

  // Small ornamental dots
  pdf.setFillColor(101, 67, 33);
  pdf.circle(margin + 28, footerLineY, 0.8, 'F');
  pdf.circle(pageWidth - margin - 28, footerLineY, 0.8, 'F');

  // Bottom left corner - KarmAnk Seal (larger and prominent)
  if (sealImage) {
    const sealSize = 18; // Larger seal size
    const sealX = margin + sealSize/2 + 2;
    const sealY = pageHeight - margin - sealSize/2 - 2;
    drawEmbossedSeal(pdf, sealX, sealY, sealSize, sealImage);
  }

  // Center - Report info in vintage style
  pdf.setFontSize(9);
  pdf.setTextColor(101, 67, 33); // Medium brown
  pdf.setFont('times', 'italic');
  const centerText = `Vedic Numerology Report`;
  pdf.text(centerText, pageWidth / 2, footerY - 2, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setTextColor(139, 90, 43); // Lighter brown
  pdf.setFont('times', 'normal');
  const dateText = `Generated ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`;
  pdf.text(dateText, pageWidth / 2, footerY + 2, { align: 'center' });

  // Right side - Page numbers with ornate styling
  pdf.setFontSize(10);
  pdf.setTextColor(74, 47, 24); // Dark brown
  pdf.setFont('times', 'bold');

  const pageText = `${pageNumber}`;
  pdf.text(pageText, pageWidth - margin - 15, footerY, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'italic');
  pdf.text(`of ${totalPages}`, pageWidth - margin - 15, footerY + 4, { align: 'center' });

  pdf.restoreGraphicsState();
};

/**
 * Export the numerology report to PDF
 * @param {string} elementId - ID of the element to capture
 * @param {string} fileName - Name of the PDF file
 * @param {object} options - Additional options
 */
export const exportToPDF = async (elementId, fileName = 'KarmAnk_Report.pdf', options = {}) => {
  try {
    console.log('📄 Starting PDF export for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('❌ Element not found:', elementId);
      throw new Error(`Element with ID '${elementId}' not found`);
    }
    console.log('✅ Element found:', element);

    // Load embossed seal
    const sealImage = await loadEmbossedSeal();

    // Apply vintage print styles for dark brown text
    const styleElement = applyVintagePrintStyles(element);

    // Make print-only sections visible for PDF capture
    const printOnlySections = element.querySelectorAll('.print-only-content');
    const screenOnlySections = element.querySelectorAll('.screen-only-content');
    console.log('🔍 Found print-only sections:', printOnlySections.length);
    console.log('🔍 Found screen-only sections:', screenOnlySections.length);
    printOnlySections.forEach(el => {
      el.style.display = 'block'; // Explicitly set display
      el.setAttribute('data-was-hidden', 'true');
    });
    screenOnlySections.forEach(el => {
      el.style.display = 'none';
      el.setAttribute('data-was-screen-only', 'true');
    });

    // Remove height restrictions to capture all content
    const originalStyles = removeHeightRestrictions(element);

    // Wait for DOM to update with new styles (longer wait for complex content like Forecast tab)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for page break elements
    const pageBreakElements = element.querySelectorAll('.pdf-page-break-after');
    console.log('🔍 Found page break elements:', pageBreakElements.length);

    if (pageBreakElements.length > 0) {
      // Use page-break-aware rendering
      const result = await exportToPDFWithPageBreaks(element, pageBreakElements, fileName, sealImage, options.userName);

      // Clean up styles
      removeVintagePrintStyles(element, styleElement);

      // Restore print-only and screen-only sections
      printOnlySections.forEach(el => {
        if (el.getAttribute('data-was-hidden')) {
          el.classList.add('hidden');
          el.removeAttribute('data-was-hidden');
        }
      });
      screenOnlySections.forEach(el => {
        if (el.getAttribute('data-was-screen-only')) {
          el.style.display = '';
          el.removeAttribute('data-was-screen-only');
        }
      });

      return result;
    }

    // Configuration for html2canvas (fallback for no page breaks)
    const canvas = await html2canvas(element, {
      scale: 2, // Optimized quality - reduced from 5 to 2 for smaller file size
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Transparent background
      logging: false,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      imageTimeout: 0,
      removeContainer: false,
    });

    // Restore original styles
    restoreHeightRestrictions(originalStyles);
    removeVintagePrintStyles(element, styleElement);

    // Restore print-only and screen-only sections
    printOnlySections.forEach(el => {
      if (el.getAttribute('data-was-hidden')) {
        el.classList.add('hidden');
        el.removeAttribute('data-was-hidden');
      }
    });
    screenOnlySections.forEach(el => {
      if (el.getAttribute('data-was-screen-only')) {
        el.style.display = '';
        el.removeAttribute('data-was-screen-only');
      }
    });

    // Calculate PDF dimensions with margins
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const topMargin = 28; // Space for header
    const bottomMargin = 25; // Space for footer
    const sideMargin = 15; // Left and right margins
    const contentWidth = pageWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = topMargin;
    let pageNumber = 1;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.92); // Changed to JPEG with 92% quality for smaller file size

    // Calculate total pages (add 1 for greeting page)
    const contentPages = Math.ceil(imgHeight / contentHeight);
    const totalPages = contentPages + 1;

    // Add personalized greeting page first
    addGreetingPage(pdf, options.userName || 'Dear Seeker', sealImage);

    // Add new page for content
    pdf.addPage();
    pageNumber = 2; // Start from page 2 after greeting

    // Add vintage background and first content page with watermark and margins
    addVintageBackground(pdf);
    pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
    addWatermark(pdf, pageNumber, totalPages, sealImage);
    heightLeft -= contentHeight;
    pageNumber++;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + topMargin;
      pdf.addPage();
      addVintageBackground(pdf);
      pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
      addWatermark(pdf, pageNumber, totalPages, sealImage);
      heightLeft -= contentHeight;
      pageNumber++;
    }

    // Add metadata
    pdf.setProperties({
      title: 'KarmAnk™ Numerology Report',
      subject: 'Complete Vedic Numerology Analysis',
      author: 'KarmAnk™',
      keywords: 'numerology, vedic, astrology, dasha, kundli',
      creator: 'KarmAnk™ Application'
    });

    // Save the PDF
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Add vintage parchment background to PDF page
 */
const addVintageBackground = (pdf) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Base parchment color - aged cream/beige
  pdf.setFillColor(245, 237, 220); // #F5EDDC - aged parchment
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Add subtle texture with aging spots for vintage feel
  pdf.setGState(new pdf.GState({ opacity: 0.08 }));

  // Lighter cream spots
  pdf.setFillColor(255, 248, 230);
  pdf.circle(pageWidth * 0.15, pageHeight * 0.15, 80, 'F');

  // Slightly darker aged tone spots
  pdf.setFillColor(218, 199, 165);
  pdf.circle(pageWidth * 0.85, pageHeight * 0.85, 90, 'F');

  // Medium aged tone spots
  pdf.setFillColor(235, 222, 195);
  pdf.circle(pageWidth * 0.5, pageHeight * 0.5, 120, 'F');

  // Reset opacity
  pdf.setGState(new pdf.GState({ opacity: 1 }));
};

/**
 * Add personalized greeting page at the beginning of the PDF
 */
const addGreetingPage = (pdf, userName, sealImage) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add vintage background
  addVintageBackground(pdf);

  // Add decorative border
  addDecorativeBorder(pdf);

  pdf.saveGraphicsState();

  // Large ornamental seal at the top
  if (sealImage) {
    const sealSize = 45;
    drawEmbossedSeal(pdf, pageWidth / 2, 55, sealSize, sealImage);
  }

  // Main greeting - centered (moved up for compact layout)
  const startY = 108;

  // Decorative line above greeting
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.8);
  pdf.line(40, startY, pageWidth - 40, startY);

  // Ornamental circles instead of unicode stars
  pdf.setFillColor(139, 90, 43);
  pdf.circle(38, startY, 1.2, 'F');
  pdf.circle(pageWidth - 38, startY, 1.2, 'F');

  // Greeting text
  pdf.setFontSize(26);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text('Namaste', pageWidth / 2, startY + 18, { align: 'center' });

  // User name
  pdf.setFontSize(30);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'bolditalic');
  pdf.text(userName || 'Dear Seeker', pageWidth / 2, startY + 36, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  pdf.line(60, startY + 46, pageWidth - 60, startY + 46);

  // Welcome message - consistent font size for all text
  pdf.setFontSize(15);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'italic');

  const welcomeLines = [
    'We are honored to present your personalized',
    'Vedic Numerology Report.',
    '',
    'This ancient wisdom has been carefully analyzed',
    'to illuminate your unique cosmic path.'
  ];

  let currentY = startY + 64;
  welcomeLines.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, currentY + (index * 10), { align: 'center' });
  });

  // 15px gap after "illuminate your unique cosmic path"
  const blessingY = currentY + 40 + 15; // 40 is where last line ends, add 15px gap

  // Blessing text - same size as welcome message
  pdf.setFontSize(15);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'italic');
  pdf.text('May this report guide you towards', pageWidth / 2, blessingY, { align: 'center' });
  pdf.text('prosperity, peace, and self-realization.', pageWidth / 2, blessingY + 11, { align: 'center' });

  pdf.restoreGraphicsState();
};

/**
 * Export PDF with page breaks at specific elements
 * @param {HTMLElement} parentElement - Parent element containing page break elements
 * @param {NodeList} pageBreakElements - Elements with page break class
 * @param {string} fileName - Name of the PDF file
 * @param {string} sealImage - Base64 encoded seal image
 */
const exportToPDFWithPageBreaks = async (parentElement, pageBreakElements, fileName, sealImage, userName) => {
  try {
    console.log('📄 exportToPDFWithPageBreaks called with', pageBreakElements.length, 'elements');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const topMargin = 28;
    const bottomMargin = 25;
    const sideMargin = 15;
    const contentWidth = pageWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    // Remove height restrictions before capturing
    const originalStyles = removeHeightRestrictions(parentElement);
    await new Promise(resolve => setTimeout(resolve, 200));

    // FIRST PASS: Capture all sections and calculate total pages needed
    console.log('🔍 Phase 1: Capturing sections and calculating total pages...');
    const capturedSections = [];
    let totalPagesNeeded = 1; // Start with 1 for greeting page

    for (let i = 0; i < pageBreakElements.length; i++) {
      const pageElement = pageBreakElements[i];
      console.log(`  Capturing section ${i + 1}/${pageBreakElements.length}...`);

      // Capture this page element
      const canvas = await html2canvas(pageElement, {
        scale: 1.5,  // Reduced from 2 to 1.5 for faster rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5EDDC',
        logging: false,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: pageElement.scrollWidth,
        windowHeight: pageElement.scrollHeight,
        imageTimeout: 0,
        removeContainer: false,
      });

    const imgData = canvas.toDataURL('image/jpeg', 0.85);  // Reduced quality from 0.92 to 0.85 for smaller file size
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // Skip sections with invalid dimensions
    if (!canvas.width || !canvas.height || isNaN(imgHeight)) {
      console.warn(`  ⚠️ Section ${i + 1}: Skipped (invalid dimensions - width: ${canvas.width}, height: ${canvas.height})`);
      continue;
    }

    // Calculate how many pages this section needs
    let pagesNeeded = 1;
    if (imgHeight > contentHeight) {
      pagesNeeded = Math.ceil(imgHeight / contentHeight);
    }

    capturedSections.push({
      imgData,
      imgHeight,
      pagesNeeded
    });

    totalPagesNeeded += pagesNeeded;
    console.log(`  Section ${i + 1}: ${pagesNeeded} page(s) needed (height: ${Math.round(imgHeight)}mm)`);
  }

  console.log(`✅ Total pages needed: ${totalPagesNeeded} (including greeting page)`);

  // Add personalized greeting page first
  addGreetingPage(pdf, userName || 'Dear Seeker', sealImage);

  // SECOND PASS: Add all sections to PDF with correct page numbers
  console.log('📄 Phase 2: Generating PDF with correct page numbers...');
  let currentPageNumber = 2; // Start from page 2 after greeting

  for (let i = 0; i < capturedSections.length; i++) {
    const { imgData, imgHeight, pagesNeeded } = capturedSections[i];

    // Add page for content (always add new page after greeting)
    pdf.addPage();
    addVintageBackground(pdf);

    // Check if content fits on one page
    if (imgHeight <= contentHeight) {
      // Content fits on one page - center it vertically
      const verticalOffset = topMargin + (contentHeight - imgHeight) / 4;
      pdf.addImage(imgData, 'JPEG', sideMargin, verticalOffset, contentWidth, imgHeight);
      addWatermark(pdf, currentPageNumber, totalPagesNeeded, sealImage);
      currentPageNumber++;
    } else {
      // Content spans multiple pages - need to slice the image
      // Create a temporary canvas to slice the captured image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      const tempImg = new Image();

      await new Promise((resolve) => {
        tempImg.onload = resolve;
        tempImg.src = imgData;
      });

      const originalWidth = tempImg.width;
      const originalHeight = tempImg.height;

      // Calculate how much original canvas height equals one PDF page
      const pixelsPerPage = (contentHeight / imgHeight) * originalHeight;
      let remainingHeight = originalHeight;
      let sourceY = 0;
      let pageIndex = 0;

      while (remainingHeight > 0) {
        if (pageIndex > 0) {
          pdf.addPage();
          addVintageBackground(pdf);
        }

        // Calculate the slice height for this page
        const sliceHeight = Math.min(pixelsPerPage, remainingHeight);

        // Create a canvas for this page's slice
        tempCanvas.width = originalWidth;
        tempCanvas.height = sliceHeight;

        // Draw the slice from the original image
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(
          tempImg,
          0, sourceY,           // source x, y
          originalWidth, sliceHeight,  // source width, height
          0, 0,                 // dest x, y
          originalWidth, sliceHeight   // dest width, height
        );

        // Convert slice to data URL
        const sliceData = tempCanvas.toDataURL('image/jpeg', 0.92);

        // Calculate the height in mm for this slice
        const sliceHeightMM = (sliceHeight / originalHeight) * imgHeight;

        // Add the slice to the PDF
        pdf.addImage(sliceData, 'JPEG', sideMargin, topMargin, contentWidth, sliceHeightMM);
        addWatermark(pdf, currentPageNumber, totalPagesNeeded, sealImage);

        // Move to next slice
        sourceY += sliceHeight;
        remainingHeight -= sliceHeight;
        currentPageNumber++;
        pageIndex++;
      }
    }

    console.log(`  ✓ Section ${i + 1} added (${pagesNeeded} page(s))`);
  }

  console.log(`✅ PDF generation complete! Total pages: ${totalPagesNeeded}`);

  // Restore original styles
  restoreHeightRestrictions(originalStyles);

  // Add metadata
  pdf.setProperties({
    title: 'KarmAnk™ Numerology Report',
    subject: 'Complete Vedic Numerology Analysis',
    author: 'KarmAnk™',
    keywords: 'numerology, vedic, astrology, dasha, kundli',
    creator: 'KarmAnk™ Application'
  });

  // Save the PDF
  pdf.save(fileName);
  console.log('✅ PDF saved successfully:', fileName);

  return true;
  } catch (error) {
    console.error('❌ Error in exportToPDFWithPageBreaks:', error);
    throw error;
  }
};

/**
 * Export specific tab content to PDF
 * @param {string} tabName - Name of the active tab
 * @param {string} userName - User's name for filename and greeting
 */
export const exportTabToPDF = async (tabName, userName = 'User') => {
  const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedTab = tabName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `KarmAnk_${sanitizedName}_${sanitizedTab}_${new Date().toISOString().split('T')[0]}.pdf`;

  await exportToPDF('report-content', fileName, { userName });
};

/**
 * Export full report (all tabs) to PDF
 * This requires capturing each tab individually and combining them
 * @param {Array} tabs - Array of tab names
 * @param {Function} setActiveTab - Function to change active tab
 * @param {string} userName - User's name for filename
 */
export const exportFullReportToPDF = async (tabs, setActiveTab, userName = 'User') => {
  try {
    const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `KarmAnk_${sanitizedName}_Full_Report_${new Date().toISOString().split('T')[0]}.pdf`;

    // Load embossed seal
    const sealImage = await loadEmbossedSeal();

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    let globalPageNumber = 1;
    const allCanvases = [];

    // First pass: capture all tabs
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];

      // Switch to the tab
      setActiveTab(tab);

      // Wait for tab content to render
      await new Promise(resolve => setTimeout(resolve, 1500));

      const element = document.getElementById('report-content');
      if (!element) continue;

      // Apply vintage print styles for dark brown text
      const styleElement = applyVintagePrintStyles(element);

      // Make print-only sections visible for PDF capture
      const printOnlySections = element.querySelectorAll('.print-only-content');
      const screenOnlySections = element.querySelectorAll('.screen-only-content');
      printOnlySections.forEach(el => {
        el.style.display = 'block';
        el.setAttribute('data-was-hidden', 'true');
      });
      screenOnlySections.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('data-was-screen-only', 'true');
      });

      // Remove height restrictions to capture all content
      const originalStyles = removeHeightRestrictions(element);

      // Wait for DOM to update with new styles
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture tab content
      const canvas = await html2canvas(element, {
        scale: 2, // Optimized quality - reduced from 5 to 2 for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5EDDC', // Parchment background color
        logging: false,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        imageTimeout: 0,
        removeContainer: false,
      });

      // Restore original styles
      restoreHeightRestrictions(originalStyles);
      removeVintagePrintStyles(element, styleElement);

      // Restore print-only and screen-only sections
      printOnlySections.forEach(el => {
        if (el.getAttribute('data-was-hidden')) {
          el.style.display = '';
          el.removeAttribute('data-was-hidden');
        }
      });
      screenOnlySections.forEach(el => {
        if (el.getAttribute('data-was-screen-only')) {
          el.style.display = '';
          el.removeAttribute('data-was-screen-only');
        }
      });

      allCanvases.push({ canvas, tabName: tab });
    }

    // Define margins
    const topMargin = 28;
    const bottomMargin = 25;
    const sideMargin = 15;
    const contentWidth = imgWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    // Calculate total pages with margins (add 1 for greeting page)
    let contentPages = 0;
    allCanvases.forEach(({ canvas }) => {
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      contentPages += Math.ceil(imgHeight / contentHeight);
    });
    const totalPages = contentPages + 1;

    // Add personalized greeting page first
    addGreetingPage(pdf, userName, sealImage);

    // Start content pages from page 2
    globalPageNumber = 2;

    // Second pass: add all canvases to PDF with watermarks and margins
    for (let i = 0; i < allCanvases.length; i++) {
      const { canvas } = allCanvases[i];
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.92); // Changed to JPEG with 92% quality

      // Add page for content (always add new page after greeting)
      pdf.addPage();

      // Add vintage background
      addVintageBackground(pdf);

      let heightLeft = imgHeight;
      let position = topMargin;

      // Add first page of this tab with watermark and margins
      pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
      addWatermark(pdf, globalPageNumber, totalPages, sealImage);
      heightLeft -= contentHeight;
      globalPageNumber++;

      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + topMargin;
        pdf.addPage();
        addVintageBackground(pdf);
        pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
        addWatermark(pdf, globalPageNumber, totalPages, sealImage);
        heightLeft -= contentHeight;
        globalPageNumber++;
      }
    }

    // Add metadata
    pdf.setProperties({
      title: 'KarmAnk™ Numerology Report - Complete',
      subject: 'Complete Vedic Numerology Analysis',
      author: 'KarmAnk™',
      keywords: 'numerology, vedic, astrology, dasha, complete report, kundli',
      creator: 'KarmAnk™ Application'
    });

    // Save the PDF
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating full report PDF:', error);
    throw error;
  }
};

/**
 * Add personalized greeting page for Palmistry reports
 */
const addPalmistryGreetingPage = (pdf, userName, sealImage) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add vintage background
  addVintageBackground(pdf);

  // Add decorative border
  addDecorativeBorder(pdf);

  pdf.saveGraphicsState();

  // Large ornamental seal at the top
  if (sealImage) {
    const sealSize = 45;
    drawEmbossedSeal(pdf, pageWidth / 2, 55, sealSize, sealImage);
  }

  // Main greeting - centered
  const startY = 108;

  // Decorative line above greeting
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.8);
  pdf.line(40, startY, pageWidth - 40, startY);

  // Ornamental circles
  pdf.setFillColor(139, 90, 43);
  pdf.circle(38, startY, 1.2, 'F');
  pdf.circle(pageWidth - 38, startY, 1.2, 'F');

  // Greeting text
  pdf.setFontSize(26);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text('Namaste', pageWidth / 2, startY + 18, { align: 'center' });

  // User name
  pdf.setFontSize(30);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'bolditalic');
  pdf.text(userName || 'Dear Seeker', pageWidth / 2, startY + 36, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  pdf.line(60, startY + 46, pageWidth - 60, startY + 46);

  // Welcome message - Palmistry specific
  pdf.setFontSize(15);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'italic');

  const welcomeLines = [
    'We are honored to present your personalized',
    'Nadi Palmistry Report.',
    '',
    'This sacred reading reveals the ancient wisdom',
    'inscribed upon your palm lines.'
  ];

  let currentY = startY + 64;
  welcomeLines.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, currentY + (index * 10), { align: 'center' });
  });

  // Blessing text
  const blessingY = currentY + 40 + 15;
  pdf.setFontSize(15);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'italic');
  pdf.text('May this reading illuminate your path', pageWidth / 2, blessingY, { align: 'center' });
  pdf.text('and guide you towards your destiny.', pageWidth / 2, blessingY + 11, { align: 'center' });

  pdf.restoreGraphicsState();
};

/**
 * Add Palmistry-specific watermark and branding
 */
const addPalmistryWatermark = (pdf, pageNumber, totalPages, sealImage) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;

  // Add decorative border
  addDecorativeBorder(pdf);

  // Add semi-transparent diagonal watermark
  pdf.saveGraphicsState();
  pdf.setGState(new pdf.GState({ opacity: 0.04 }));
  pdf.setFontSize(70);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bolditalic');
  pdf.text('KarmAnk™', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
  });
  pdf.restoreGraphicsState();

  // === HEADER SECTION ===
  pdf.saveGraphicsState();
  const headerY = margin + 12;

  // KarmAnk™ logo
  pdf.setFontSize(22);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  const centerX = pageWidth / 2;
  pdf.text('KarmAnk™', centerX, headerY, { align: 'center', baseline: 'middle' });

  // Palmistry tagline
  pdf.setFontSize(9);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'italic');
  pdf.text('Nadi Palmistry System', centerX, headerY + 5.7, { align: 'center', baseline: 'alphabetic' });

  // Decorative line
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  const lineY = headerY + 8;
  pdf.line(margin + 30, lineY, pageWidth - margin - 30, lineY);

  // Ornamental dots
  pdf.setFillColor(101, 67, 33);
  pdf.circle(margin + 28, lineY, 0.8, 'F');
  pdf.circle(pageWidth - margin - 28, lineY, 0.8, 'F');

  pdf.restoreGraphicsState();

  // === FOOTER SECTION ===
  pdf.saveGraphicsState();
  const footerY = pageHeight - margin - 12;

  // Decorative line
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  const footerLineY = footerY - 8;
  pdf.line(margin + 30, footerLineY, pageWidth - margin - 30, footerLineY);

  // Ornamental dots
  pdf.setFillColor(101, 67, 33);
  pdf.circle(margin + 28, footerLineY, 0.8, 'F');
  pdf.circle(pageWidth - margin - 28, footerLineY, 0.8, 'F');

  // KarmAnk Seal
  if (sealImage) {
    const sealSize = 18;
    const sealX = margin + sealSize/2 + 2;
    const sealY = pageHeight - margin - sealSize/2 - 2;
    drawEmbossedSeal(pdf, sealX, sealY, sealSize, sealImage);
  }

  // Center - Report info
  pdf.setFontSize(9);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'italic');
  pdf.text('Nadi Palmistry Report', pageWidth / 2, footerY - 2, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setTextColor(139, 90, 43);
  pdf.setFont('times', 'normal');
  const dateText = `Generated ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`;
  pdf.text(dateText, pageWidth / 2, footerY + 2, { align: 'center' });

  // Page numbers
  pdf.setFontSize(10);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text(`${pageNumber}`, pageWidth - margin - 15, footerY, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'italic');
  pdf.text(`of ${totalPages}`, pageWidth - margin - 15, footerY + 4, { align: 'center' });

  pdf.restoreGraphicsState();
};

/**
 * Export Palmistry PDF with page breaks at specific elements
 * Uses a more reliable approach: captures each section separately with proper cloning
 * @param {HTMLElement} parentElement - Parent element containing page break elements
 * @param {NodeList} pageBreakElements - Elements with page break class
 * @param {string} fileName - Name of the PDF file
 * @param {string} sealImage - Base64 encoded seal image
 * @param {string} userName - User's name for greeting
 */
const exportPalmistryPDFWithPageBreaks = async (parentElement, pageBreakElements, fileName, sealImage, userName) => {
  try {
    console.log('📄 exportPalmistryPDFWithPageBreaks called with', pageBreakElements.length, 'elements');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const topMargin = 28;
    const bottomMargin = 25;
    const sideMargin = 15;
    const contentWidth = pageWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    // Remove height restrictions before capturing
    const originalStyles = removeHeightRestrictions(parentElement);
    await new Promise(resolve => setTimeout(resolve, 300));

    // FIRST PASS: Capture all sections and calculate total pages needed
    console.log('🔍 Phase 1: Capturing sections and calculating total pages...');
    const capturedSections = [];
    let totalPagesNeeded = 1; // Start with 1 for greeting page

    for (let i = 0; i < pageBreakElements.length; i++) {
      const pageElement = pageBreakElements[i];
      console.log(`  Capturing section ${i + 1}/${pageBreakElements.length}...`);
      console.log(`  Element dimensions: ${pageElement.offsetWidth}x${pageElement.offsetHeight}`);
      console.log(`  Element visible: ${pageElement.offsetParent !== null}`);

      // Clone the element to a temporary container for reliable capture
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = `${parentElement.offsetWidth}px`;
      tempContainer.style.backgroundColor = '#F5EDDC';
      tempContainer.style.padding = '20px';
      document.body.appendChild(tempContainer);

      // Clone the element
      const clonedElement = pageElement.cloneNode(true);
      clonedElement.style.width = '100%';
      clonedElement.style.maxWidth = 'none';
      clonedElement.style.visibility = 'visible';
      clonedElement.style.display = 'block';
      tempContainer.appendChild(clonedElement);

      // Apply vintage print styles to clone
      applyVintagePrintStyles(tempContainer);

      // Wait for clone to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the cloned element
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5EDDC',
        logging: false,
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        imageTimeout: 0,
        removeContainer: false,
      });

      // Clean up temp container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.88);
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      console.log(`  Canvas size: ${canvas.width}x${canvas.height}, imgHeight: ${Math.round(imgHeight)}mm`);

      // Skip sections with invalid dimensions
      if (!canvas.width || !canvas.height || canvas.height < 10 || isNaN(imgHeight)) {
        console.warn(`  ⚠️ Section ${i + 1}: Skipped (invalid dimensions - canvas: ${canvas.width}x${canvas.height})`);
        continue;
      }

      // Calculate how many pages this section needs
      let pagesNeeded = 1;
      if (imgHeight > contentHeight) {
        pagesNeeded = Math.ceil(imgHeight / contentHeight);
      }

      capturedSections.push({
        imgData,
        imgHeight,
        pagesNeeded
      });

      totalPagesNeeded += pagesNeeded;
      console.log(`  ✅ Section ${i + 1}: ${pagesNeeded} page(s) needed (height: ${Math.round(imgHeight)}mm)`);
    }

    // If no sections were captured, fall back to capturing the entire parent
    if (capturedSections.length === 0) {
      console.warn('⚠️ No sections captured, falling back to full element capture');
      restoreHeightRestrictions(originalStyles);
      return false; // Signal to use fallback method
    }

    console.log(`✅ Total pages needed: ${totalPagesNeeded} (including greeting page)`);

    // Add personalized greeting page first
    addPalmistryGreetingPage(pdf, userName || 'Dear Seeker', sealImage);

    // SECOND PASS: Add all sections to PDF with correct page numbers
    console.log('📄 Phase 2: Generating PDF with correct page numbers...');
    let currentPageNumber = 2; // Start from page 2 after greeting

    for (let i = 0; i < capturedSections.length; i++) {
      const { imgData, imgHeight, pagesNeeded } = capturedSections[i];

      // Add page for content
      pdf.addPage();
      addVintageBackground(pdf);

      // Check if content fits on one page
      if (imgHeight <= contentHeight) {
        // Content fits on one page - place at top with margin
        pdf.addImage(imgData, 'JPEG', sideMargin, topMargin, contentWidth, imgHeight);
        addPalmistryWatermark(pdf, currentPageNumber, totalPagesNeeded, sealImage);
        currentPageNumber++;
      } else {
        // Content spans multiple pages - need to slice the image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const tempImg = new Image();

        await new Promise((resolve) => {
          tempImg.onload = resolve;
          tempImg.src = imgData;
        });

        const originalWidth = tempImg.width;
        const originalHeight = tempImg.height;

        const pixelsPerPage = (contentHeight / imgHeight) * originalHeight;
        let remainingHeight = originalHeight;
        let sourceY = 0;
        let pageIndex = 0;

        while (remainingHeight > 0) {
          if (pageIndex > 0) {
            pdf.addPage();
            addVintageBackground(pdf);
          }

          const sliceHeight = Math.min(pixelsPerPage, remainingHeight);

          tempCanvas.width = originalWidth;
          tempCanvas.height = sliceHeight;

          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(
            tempImg,
            0, sourceY,
            originalWidth, sliceHeight,
            0, 0,
            originalWidth, sliceHeight
          );

          const sliceData = tempCanvas.toDataURL('image/jpeg', 0.92);
          const sliceHeightMM = (sliceHeight / originalHeight) * imgHeight;

          pdf.addImage(sliceData, 'JPEG', sideMargin, topMargin, contentWidth, sliceHeightMM);
          addPalmistryWatermark(pdf, currentPageNumber, totalPagesNeeded, sealImage);

          sourceY += sliceHeight;
          remainingHeight -= sliceHeight;
          currentPageNumber++;
          pageIndex++;
        }
      }

      console.log(`  ✓ Section ${i + 1} added (${pagesNeeded} page(s))`);
    }

    console.log(`✅ PDF generation complete! Total pages: ${totalPagesNeeded}`);

    // Restore original styles
    restoreHeightRestrictions(originalStyles);

    // Add metadata
    pdf.setProperties({
      title: 'KarmAnk™ Nadi Palmistry Report',
      subject: 'Complete Nadi Palmistry Analysis',
      author: 'KarmAnk™',
      keywords: 'palmistry, nadi, palm reading, vedic',
      creator: 'KarmAnk™ Application'
    });

    // Save the PDF
    pdf.save(fileName);
    console.log('✅ PDF saved successfully:', fileName);

    return true;
  } catch (error) {
    console.error('❌ Error in exportPalmistryPDFWithPageBreaks:', error);
    throw error;
  }
};

/**
 * Export Palmistry report to PDF
 * @param {string} elementId - ID of the element to capture
 * @param {string} fileName - Name of the PDF file
 * @param {object} options - Additional options (userName)
 */
export const exportPalmistryToPDF = async (elementId, fileName = 'KarmAnk_Palmistry_Report.pdf', options = {}) => {
  try {
    console.log('📄 Starting Palmistry PDF export for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('❌ Element not found:', elementId);
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Load embossed seal
    const sealImage = await loadEmbossedSeal();

    // Apply vintage print styles
    const styleElement = applyVintagePrintStyles(element);

    // Handle print-only and screen-only sections
    const printOnlySections = element.querySelectorAll('.print-only-content');
    const screenOnlySections = element.querySelectorAll('.screen-only-content');
    printOnlySections.forEach(el => {
      el.style.display = 'block';
      el.setAttribute('data-was-hidden', 'true');
    });
    screenOnlySections.forEach(el => {
      el.style.display = 'none';
      el.setAttribute('data-was-screen-only', 'true');
    });

    // Remove height restrictions
    const originalStyles = removeHeightRestrictions(element);

    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for page break elements
    const pageBreakElements = element.querySelectorAll('.pdf-page-break-after');
    console.log('🔍 Found page break elements:', pageBreakElements.length);

    if (pageBreakElements.length > 0) {
      // Try page-break-aware rendering
      const result = await exportPalmistryPDFWithPageBreaks(element, pageBreakElements, fileName, sealImage, options.userName);

      if (result === true) {
        // Successfully used page breaks - clean up and return
        removeVintagePrintStyles(element, styleElement);

        printOnlySections.forEach(el => {
          if (el.getAttribute('data-was-hidden')) {
            el.classList.add('hidden');
            el.removeAttribute('data-was-hidden');
          }
        });
        screenOnlySections.forEach(el => {
          if (el.getAttribute('data-was-screen-only')) {
            el.style.display = '';
            el.removeAttribute('data-was-screen-only');
          }
        });

        return result;
      }
      // If result is false, fall through to fallback method
      console.log('⚠️ Page break method failed, using fallback capture');
    }

    // Fallback: Capture entire element if no page breaks or page break method failed
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F5EDDC',
      logging: false,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      imageTimeout: 0,
      removeContainer: false,
    });

    // Restore styles
    restoreHeightRestrictions(originalStyles);
    removeVintagePrintStyles(element, styleElement);

    // Restore sections
    printOnlySections.forEach(el => {
      if (el.getAttribute('data-was-hidden')) {
        el.classList.add('hidden');
        el.removeAttribute('data-was-hidden');
      }
    });
    screenOnlySections.forEach(el => {
      if (el.getAttribute('data-was-screen-only')) {
        el.style.display = '';
        el.removeAttribute('data-was-screen-only');
      }
    });

    // PDF dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const topMargin = 28;
    const bottomMargin = 25;
    const sideMargin = 15;
    const contentWidth = pageWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = topMargin;
    let pageNumber = 1;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    // Calculate total pages (add 1 for greeting)
    const contentPages = Math.ceil(imgHeight / contentHeight);
    const totalPages = contentPages + 1;

    // Add greeting page
    addPalmistryGreetingPage(pdf, options.userName || 'Dear Seeker', sealImage);

    // Add content pages
    pdf.addPage();
    pageNumber = 2;

    addVintageBackground(pdf);
    pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
    addPalmistryWatermark(pdf, pageNumber, totalPages, sealImage);
    heightLeft -= contentHeight;
    pageNumber++;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + topMargin;
      pdf.addPage();
      addVintageBackground(pdf);
      pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
      addPalmistryWatermark(pdf, pageNumber, totalPages, sealImage);
      heightLeft -= contentHeight;
      pageNumber++;
    }

    // Add metadata
    pdf.setProperties({
      title: 'KarmAnk™ Nadi Palmistry Report',
      subject: 'Complete Nadi Palmistry Analysis',
      author: 'KarmAnk™',
      keywords: 'palmistry, nadi, palm reading, vedic',
      creator: 'KarmAnk™ Application'
    });

    // Save PDF
    pdf.save(fileName);
    console.log('✅ Palmistry PDF saved:', fileName);

    return true;
  } catch (error) {
    console.error('Error generating Palmistry PDF:', error);
    throw error;
  }
};

/**
 * Add AI Confidence Scores section to Palmistry PDF
 */
const addConfidenceScoresSection = (pdf, confidenceData, startY) => {
  if (!confidenceData) return startY;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let currentY = startY;

  // Section header
  pdf.setFontSize(14);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text('AI Prediction Confidence', margin, currentY);
  currentY += 8;

  // Overall score box
  pdf.setFillColor(245, 237, 220);
  pdf.setDrawColor(139, 90, 43);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, currentY, 40, 20, 2, 2, 'FD');

  pdf.setFontSize(20);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text(`${confidenceData.overall}%`, margin + 20, currentY + 13, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setFont('times', 'italic');
  pdf.text('Overall', margin + 20, currentY + 18, { align: 'center' });

  // Individual predictions
  const predictions = [
    { label: 'Marriage', score: confidenceData.marriageAge?.confidence || 0 },
    { label: 'Children', score: confidenceData.progenyCount?.confidence || 0 },
    { label: 'Wealth', score: confidenceData.wealthPeak?.confidence || 0 },
    { label: 'Health', score: confidenceData.healthTimeline?.confidence || 0 },
    { label: 'Career', score: confidenceData.careerPath?.confidence || 0 },
  ];

  let xPos = margin + 50;
  predictions.forEach((pred) => {
    pdf.setFontSize(9);
    pdf.setTextColor(101, 67, 33);
    pdf.setFont('times', 'normal');
    pdf.text(pred.label, xPos, currentY + 6);

    // Progress bar background
    pdf.setFillColor(220, 210, 200);
    pdf.rect(xPos, currentY + 8, 25, 3, 'F');

    // Progress bar fill
    const color = pred.score >= 80 ? [34, 197, 94] : pred.score >= 60 ? [234, 179, 8] : [239, 68, 68];
    pdf.setFillColor(...color);
    pdf.rect(xPos, currentY + 8, (pred.score / 100) * 25, 3, 'F');

    pdf.setFontSize(8);
    pdf.setFont('times', 'bold');
    pdf.text(`${pred.score}%`, xPos + 26, currentY + 11);

    xPos += 32;
  });

  currentY += 25;

  // Improvement tips
  if (confidenceData.improvementTips && confidenceData.improvementTips.length > 0) {
    pdf.setFontSize(9);
    pdf.setTextColor(139, 90, 43);
    pdf.setFont('times', 'italic');
    pdf.text('Tips for better accuracy:', margin, currentY);
    currentY += 5;

    pdf.setFontSize(8);
    pdf.setTextColor(101, 67, 33);
    confidenceData.improvementTips.slice(0, 2).forEach((tip) => {
      pdf.text(`• ${tip}`, margin + 5, currentY);
      currentY += 4;
    });
  }

  return currentY + 5;
};

/**
 * Add Compatibility Analysis section to Palmistry PDF
 */
const addCompatibilitySection = (pdf, compatibilityData, startY) => {
  if (!compatibilityData) return startY;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let currentY = startY;

  // Section header
  pdf.setFontSize(14);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text('Relationship Compatibility', margin, currentY);
  currentY += 8;

  // Score display
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'excellent': return [34, 197, 94];
      case 'good': return [6, 182, 212];
      case 'moderate': return [234, 179, 8];
      default: return [239, 68, 68];
    }
  };

  const color = getRatingColor(compatibilityData.rating);
  pdf.setFillColor(...color);
  pdf.circle(margin + 15, currentY + 8, 12, 'F');

  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('times', 'bold');
  pdf.text(`${compatibilityData.overallScore}`, margin + 15, currentY + 10, { align: 'center' });

  // Rating label
  const ratingLabels = {
    excellent: 'Excellent Match',
    good: 'Good Match',
    moderate: 'Moderate Match',
    challenging: 'Challenging Match'
  };

  pdf.setFontSize(12);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'bold');
  pdf.text(ratingLabels[compatibilityData.rating] || 'Analysis', margin + 35, currentY + 6);

  // Elemental harmony
  pdf.setFontSize(10);
  pdf.setTextColor(101, 67, 33);
  pdf.setFont('times', 'italic');
  pdf.text(
    `${compatibilityData.elementalHarmony.person1Element} + ${compatibilityData.elementalHarmony.person2Element}`,
    margin + 35,
    currentY + 12
  );

  currentY += 22;

  // Summary
  pdf.setFontSize(9);
  pdf.setTextColor(74, 47, 24);
  pdf.setFont('times', 'normal');
  const summary = compatibilityData.summary?.en || '';
  const summaryLines = pdf.splitTextToSize(summary, pageWidth - margin * 2 - 10);
  pdf.text(summaryLines, margin, currentY);
  currentY += summaryLines.length * 4 + 5;

  // Factors
  if (compatibilityData.factors && compatibilityData.factors.length > 0) {
    pdf.setFontSize(9);
    pdf.setFont('times', 'bold');
    pdf.text('Key Factors:', margin, currentY);
    currentY += 5;

    pdf.setFont('times', 'normal');
    compatibilityData.factors.slice(0, 4).forEach((factor) => {
      pdf.text(
        `${factor.icon} ${factor.name?.en || ''}: ${factor.score}%`,
        margin + 5,
        currentY
      );
      currentY += 4;
    });
  }

  return currentY + 5;
};

/**
 * Export Enhanced Palmistry PDF with confidence and compatibility
 * @param {string} elementId - ID of element to capture
 * @param {string} fileName - PDF filename
 * @param {object} options - Options including analysisData, confidenceData, compatibilityData
 */
export const exportEnhancedPalmistryPDF = async (elementId, fileName, options = {}) => {
  try {
    console.log('📄 Starting Enhanced Palmistry PDF export');

    // First export the standard palmistry PDF
    const result = await exportPalmistryToPDF(elementId, fileName, options);

    // Note: The confidence and compatibility data are rendered as part of the
    // palmistry display components, so they're captured in the standard export.
    // This function serves as an entry point for future enhancements.

    return result;
  } catch (error) {
    console.error('Error generating enhanced Palmistry PDF:', error);
    throw error;
  }
};

/**
 * Export Palmistry tab content to PDF
 * @param {string} tabName - Name of the active tab
 * @param {string} userName - User's name for filename and greeting
 */
export const exportPalmistryTabToPDF = async (tabName, userName = 'User') => {
  const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedTab = tabName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `KarmAnk_${sanitizedName}_Palmistry_${sanitizedTab}_${new Date().toISOString().split('T')[0]}.pdf`;

  await exportPalmistryToPDF('palmistry-report-content', fileName, { userName });
};

/**
 * Export full Palmistry report (all tabs) to PDF
 * @param {Array} tabs - Array of tab names
 * @param {Function} setActiveTab - Function to change active tab
 * @param {string} userName - User's name for filename
 */
export const exportFullPalmistryReportToPDF = async (tabs, setActiveTab, userName = 'User') => {
  try {
    const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `KarmAnk_${sanitizedName}_Palmistry_Full_Report_${new Date().toISOString().split('T')[0]}.pdf`;

    // Load seal
    const sealImage = await loadEmbossedSeal();

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    let globalPageNumber = 1;
    const allCanvases = [];

    // Capture all tabs
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      setActiveTab(tab);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const element = document.getElementById('palmistry-report-content');
      if (!element) continue;

      const styleElement = applyVintagePrintStyles(element);
      const printOnlySections = element.querySelectorAll('.print-only-content');
      const screenOnlySections = element.querySelectorAll('.screen-only-content');

      printOnlySections.forEach(el => {
        el.style.display = 'block';
        el.setAttribute('data-was-hidden', 'true');
      });
      screenOnlySections.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('data-was-screen-only', 'true');
      });

      const originalStyles = removeHeightRestrictions(element);
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5EDDC',
        logging: false,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        imageTimeout: 0,
        removeContainer: false,
      });

      restoreHeightRestrictions(originalStyles);
      removeVintagePrintStyles(element, styleElement);

      printOnlySections.forEach(el => {
        if (el.getAttribute('data-was-hidden')) {
          el.style.display = '';
          el.removeAttribute('data-was-hidden');
        }
      });
      screenOnlySections.forEach(el => {
        if (el.getAttribute('data-was-screen-only')) {
          el.style.display = '';
          el.removeAttribute('data-was-screen-only');
        }
      });

      allCanvases.push({ canvas, tabName: tab });
    }

    // PDF dimensions
    const topMargin = 28;
    const bottomMargin = 25;
    const sideMargin = 15;
    const contentWidth = imgWidth - (sideMargin * 2);
    const contentHeight = pageHeight - topMargin - bottomMargin;

    // Calculate total pages
    let contentPages = 0;
    allCanvases.forEach(({ canvas }) => {
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      contentPages += Math.ceil(imgHeight / contentHeight);
    });
    const totalPages = contentPages + 1;

    // Add greeting page
    addPalmistryGreetingPage(pdf, userName, sealImage);
    globalPageNumber = 2;

    // Add all canvases
    for (let i = 0; i < allCanvases.length; i++) {
      const { canvas } = allCanvases[i];
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      pdf.addPage();
      addVintageBackground(pdf);

      let heightLeft = imgHeight;
      let position = topMargin;

      pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
      addPalmistryWatermark(pdf, globalPageNumber, totalPages, sealImage);
      heightLeft -= contentHeight;
      globalPageNumber++;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + topMargin;
        pdf.addPage();
        addVintageBackground(pdf);
        pdf.addImage(imgData, 'JPEG', sideMargin, position, contentWidth, imgHeight);
        addPalmistryWatermark(pdf, globalPageNumber, totalPages, sealImage);
        heightLeft -= contentHeight;
        globalPageNumber++;
      }
    }

    // Add metadata
    pdf.setProperties({
      title: 'KarmAnk™ Nadi Palmistry Report - Complete',
      subject: 'Complete Nadi Palmistry Analysis',
      author: 'KarmAnk™',
      keywords: 'palmistry, nadi, palm reading, vedic, complete report',
      creator: 'KarmAnk™ Application'
    });

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating full Palmistry PDF:', error);
    throw error;
  }
};
