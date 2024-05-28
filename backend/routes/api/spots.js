const express = require('express');
const { Spot, spotimage, user, review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.Id; 

    try {
        //Locate all the spots where the ownerId matches the current user's ID
        const spots = await Spot.findAll({
            where : { ownerId: userId },
            attributes: [
                'id', 'ownerId', 'address' , 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt','updatedAt'
            ]
        });

        //Return the spots data 
        return res.json({ Spots: spots });
    } catch (error) {
        console.error('Error fetching spot:' , error);
        return res.status(500).json({ error: 'An error occurred while fetching the spots' })
    }
});

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

const validateSpotUpdate = [
    check('address').optional().notEmpty().withMessage('Address is required.'),
    check('city').optional().notEmpty().withMessage('City is required.'),
    check('state').optional().notEmpty().withMessage('State is required.'),
    check('country').optional().notEmpty().withMessage('Country is required.'),
    check('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90.'),
    check('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180.'),
    check('name').optional().notEmpty().withMessage('Name is required.'),
    check('description').optional().notEmpty().withMessage('Description is required.'),
    check('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
];

router.put('/:id', requireAuth, validateSpotUpdate, async (req, res) => {
    const spotId = req.params.id;
    const userId = req.user.id;
    const { address , city , state, country, lat, lng, name, description, price } = req.body;

    try {
        //Checking to see if the spot exists 
        const spot = await Spot.findByPk(spotId);
        if(!spot) {
            return res.status(404).json({ error: 'Spot not found' });
        }
        //Checking to see if the authorized user is the owner of that spot 
         if(spot.ownerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to edit this spot'})
         }
         //Validating request body
         const validationErrors = validationResult(req);
         if(!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
         }

         //Update spot in the database 
         await spot.update({
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

         //Fetch updated spot data from the database 
         const updatedSpot = await Spot.findByPk(spotId);

         //Return update spot data 
         return res.json(updatedSpot);
    } catch (error) {
        console.error('Error updating spot:' , error);
        return res.status(500).json({ error: 'An error occurred while updating the spot'});
    }
});


router.delete('/:id', requireAuth, (req, res) => {
    const spotId = req.params.id
    const userId = req.user.id;

    try {
        //Find a Spot in the database 
        const spot = await Spot.findByPk(spotId);

        //If the spot isn't found, then return 404
        if(!spot) {
            return res.status(404).json({ error: 'Spot not found '});
        }
        //if the user isn't the owner, return 403
        if(spot.ownerId !== userId) {
            return res.status(403).json({ error: ' Unauthorized to delete this spot '});
        }

        await spot.remove();

        //return sucess message 
        return res.json({ message: 'Spot deleted successfully' });
    } catch (error) {
        console.log('Error deleting spot:', error );
        return res.status(500).json({ error: 'An error occurred while deleting the spot'})
    }
});

module.exports = router;