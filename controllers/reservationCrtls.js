const reservation = require("../models/reservationModel");
let bcrypt = require('bcrypt');
let jwtutils = require('../utils/jwt.utils');
const nodemailer = require('nodemailer');

//Mail configuration 
let config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Utilisation de SSL
    auth : {
      user : 'goubexlv@gmail.com',
      pass : 'vbuj idld qbyu ooxm'
    },
    tls: {
      rejectUnauthorized: false // Permet de faire confiance aux certificats auto-signés
    }
  }
  let transporter = nodemailer.createTransport(config);
  


module.exports = {

    getReservation : async (req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
  
        try {
            
            const reservations = await reservation.find({ });
    
            res.status(200).json({ success: true, msg: "Reservation récupérés avec succès", data: reservations });
            
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }

    },

    creationReservation : async (req,res) => {

        const { dateReservation, heureReservation, nombrePlace, motifReservation, nomClient, numeroClient, emailClient } = req.body;

        const options = {
            from: 'inforestaurant@gmail.com',
            to: 'powerksoft@gmail.com',
            subject: "Nouvelle reservation",
            text: "Une nouvelle reservation recus de " +nombrePlace + " place(s) pour le "+dateReservation+". Veiller allez a la plateforme pour confirmer",
          };

         try {
        

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
            //Envoi mail
            await transporter.sendMail(options);
            
            res.status(201).json({ success: true, msg: "Réservation créée avec succès", data: savedReservation });
        } catch (error) {
            console.error('Erreur lors de la création de la réservation:', error);
            res.status(500).json({ success: false, msg: "Échec de la réservation", error: error.message });
        }

    },

    updateStatut: async (req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        

            const idReservation = req.params.id;
            try {
                const {statutReservation } = req.body;
            
                // Vérifiez que `idReservation` et `nouveauStatut` sont fournis
                if (!idReservation || !statutReservation) {
                    return res.status(400).json({ message: "ID de réservation et nouveau statut requis" });
                }
    
                // Trouver la réservation par son ID
                const Reservation = await reservation.findById(idReservation);
    
                if (!Reservation) {
                    return res.status(404).json({ message: "Réservation non trouvée" });
                }

                const options = {
                    from: 'inforestaurant@gmail.com',
                    to: Reservation.emailClient,
                    subject: "Statut de la reservation",
                    text: "Salut Mr/mme "+ Reservation.nomClient +" \n votre reservation au restaurant powerksoft a ete " + statutReservation + " pour le "+Reservation.dateReservation+"a "+Reservation.dateReservation+" . \n merci ",
                  };
    
                // Mettre à jour le statut de la réservation
                Reservation.statutReservation = statutReservation;
    
                // Sauvegarder les modifications
                await Reservation.save();
                //Envoi mail
                await transporter.sendMail(options);
                res.status(200).json({success: true,
                    message: "Statut de la réservation mis à jour avec succès",
                    Reservation,
                });
            } catch (error) {
                console.error("Erreur lors de la mise à jour du statut:", error);
                res.status(500).json({ message: "Erreur interne du serveur" });
            }
        },


}
