const mongoose = require('mongoose');

const platschema = mongoose.Schema({

    nomplat: {
        type:String,
        require:true
    },
    descripplat: {
        type:String,
        require: false
    },
    imageplat: {
        type: String,
        require: true
    },
    prixplat: {
        type:String,
        require: true
    }

});

const menuschema = mongoose.Schema({

    typeplat: {
        type:String,
        require:true
    },
    platinfo: [platschema],
    createdAt: {
        type: Date,
        default: Date.now
      }

});

module.exports = mongoose.model("menu", menuschema);