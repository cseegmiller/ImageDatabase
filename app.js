//setup requiresconst fs = require('fs');

const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app=express();

//storage setup
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function(req, file, cb){
        checkFile(file, cb);
    }
}).single('files')

//set up view engine
app.set('view engine', 'ejs');
//set static
app.use(express.static('./public'));

//route to index
app.get('/',(req,res)=>{
    res.render('index');
})
const serveIndex = require('serve-index'); 

app.use('/gallery', express.static('public/uploads'), 
  serveIndex('public/uploads', {
    'icons': true,
    template: 'views/gallery.ejs'
}))


//code for form post
app.post('/upload', (req, res)=>{
    upload(req, res, (err) => {
        if(err){
            res.render('index', {msg: err})
        }else{
            if(req.file == undefined){
                res.render('index', {msg: "no file selected"})
            }else{
                res.render('index', {
                    msg: 'file uploaded',
                    file: `uploads/${req.file.filename}`
                })
                console.log('file uploaded');
            }
        }
    })
   
})



//check for file type
function checkFile(file, cb){
    let fileEx = ['png', 'jpg', 'jpeg', 'gif']
    let isImageGood = fileEx.includes(file.originalname.split('.')[1].toLowerCase());
    let isMimeGood = file.mimetype.startsWith("image/");
    if(isImageGood && isMimeGood){
        return cb(null, true)
    }else{
        cb("Error, not an image file")
    }
}
//start server
app.listen(3000, ()=>{
    console.log('server is working');
})

