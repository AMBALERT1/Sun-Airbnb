// routes/api/images.js
const express = require('express');
const router = express.Router();
const { Spot, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ error: 'Spot not found' });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const image = await Image.create({
    url,
    preview,
    spotId,
  });

  return res.json({
    id: image.id,
    url: image.url,
    preview: image.preview,
  });
});

module.exports = router;
