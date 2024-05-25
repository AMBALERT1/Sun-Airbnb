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


router.delete('/:id', requireAuth, async (req, res) => {
    const spotId = req.params.id;
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