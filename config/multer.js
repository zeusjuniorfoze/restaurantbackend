const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Importer la configuration Cloudinary

// Configuration du stockage pour Multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RestaurantImages', // Dossier où stocker les images dans Cloudinary
    format: async (req, file) => 'png', // Format de l'image (facultatif)
    public_id: (req, file) => Date.now() + '-' + file.originalname // Nom de fichier unique
  }
});

const upload = multer({ storage });

module.exports = upload;
