const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middlewares/authMiddleware');

router.get('/api/auth/user', authenticateUser,(req, res) => {
    res.json({ user: req.user });

});


module.exports = router;