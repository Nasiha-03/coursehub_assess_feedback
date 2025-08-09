const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const stream = require('stream');

router.post('/', (req, res) => {
  const { name, subject, score, date } = req.body;

  const doc = new PDFDocument();

  // Create a stream buffer
  const bufferStream = new stream.PassThrough();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${subject}-report.pdf`);

  doc.pipe(bufferStream);
  doc.fontSize(20).text('Assessment Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.text(`Subject: ${subject}`);
  doc.text(`Score: ${score}`);
  doc.text(`Date: ${date}`);
  doc.end();

  bufferStream.pipe(res);
});

module.exports = router;
