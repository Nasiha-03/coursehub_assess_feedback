const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('./report/Java.pdf'));

doc.fontSize(25).text('Java Programming Report', 100, 100);
doc.text('This is a sample content for the Java PDF report.');

doc.end();
