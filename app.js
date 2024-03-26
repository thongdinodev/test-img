var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var imgSchema = require('./model.js');
var fs = require('fs');
var path = require('path');
app.set("view engine", "ejs");
require('dotenv').config();
 
mongoose.connect('mongodb+srv://admin-thong:Test123@cluster0.rzln4di.mongodb.net/testImg')
.then(console.log("DB Connected"))
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
 
app.get('/', async (req, res) => {
    await imgSchema.find({})
    .then((data, err)=>{
        if(err){
            console.log(err);
        }
        res.render('imagePage',{items: data})
    })
});
 
 
app.post('/', upload.single('image'), async (req, res, next) => {
    console.log(req.file);
 
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    console.log(obj);
    console.log('before post');
    await imgSchema.create(obj)
    .then ((err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
    console.log('after');
    res.redirect('/');
});
 
var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})