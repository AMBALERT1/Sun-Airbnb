const express = require('express');
const { Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

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

router.post('/', requireAuth, validateSpot, async (req,res) => {
    const { user } = req;
    const { address , city , state, country , lat, lng, name, description, price } = req.body;
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const newSpot = await Spot.create({
        owneerId: user.id,
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

    return res.json(newSpot);
});

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

    //Locate the spot 
    const spotIndex = spots.findIndex(spot => spot.id === spotId);

    //If spot isn't found, return 404 
    if(spotIndex === -1) {
        return res.status(404).json({ error: 'Spot not found '});
    }

    const spot = spots[spotIndex];

    //If user isn't the owner, return 403 
    if(spot.ownerId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this spot'});
    }

    //Remove the spot from the array
    spots.splice(spotIndex, 1);

    //Return sucess message 
    return res.json({ message : 'Spot deleted successfully'});
});

module.exports = router;