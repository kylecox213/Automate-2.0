const router = require ('express').Router ();
const authRoutes = require('./auth');

// auth login routes, should match /auth/user

router.use('/user', authRoutes);



module.exports = router;