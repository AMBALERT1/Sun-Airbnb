const express = require('express');
const { review, reviewimage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Adding an Image to a Review 
router.post('/:reviewId/images', requireAuth, async(req,res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    try {
        const review = await review.findByPk(reviewId);
        if(!review) {
            return res.status(404).json({ message: 'Review not found ' });
        }

        if(review.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to add to this review '});
        }
        const reviewImages = await reviewImage.findAll({ where: { reviewId } });
        if(reviewImages.length >= 10 ) {//Assuming the max limit is 10 images per review } 
            return res.status(403).json({ message : 'Maximum number of images for this review reached '});
        }

    const reviewImage = await reviewImage.create({ reviewId, url });
    return res.status(201).json(reviewImage);
    } catch (error) {
        next(error);
    }
});

module.exports = router;