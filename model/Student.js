const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
// using mongoose schema to define structure of our collection
const StudentSchema= new Schema({

    firstName: {

        type: String,
        required: true,
        minlength: 3

    },

    lastName: {

        type: String,
        required: true,
        minlength: 4

    },

    branch: {

        type: String,
        minlength: 2
    },

    rollNo: {
        type: Number
    }


});


module.exports = mongoose.model('students', StudentSchema);

