const { default: mongoose } = require("mongoose");

const {Schema}=mongoose

const MessagingSchema=new Schema({

    message: {
        type: String,
    },
    name:{
        type: String,
    },
    timestamp: {
        type: String,
    },
    received: {
        type: Boolean,
    }, 

})
module.exports = mongoose.model('messagingmessages', MessagingSchema)  //course is a name given to model 