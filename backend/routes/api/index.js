// backend/routes/api/index.js
const router = require('express').Router();

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });
  
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);


module.exports = router;