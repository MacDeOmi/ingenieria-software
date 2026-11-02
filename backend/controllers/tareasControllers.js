const asyncHandler = require('express-async-handler')
const Tarea = require('../models/tareasModel')

// @desc    Obtener tareas del usuario logueado
// @route   GET /api/tareas
// @access  Private
const getTareas = asyncHandler(async (req, res) => {
    const tareas = await Tarea.find({ user: req.user.id })
    res.status(200).json(tareas)
})

// @desc    Crear una tarea asignada al usuario logueado
// @route   POST /api/tareas
// @access  Private
const createTareas = asyncHandler(async (req, res) => {
    if (!req.body.descripcion) {
        res.status(400)
        throw new Error("porfabor teclea la descripcion")
    }

    const tarea = await Tarea.create({
        descripcion: req.body.descripcion,
        user: req.user.id
    })

    res.status(201).json(tarea)
})

// @desc    Modificar una tarea propia
// @route   PUT /api/tareas/:id
// @access  Private
const updateTareas = asyncHandler(async (req, res) => {
    const tarea = await Tarea.findById(req.params.id)
    if (!tarea) {
        res.status(404)
        throw new Error("la tarea especificada no se encuentra")
    }

    // Verificar que la tarea pertenezca al usuario logueado
    if (tarea.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("Usuario no autorizado para modificar esta tarea")
    }

    const tareaModificada = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(tareaModificada)
})

// @desc    Eliminar una tarea propia
// @route   DELETE /api/tareas/:id
// @access  Private
const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await Tarea.findById(req.params.id)
    if (!tarea) {
        res.status(404)
        throw new Error("la tarea especificada no se encuentra")
    }

    // Verificar que la tarea pertenezca al usuario logueado
    if (tarea.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("Usuario no autorizado para eliminar esta tarea")
    }

    await tarea.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
