const { default: mongoose } = require("mongoose");

const {Schema}=mongoose

const UserSchema=new Schema({

    name: {
        type: String,
    },
    password:{
        type: String,
    }

})
module.exports = mongoose.model('UserSchema', UserSchema)  //course is a name given to model 