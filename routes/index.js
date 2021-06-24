const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Contact = require('../models/contact');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Delete Route
router.get('/delete/:id', function(req, res) {

  var id = req.params.id;
  Contact.findByIdAndRemove(id, ensureAuthenticated, function(err){
    if(err){
      console.log(err)
    }
    else{
      res.redirect('/dashboard')
    }
  })

});

// Update Route
router.get('/update/:id', ensureAuthenticated,function(req, res) {

  var id = req.params.id;
  Contact.findById(id)
  .then((result) => res.render('update', {
    user: req.user,
    data: result
  }))
  .catch((err) => console.log(err))

});

// Update Route
router.post('/update/contact/:id', ensureAuthenticated,function(req, res) {

  var id = req.params.id;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  Contact.findByIdAndUpdate(id, {name: name, email: email, phone: phone})
  .then((result) => res.redirect('/dashboard'))
  .catch((err) => console.log(err))

});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  Contact.find()
  .then((result) => res.render('dashboard', {
    user: req.user,
    data: result
  }))
  .catch((err) => console.log(err))
);

module.exports = router;
