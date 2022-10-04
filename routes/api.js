const router = require('express').Router()
const { Router } = require('express');
const { register } = require('../controllers/authController');

router.post('/register', register)

module.exports = router;