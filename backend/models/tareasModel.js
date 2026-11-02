const mongoose = require('mongoose')

const TareasSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    descripcion: {
        type: String,
        required: [true, 'Porfa teclea descripcion']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Tarea', TareasSchema)
