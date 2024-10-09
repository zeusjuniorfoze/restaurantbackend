let jwt = require('jsonwebtoken')
require('dotenv').config();


module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '3h'

        })
    },

    parseAuthorization: function(authoization){
        return (authoization != null) ? authoization.replace('Bearer ', '') : null;
    },

    getUserId: function(authoization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authoization);
        if(token != null) {
            try{
                var jwtToken = jwt.verify(token, process.env.JWT_SECRET);
                if(jwtToken != null)
                    userId = jwtToken.userId

            }catch(err){ }
        }

        return userId
    }

}