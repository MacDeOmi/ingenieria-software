const express = require('express')
const router = express.Router()
const {
    crearUser,
    loginUser,
    datosUser,
    register,
    login,
    data
} = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

// Rutas requeridas por la actividad
router.post('/', crearUser)
router.post('/register', register)
router.post('/login', loginUser)
router.get('/datos', protect, datosUser)
router.get('/data', protect, data)

module.exports = router
