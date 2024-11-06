//Import
let express = require('express')
let userCrtls = require('../controllers/usersCrtls')
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Routes
exports.router = (function(){
    let userRouter = express.Router()

    //user route
    userRouter.post('/register/', userCrtls.register);
    userRouter.post('/login/', userCrtls.login);
    userRouter.put('/user-update/', userCrtls.modifierUser);
    userRouter.get('/getlogin/', userCrtls.getLogin);

    userRouter.post('/verify-token/', (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token du header

        if (!token) {
            return res.status(401).json({ valid: false, message: 'Aucun token trouvé' });
        }

        // Vérifie le token
        jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
            if (err) {
            return res.status(401).json({ valid: false, message: 'Token invalide' });
            }
            res.json({ valid: true, decoded });
        });
      });
 
    
    
    return userRouter
})()