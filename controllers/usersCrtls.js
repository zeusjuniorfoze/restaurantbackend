const user = require("../models/userModel")
let bcrypt = require('bcrypt')
let jwtutils = require('../utils/jwt.utils')

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const pass_regex = /^(?=.*\d).{4,8}$/

module.exports ={

    //Fonction pour cree un utilisateur
    register : async(req, res) => {

        let {nomUser, numeroUser, emailUser,passwordUser} = req.body;

        if (nomUser.length >= 13 || nomUser.length <= 4){
            return res.status(400).json({'error': 'taille du username incorrect (5 - 12)'})
        }
  
        if(!email_regex.test(emailUser)){
            return res.status(400).json({'error': 'formatage du email incorecte  '})
        }

        if(!pass_regex.test(passwordUser)){
            return res.status(400).json({'error': 'le mot de passe dois avoir au moin un chiffre'})
        }

        try {
          

            // Vérifier si l'email existe déjà dans la base de données
            const existingUser = await user.findOne({ emailUser: emailUser });
            if (existingUser) {
                return res.status(400).json({ 'error': 'Email déjà utilisé' });
            }

           
            bcrypt.hash(passwordUser, 5, async function (err, bcryptedPassword) {
                if (err) {
                    return res.status(500).json({ 'error': 'Erreur lors du hachage du mot de passe' });
                }

                const users = new user({
                    nomUser: nomUser,
                    numeroUser: numeroUser,
                    emailUser: emailUser,
                    passwordUser: bcryptedPassword
                });

                const userData = await users.save();
                res.status(200).json({ success: true, msg: "Utilisateur enregistré", Data: userData });
            });
            
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'enregistrement", error });   
        }
    },

    login : async (req, res) => {

        let {emailUser,passwordUser} = req.body;
     
        if( emailUser == '' || passwordUser == '' ){
            return res.status(400).json({'error': 'erreur de paramettre'})
        }

        try {

            const existingUser = await user.findOne({ emailUser: emailUser });
            if (!existingUser) {
                return res.status(400).json({ 'error': 'Email non trouve' });
            }

            bcrypt.compare(passwordUser, existingUser.passwordUser, function(errBycrypt, resBycrypt){
                if(resBycrypt){
                    return res.status(200).json({
                        success: true,
                        'role' : "admin",
                        'id': existingUser.id,
                        'token': jwtutils.generateTokenForUser(existingUser)
                    })
                }else{
                    return res.status(403).json({'error': 'mot de passe incorrect'})
                }
            })
  
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion veillez ressayer"}); 
        }
       
    },

    modifierUser : async (req,res) => {

        const headerAuth = req.headers['authorization'];
        const idUser = jwtutils.getUserId(headerAuth); 
    
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }
        const { nomUser, numeroUser, emailUser } = req.body;
        

        try {

        const Utilisateur = await User.findByIdAndUpdate(
            idUser,
            {   nomUser: nomUser,
                numeroUser: numeroUser,
                emailUser: emailUser
             }, 
            { new: true, runValidators: true } // Retourne le document mis à jour et applique les validations
          );
        
          if (!Utilisateur) {
            return { success: false, message: "Utilisateur non trouvé" };
          }
          return { success: true, data: Utilisateur };
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
          return { success: false, error };
        }
      },
    
    modifierMotDePasse : async (req,res) => {
        const headerAuth = req.headers['authorization'];
        const idUser = jwtutils.getUserId(headerAuth);
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }
        const {ancienPassword, nouveauPassword } = req.body;

        try {
            // Récupère l'utilisateur par ID
            const existingUser = await user.findById(idUser);
            if (!existingUser) {
              return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
        
            // Vérifie l'ancien mot de passe
            bcrypt.compare(ancienPassword, existingUser.passwordUser, async (errBycrypt, resBycrypt) => {
              if (errBycrypt) {
                return res.status(500).json({ error: "Erreur lors de la vérification du mot de passe" });
              }
              
              if (!resBycrypt) {
                return res.status(403).json({ error: "Mot de passe incorrect" });
              }
        
              // Hash du nouveau mot de passe
              const saltRounds = 5;
              const hashedPassword = await bcrypt.hash(nouveauPassword, saltRounds);
        
              // Mise à jour du mot de passe de l'utilisateur
              existingUser.passwordUser = hashedPassword;
              await existingUser.save();
        
              // Répond avec succès et retourne éventuellement un token
              return res.status(200).json({
                success: true,
                message: "Mot de passe mis à jour avec succès",
                id: existingUser.id,
                token: jwtutils.generateTokenForUser(existingUser) 
              });
            });
          } catch (error) {
            console.error("Erreur lors de la mise à jour du mot de passe :", error);
            return res.status(500).json({ error: "Erreur lors de la mise à jour du mot de passe" });
          }
    },


    getLogin : async (req,res) => {

        const headerAuth = req.headers['authorization'];
        const idUser = jwtutils.getUserId(headerAuth); 
    
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        try {
           
            const User = await user.findById(idUser);
            res.status(200).json({ success: true, msg: "Utilisateur récupéré avec succès", data: User });
            
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion"});
        }

    }

}


