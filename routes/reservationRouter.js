//Import
let express = require('express')
const reservationCrtls = require('../controllers/reservationCrtls')


// Routes
exports.router = (function(){
    let reservationRouter = express.Router()

    //reservations route
    reservationRouter.post('/reservations-create/', reservationCrtls.creationReservation);
    reservationRouter.get('/reservations/', reservationCrtls.getReservation);
    reservationRouter.put('/update-statut/:id', reservationCrtls.updateStatut);

    
    return reservationRouter
})()