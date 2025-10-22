const express = require('express');
const router = express.Router();

// Exemple de route
router.get('/api/example', (req, res) => {
  res.json({ message: 'Route d\'exemple' });
});

module.exports = router;
