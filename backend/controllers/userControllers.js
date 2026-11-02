const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Crear nuevo usuario
// @route   POST /api/users
// @access  Public
const crearUser = asyncHandler(async (req, res) => {
    const { nombre, name, email, password } = req.body
    const userName = nombre || name

    if (!userName || !email || !password) {
        res.status(400)
        throw new Error('Por favor ingresa todos los campos')
    }

    // Verificar si el usuario ya existe
    const userExiste = await User.findOne({ email })
    if (userExiste) {
        res.status(400)
        throw new Error('El usuario ya existe')
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear el usuario
    const user = await User.create({
        nombre: userName,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Datos de usuario no válidos')
    }
})

// @desc    Autenticar usuario / Iniciar sesión
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Por favor ingresa email y contraseña')
    }

    // Verificar usuario por correo
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Credenciales incorrectas')
    }
})

// @desc    Obtener datos del usuario autenticado
// @route   GET /api/users/datos
// @access  Private
const datosUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// Función auxiliar para generar JWT
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    crearUser,
    loginUser,
    datosUser,
    register: crearUser,
    login: loginUser,
    data: datosUser
}





//token pedro: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZThkY2E5OWNiNmM4MmI3YzVkOTIwMiIsImlhdCI6MTc5MzY0Njk2OCwiZXhwIjoxNzk2MjM4OTY4fQ.gyjWTGPqvYYLR_mpFLMoFBa3dNSKypIEzBlCK1nXpKo

//token juan: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZThkZGZlOWNiNmM4MmI3YzVkOTIwMyIsImlhdCI6MTc5MzY0NzEzOSwiZXhwIjoxNzk2MjM5MTM5fQ.KXQ_8Mu4ArQJNsNNoPhnawqNpsTKWj5BYWPxH6GU6ss