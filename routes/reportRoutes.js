const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, `../report/${id}.pdf`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.download(filePath, `${id}-report.pdf`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Download failed' });
      }
    });
  });
});

module.exports = router;
