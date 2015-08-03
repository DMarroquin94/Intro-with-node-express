var express = require('express');

var router = express.Router();
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    
});

mongoose.connect('mongodb://localhost/data');

var Schema = mongoose.Schema;

//create schema
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    type: String,
    email: String,
    phone: String
});

userSchema.methods.getAttributes = function(user) {
     var u = {
        username: user.username,
        email: user.email,
        phone: user.phone
    };

    return u
};

//create model using schema
var User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});


router.get('/customers', function (req, res) {
    res.redirect('/isUserLoggedIn/customers');

});

router.get('/viewcustomers', function (req, res) {
    res.redirect('/isUserLoggedIn/customers');
});


router.get('/create', function (req, res) {
    res.redirect('/isUserLoggedIn/create');
});

router.get('/customerlist', function (req, res) {
    User.find({}, function (err, users) {
        if (err) throw err;

        res.send((users));
    });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {   
    
    var newUser = new User({
        username: (req.body.username === "")? "----" : req.body.username,
        password: (req.body.username === "")? "----" : req.body.userpass,
        type: (req.body.username === "")? "----" : req.body.usertype,
        email: (req.body.usermail === "")? "----" : req.body.useremail,
        phone: (req.body.userphone === "")? "----" : req.body.userphone
    })
    
    newUser.save(function (err, newUser) {
        if (err) return console.error(err);
    });

    res.redirect('customers')
});

router.delete('/deleteuser/:username', function (req, res) {   
    
    var userToDelete = req.params.username;

    console.log(userToDelete)
    User.findOneAndRemove({ username: userToDelete}, function (err, user) {
        if (err) throw err;
    });

    res.send( {msg: '' });
});


router.get('/edituser/:username', function (req, res) {
    var userToEdit = req.params.username;
  
    User.find({ username: userToEdit}, function (err, user) {
        var u = user.toString();
        var a = u.split("\n")

console.log(a[5].substring(10, (a[4].length + 5)));
        res.render('edit', {
            title: "customer edit page ",
            username: a[1].substring(13, (a[1].length - 2)),
            email: a[4].substring(10, (a[4].length - 2)),
           // phone: a[5].substring(10, (a[4].length - 2))
        });
    });
});

router.post('/updateuser', function (req, res) {
    var userName =  req.body.username;
    var userEmail = req.body.usermail;
    var userPhone = req.body.userphone;
    var userPic = req.body.userpic; 
    var userId = req.body.userid; 

    User.findOneAndUpdate({ username: req.body.username}, 
        {username: userName,
        email: userEmail,
        phone: userPhone}, function (err, user) {
            if (err) throw err;
        });

    res.redirect('customers');
});

module.exports = router;