//Import
let bcrypt = require('bcrypt')
let jwtutils = require('../utils/jwt.utils')
let models = require('../models')

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const pass_regex = /^(?=.*\d).{4,8}$/


// Routes
module.exports = {
    register: function(req, res) {
        //parem
        let email  = req.body.email
        let username = req.body.username
        let password = req.body.password
        let bio = req.body.bio

        if (email == '' || username == '' || password == ''){
            return res.status(400).json({'error': 'erreur de paramettre'})
        }

        if (username.length >= 13 || username.length <= 4){
            return res.status(400).json({'error': 'taille du username incorrect (5 - 12)'})
        }

        if(!email_regex.test(email)){
            return res.status(400).json({'error': 'formatage du email incorecte  '})
        }

        if(!pass_regex.test(password)){
            return res.status(400).json({'error': 'le mot de passe dois avoir au moin un chiffre'})
        }

        //verification

        models.User.findOne({
            attributes: ['email'],
            where: {email, email} 
        })
        .then(function(userFound) {
            if (!userFound){

                bcrypt.hash(password, 5, function(err, bcryptedPassword){
                    let newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                    })
                    .catch(function(err) {
                        return res.status(500).json({'error': 'erreur insertion user'})
                    })

                })
            }else{
                return res.status(409).json({'error': 'utilisateur existe deja '})
            }

        }) 
        .catch(function(err){
            return res.status(500).json({'error': 'verifie'})
        })

    },

    login: function(req, res) {

        let email = req.body.email
        let password = req.body.password

        if( email == '' || password == '' ){
            return res.status(400).json({'error': 'erreur de paramettre'})
        }

        models.User.findOne({
            where: {email, email}
        })
        .then(function(userFound){
            if(userFound){
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if(resBycrypt){
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtutils.generateTokenForUser(userFound)
                        })
                    }else{
                        return res.status(403).json({'error': 'mot de passe incorrect'})
                    }
                })

            }else{
                return res.status(404).json({'error': 'utilisateur existe pas '})
            }

        })
        .catch(function(err){
            return res.status(500).json({'error': 'utilisateur non trouver'})
        })

    },

    getUserProfile: function(req, res){

        let headerAuth = req.headers['authoization']
        let userId = jwtutils.getUserId(headerAuth)

        if (userId < 0){
            return res.status(400).json({'error': 'erreur au niveau du token'})
        }

        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: {id : userId}

        }).then(function(user){
            if(user){
                res.status(201).json(user)
            }else{
                res.status(404).json({'error': 'utilisateur non trouver'})
            }
        }).catch(function(err){
            res.status(500).json({'error': 'utilisateur non disponible'})
        })
    }
}