const express = require('express');
const { spot, review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check , validationResult } = require('express-validator');

const router = express.Router();

//Validation middleware for creating a Review 
const validateReview = [
    check('review').exists({ checkFalsy: true }).withMessage('Reveiw is requried'),
    check('stars').isInt({min: 1, max: 5 }). withMessage('Stars must be an integer between 1 and 5 ')
];

//Creating a Review for a SPot based on the Spot's id 
router.post('/:spotId/reviews', requireAuth, validationReview, async(req,res) => {
    const { spotId } = req.params;
    const { review , stars } = req.body;
    const { user } = req;

    //Validating Request Body 
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.arrary() });
    }

    try {
        //Checking to see if spot exists 
        const spot = await spot.findbyPk(spotId);
        if(!spot) {
            return res.status(404).json({ error: 'Spot not found'});
        }

        //Checking to see if a user has already reviewed this spot
        const existingReview = await review.findOne({ where: { spotId, userId: user.id} });
        if(existingReview) {
            return res.status(403).json({ error: 'You have already reviewed this spot '});
        }

        //Create a new reveiw 
        const newReveiw = await review.create({
            userId : user.id,
            spotId,
            review,
            stars 
        }); 

        //Returning the new created review 
        return res.status(201).json(newReveiw);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'An error occurred while creating the review '});
    }
}); 

module.exports = router; 