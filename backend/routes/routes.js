const express = require('express');
const router = express.Router();
const { Spot } = require('../db/models')

router.get('/', async(req,res,next) => {
    try {
        const spots = await Spot.findAll();
        res.json(spots);
    } catch (error) {
        console.error('Error fetching spots:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
}); 

module.exports = router;
     