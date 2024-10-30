const mongoose = require('mongoose')
const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const reservationSchema = mongoose.Schema({
   
    dateReservation: {
        type: String,
        required: true
      },

      heureReservation: {
        type: String,
        required: true
      },

      nombrePlace: {
        type: String,
        required: true
      },

      motifReservation: {
        type: String,
        required: false
      },
      nomClient:{ 
        type: String,
        required: true
      },
      numeroClient:{
        type: String,
        required: true
      },
      emailClient:{
        type: String,
        required: true
      },
      statutReservation: {
        type: String,
        default: "En cours.."
      },
      createdAt: {
        type: Date,
        default: Date.now // Défaut à la date actuelle
      }

})

module.exports = mongoose.model("reservation", reservationSchema);