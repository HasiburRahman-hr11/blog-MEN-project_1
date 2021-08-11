const authRoute = require('./authRotes');
const dashboardRoute = require('./dashboardRoutes');
const postRoute = require('./postRoutes');
const uploadRoute = require('./uploadRoutes');
const explorerRoute = require('./explorerRoute');
const authorRoute = require('./authorRoute');
const apiRoute = require('../api/routes/apiRoutes');
const searchRoute = require('./searchRoute');


const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/users',
        handler: authorRoute
    },
    {
        path : '/dashboard',
        handler: dashboardRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/posts',
        handler: postRoute
    },
    {
        path: '/posts',
        handler: explorerRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/api',
        handler: apiRoute
    },
    {
        path: '/',
        handler: (req,res,next) =>{
            res.redirect('/posts')
        }
    }
]

const setRoutes = (app) =>{
    routes.map(route => {
        if(route.path === '/'){
            app.get(route.path , route.handler)
        }else{
            app.use(route.path , route.handler)
        }
    })
}

module.exports = setRoutes