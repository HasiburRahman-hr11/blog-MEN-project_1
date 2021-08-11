const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const {bindUserWithReq} = require('./authMiddlewares')
const setLocals = require('./setLocals');


const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/test-blog',
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 240 
});

const middlewares = [
    express.urlencoded({extended:true}),
    express.json(),
    express.static("public"),
    morgan('dev'),
    session({
        secret: 'SECRET_KEY',
        resave: false,
        saveUninitialized: true,
        store:store
    }),
    flash(),
    bindUserWithReq(),
    setLocals()
    
]


module.exports = (app) =>{
    middlewares.map(middleware => app.use(middleware))
}