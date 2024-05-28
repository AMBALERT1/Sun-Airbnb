const express = require('express');
const { Spot, spotimage, user, review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const spotId = req.params.id;
  
    try {
      //  checking to see if the spot exists
      const spot = await Spot.findByPk(spotId, {
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
  
      if (!spot) {
        return res.status(404).json({ error: 'Spot not found' });
      }
  
      // Calcuating the aggregate data for numReviews and avgStarRating
      const reviews = await Review.findAll({ where: { spotId } });
      const numReviews = reviews.length;
      const avgStarRating = reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews || 0;
  
      const spotDetails = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews,
        avgStarRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner
      };
  
      return res.json(spotDetails);
    } catch (error) {
      console.error('Error fetching spot details:', error);
      return res.status(500).json({ error: 'An error occurred while fetching spot details' });
    }
  });


const validateSpot = [
  check('address').exists({ checkFalsy: true }).withMessage('Address is required.'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required.'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required.'),
  check('country').exists({ checkFalsy: true }).withMessage('Country is required.'),
  check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90.'),
  check('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180.'),
  check('name').exists({ checkFalsy: true }).withMessage('Name is required.'),
  check('description').exists({ checkFalsy: true }).withMessage('Description is required.'),
  check('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
];

router.post('/',requireAuth, validateSpot, async(req, res) => {
    const { user } = req;
    const { address , city , state, country, lat, lng, name , description, price } = req.body

    //Validate request body 
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
        return res.status(400).json( {errors: validationErrors.array() });
    }

    try {
        // Create new spot
        const newSpot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        });

        // Return newly created spot
        return res.status(201).json(newSpot);
    } catch (error) {
        console.error('Error creating spot:', error);
        return res.status(500).json({ error: 'An error occurred while creating the spot' });
    }
})

module.exports = router;