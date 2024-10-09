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
            // Vérifier si l'email existe déjà dans la base de données
            const existingUser = await user.findOne({ emailUser: emailUser });
            if (!existingUser) {
                return res.status(400).json({ 'error': 'Email non trouve' });
            }

            bcrypt.compare(passwordUser, existingUser.passwordUser, function(errBycrypt, resBycrypt){
                if(resBycrypt){
                    return res.status(200).json({
                        'id': existingUser.id,
                        'token': jwtutils.generateTokenForUser(existingUser)
                    })
                }else{
                    return res.status(403).json({'error': 'mot de passe incorrect'})
                }
            })
  
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion", error }); 
        }

       
    },

}


