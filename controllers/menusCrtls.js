const menu = require('../models/menuModel')
let jwtutils = require('../utils/jwt.utils')

module.exports = {
    //Fonction pour recuperer le menu
    getMenus : async(req, res) => {
        const headerAuth = req.headers['authorization'];
        const idUser = jwtutils.getUserId(headerAuth); 
    
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        try {
            // Récupérer le token de l'en-tête d'autorisation
            
    
            const menus = await menu.find({ });
    
            if (menus.length === 0) {
                return res.status(404).json({ success: false, msg: "Aucun menu trouvé pour cet utilisateur" });
            }
    
            res.status(200).json({ success: true, msg: "Menus récupérés avec succès", data: menus });
            
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    },

    //Fonction pour la creation d'un titre de menu
    createMenu : async(req, res) => {

        /* // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization'];
        const idUser = jwtutils.getUserId(headerAuth); 

        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        } */
        const { typeplat} = req.body;
        try {
            const menus = new menu({
                typeplat : typeplat
            });
            const menuDate = await menus.save();
            res.status(200).json({successs: true,msg: "Menu envoyer", Data: menuDate});
        } catch (error) {
            res.status(400).json({successs: false,msg: error.message});
        }
    },

    //Fonction pour modifier le nom du menu
    modifierMenu : async(req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        const menuId = req.params.id;
        try {
            const updatedMenu = await menu.findByIdAndUpdate(
                menuId,
                { typeplat: req.body.typeplat },
                { new: true } 
            );
            if (!updatedMenu) {
                return res.status(404).json({ message: 'Menu non trouvé' });
            }
            
            res.status(200).json({successs: true,msg: "Nom du menu mis à jour avec succès", Data: updatedMenu})
        } catch (error) {
            res.status(400).json({successs: false,msg: error.message});
        }

    },

    //Fonction pour supprimer un menu
    supprimerMenu : async(req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        const menuId = req.params.id; 

        try {
            const deletedMenu = await menu.findByIdAndDelete(menuId);
            if (!deletedMenu) {
                return res.status(404).json({ message: 'Menu non trouvé' });
            }
            res.status(200).json({ message: 'Menu supprimé avec succès', deletedMenu });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression du menu', error });
        }
    },

    //Fonction pour ajouter un plat a un menu
    ajoutPlat : async(req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        const menuId = req.params.id;
        const { nomplat, descripplat, prixplat } = req.body;

        try {
            const menus = await menu.findById(menuId);
            if (!menus) {
                return res.status(404).json({ message: 'Menu non trouvé' });
            }
            menus.platinfo.push({
                nomplat,
                descripplat,
                imageplat: req.file.filename,
                prixplat
            });
            const updatedMenu = await menus.save();
            res.status(200).json({successs: true,msg: "Menu envoyer", Data: updatedMenu});
        } catch (error) {
            res.status(400).json({successs: false,msg: error.message});
        }

    },

    //Fonction pour modifier un plat
    modifierPlat : async(req, res) =>{

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        const menuId = req.params.menuId;  
        const platId = req.params.platId;  
        const { nomplat, descripplat, prixplat } = req.body;  
        try {
            const menus = await menu.findById(menuId);
            if (!menus) {
                return res.status(404).json({ message: 'Menu non trouvé' });
            }
            const plat = menus.platinfo.id(platId);
            if (!plat) {
                return res.status(404).json({ message: 'Plat non trouvé' });
            }
            // Mettre à jour les champs du plat
            plat.nomplat = nomplat || plat.nomplat;
            plat.descripplat = descripplat || plat.descripplat;
            plat.prixplat = prixplat || plat.prixplat;

            const updatedMenu = await menus.save();
            res.status(200).json(updatedMenu);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du plat', error });
        }

    },

    //Fonction pour modifier un plat
    supprimerPlat : async(req, res) => {

        // Récupérer le token de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization']; 
        const idUser = jwtutils.getUserId(headerAuth); 
        if (idUser < 0) {
            return res.status(400).json({ success: false, msg: "Token invalide ou manquant" });
        }

        const menuId = req.params.id; 
        const nomplat = req.body.nomplat;

        try {
            const menus = await menu.findById(menuId);

            if (!menus) {
                return res.status(404).json({ message: 'Menu non trouvé' });
            }

            menus.platinfo.pull({ nomplat: nomplat });

            await menus.save();

            res.status(200).json({ message: 'Plat supprimé avec succès', menus });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression du plat', error });
        }

    }

}




