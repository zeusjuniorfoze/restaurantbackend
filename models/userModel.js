const mongoose = require('mongoose');



const userSchema = mongoose.Schema({

    nomUser : {
        type : String,
        require : true
    },
    numeroUser : {
      type: String,
      required :false
    }, 
    emailUser : {
        type : String,
        require : true
    },
    passwordUser : {
        type : String,
        require : true
    },
    isAdmin : {
      type: String,
      default: false,
      required :true
    }, 

    createdAt: {
        type: Date,
        default: Date.now // Défaut à la date actuelle
      }

})

module.exports = mongoose.model("user", userSchema);