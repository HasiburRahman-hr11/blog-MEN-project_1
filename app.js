const express = require('express');
const mongoose = require('mongoose');
const Flash = require('./utils/Flash');

const chalk = require('chalk');
require('dotenv').config();

const app = express();



// set ejs view engine
app.set('view engine' , 'ejs');
app.set('views', 'view');



// Using Middlewares
const useMiddlewares = require('./middlewares/middlewares');
useMiddlewares(app);


// useing routes
const setRoutes = require('./routes/routes');
setRoutes(app);

// Error Pages

app.use((req,res,next) => {
    let error = new Error('404 page not found!')
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    if(error.status === 404){
        return res.render('error/404' , {
            title: '404 Error | Blog',
            flashMessage: Flash.getMessage(req)
        })
    }
    
    res.render('error/500' , {
        title: 'Internal Server Error | Blog',
        flashMessage: Flash.getMessage(req)
    })
    
})



const PORT = process.env.PORT || 3001


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pu1ex.mongodb.net/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(()=>{
    console.log(chalk.green.inverse('Database Connected'))
    app.listen(PORT , ()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})
.catch(e=>{
    console.log(e);
})