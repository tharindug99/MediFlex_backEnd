const express = require('express');
const router = express.Router();
const { CreateUser, Userlogin, getDoctors } = require('../controllers/authcontroller');

router.post('/register', CreateUser);
router.post('/login', Userlogin);
router.get('/doctors', getDoctors);

module.exports = router;
