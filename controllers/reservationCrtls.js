const reservation = require("../models/reservationModel");
let bcrypt = require('bcrypt');
let jwtutils = require('../utils/jwt.utils');



module.exports = {

    getReservation : async (req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization'];
        console.log(headerAuth);
        const idUser = jwtutils.getUserId(headerAuth); 
        console.log(idUser);

        if (idUser === -1) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        try {
            
    
            const reservations = await reservation.find({ });
    
            if (reservations.length === 0) {
                return res.status(404).json({ success: false, msg: "Aucune reservation trouvé" });
            }
    
            res.status(200).json({ success: true, msg: "Reservation récupérés avec succès", data: reservations });
            
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }

    },

    creationReservation : async (req,res) => {

        
         //const { dateReservation, heureReservation, nombrePlace, motifReservation, nomClient,numeroClient,emailClient } = req.body;

         try {
        
            const { dateReservation, heureReservation, nombrePlace, motifReservation, nomClient, numeroClient, emailClient } = req.body;

            console.log(dateReservation, heureReservation, nombrePlace, nomClient, numeroClient, emailClient)
            if (!dateReservation || !heureReservation || !nombrePlace || !nomClient || !numeroClient || !emailClient) {
                return res.status(400).json({ success: false, msg: "Données manquantes pour la réservation" });
            }
        
            const newReservation = new reservation({
                dateReservation,
                heureReservation,
                nombrePlace,
                motifReservation,
                nomClient,
                numeroClient,
                emailClient
            });
        
            const savedReservation = await newReservation.save();
            // Retourner une réponse réussie
            res.status(201).json({ success: true, msg: "Réservation créée avec succès", data: savedReservation });
        } catch (error) {
            console.error('Erreur lors de la création de la réservation:', error);
            res.status(500).json({ success: false, msg: "Échec de la réservation", error: error.message });
        }

    },

    upadteReservation : async (req, res) => {

    }


}