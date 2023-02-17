const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    hobbies:{
        type: String,
        required: true
    },
    occupation:{
        type: String,
        required: true
    },
    join_date:{
        type: String,
        default: Date.now
    },
    img:{
        type: String,
        required:false
    }

})

module.exports = mongoose.model('User',userSchema)