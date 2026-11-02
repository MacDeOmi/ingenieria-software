const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header (Bearer <token>)
            token = req.headers.authorization.split(' ')[1]

            // Verificar el token con el secreto
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Obtener el usuario del token excluyendo el password
            req.user = await User.findById(decoded.id).select('-password')

            if (!req.user) {
                res.status(401)
                throw new Error('Acceso no autorizado, usuario no encontrado')
            }

            return next()
        } catch (error) {
            res.status(401)
            throw new Error('Acceso no autorizado')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Acceso no autorizado, no se proporcionó un token')
    }
})

module.exports = { protect }
