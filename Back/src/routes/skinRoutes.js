const express = require('express')
const router = express.Router()
const {getSkins} = require('../controllers/skinController.js')

router.get('/', getSkins);

module.exports = router;