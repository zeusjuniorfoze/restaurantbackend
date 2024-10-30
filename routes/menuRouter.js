//Import
let express = require('express')
const multer = require('multer')
const path = require('path')
const menuCrtls = require('../controllers/menusCrtls')
const upload = require('../config/multer')

/* const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'), function(error,success){
            if(error) {
                console.log('Erreur lors de la création du répertoire : ', error)
                cb(error, null)
            }
        })
    }, 

    filename: function (req, file, cb) {

        const name = Date.now() + '-' + file.originalname
        cb(null,name, function(error,success){
            if(error){
                console.log('Erreur lors de l\'enregistrement du fichier : ', error)
                cb(error, null)
            }

        } );
    }

});

const upload = multer({storage:storage}); */

// Routes
exports.router = (function(){
    let menuRouter = express.Router()

    //menus route
    menuRouter.get('/menus-get/', menuCrtls.getMenus);

    menuRouter.post('/menus-create/', menuCrtls.createMenu);
    menuRouter.put('/menus-update/:id', menuCrtls.modifierMenu);
    menuRouter.delete('/menus-delete/:id', menuCrtls.supprimerMenu);

    //Route pour les plats
    menuRouter.put('/plat-ajouter/:id', upload.single('imageplat') ,menuCrtls.ajoutPlat);
    menuRouter.put('/plat-update/:menuId/:platId', upload.single('imageplat'), menuCrtls.modifierPlat);
    menuRouter.delete('/plat-delete/:id', menuCrtls.supprimerPlat);
    
    
    return menuRouter
})()