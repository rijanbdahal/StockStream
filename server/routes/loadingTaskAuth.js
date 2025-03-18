const express = require('express');
const router = express.Router();

const LoadingOrder  = require('../models/loadingOrder');

router.get('/loadingTasks', async (req, res) => {

    const loadingOrder = await LoadingOrder.findOne({isShipped: false});
    if(!loadingOrder){
        return res.status(404).json({message:"No Loading Tasks"});
    }
    console.log(loadingOrder);
    return res.status(200).json({loadingOrder});

});

module.exports = router;