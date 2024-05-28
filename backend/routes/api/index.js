// backend/routes/api/index.js
const express = require('express')
const router = require('express').Router();

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reveiwRouter = require('./review.js');
const reviewImagesRouter = require('./reviewimages.js');
const imagesRouter = require('./images.js');

const { restoreUser } = require('../../utils/auth.js');

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });
  
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/reviews', reviewImagesRouter);
router.use('/images', imagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );




module.exports = router;