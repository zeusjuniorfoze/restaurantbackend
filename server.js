//importation des module
require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
require('./config/connection');

let userRouter = require('./routes/userRouter').router
let menuRouter = require('./routes/menuRouter').router
let reservationRouter = require('./routes/reservationRouter').router

//instantiate server
let server = express()


//body parser configuration
server.use(bodyParser.urlencoded({ extended: true}))
server.use(bodyParser.json())

server.use(express.static('public'))

server.use(cors({
    origin:'*'
}));




//configurer les route



server.use('/api/', userRouter)
server.use('/api/', menuRouter)
server.use('/api/', reservationRouter)

// ecouter

server.listen(8080, function(){
    console.log('server en ecoute')
})
