require('../app/models/db.js');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Routine = mongoose.model('Routine');
const Workout = mongoose.model('Workout');

module.exports = function (app, passport) {

    app.get("/", function (req, res) {
        res.render("homepage.hbs");
    });

    app.get("/login", function (req,res){
      res.render("login.hbs", { message: req.flash('signupMessage') });
    });

    app.get('/logout', function(req, res){
      req.logout();
      // console.log('current user is: ' + req.user);
      res.redirect('/');
    });

    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/' + req.user.id, // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    app.post('/login', passport.authenticate('local-login', {failureRedirect: '/login',  failureFlash : true }), function(req,res){
        res.redirect( '/' + req.user.id); // redirect to the secure profile section
    });

    app.get("/registration", function (req,res){
      res.render("registration.hbs", { message: req.flash('signupMessage')});
    });

    app.post('/registration', passport.authenticate('local-registration', {failureRedirect: '/login',  failureFlash : true }), function(req,res){
        res.redirect( '/' + req.user.id); // redirect to the secure profile section
    });


    app.get('/:userID', checkLoggedIn, function(req, res){
      const userID = req.user.id;
      // console.log('current user is: ' +req.user.local.email);
      User.findOne({_id : userID}, function(err, users){
        // console.log('found user!' + users.id);
    	   Routine.find({user: userID},function(err,routines){
           res.render('LiftSpotter.hbs', {user: users, routine: routines});
         });
      });
    });

    app.get('/:userID/accountSettings', checkLoggedIn, function(req, res){
      const userID = req.user.id;
      // console.log('current user is: ' +req.user);
      User.findOne({_id : userID}, function(err, users){
           res.render('accountSettings.hbs', {user: users});
      });
    });

    app.post('/:userID/accountSettings', checkLoggedIn, function(req, res){
      const userID = req.user.id;
      const visible = req.body.visible;
      // console.log('current visibility is: ' + visible );
      if (visible === 'private'){
        makePrivate(userID);
      } else if (visible === 'public'){
        makePublic(userID);
      }
      res.redirect('/' + userID + '/accountSettings');
    });

    app.get('/:userID/all', checkLoggedIn, function(req, res){
      const userID = req.user.id;
      Routine.find({}, function(err,routines){
        let filtered = routines.filter(function(element){
          // console.log(element.name);
          return (element.visible === 'public');
        });
        res.render('LiftSpotter-All.hbs', {routine: filtered, user: userID});
      });
    });

    app.post('/:userID/add', function(req,res){
      const userID = req.user.id;
    	const routine = new Routine({
        name: req.body.title,
        setList: [],
        user: userID,
        visible: req.user.local.visible
      }).save(()=>{
    		    res.redirect('/' + userID);
    	  });
    });

    app.get('/:userID/:slug', checkLoggedIn, function(req,res){
      const userID = req.user.id;
    	const slug = req.params.slug;
      let isUser = false;
    	// console.log(slug);

      User.findOne({_id : userID}, function(err, users){
        // console.log('found user!');
    	   Routine.findOne({slug: slug}, function(err, routines) {
            if (routines.user === userID){
              isUser = true;
            }
    		     res.render('Routine-Slug.hbs', {user: users, routine: routines, isUser: isUser});
    	   });
      });
    });


    //map to delete all workouts?????
    app.post('/:userID/deleteRoutine', function(req, res){
      const userID = req.user.id;
      const deleteid = req.body.delete;
      // console.log('workout Id is to be removed is: ' + deleteid);
      Routine.findOne({_id: deleteid}, function(err, routines){
        routines.remove();
        routines.save(()=>{
            res.redirect('/' + userID);
          });
      });
    });

    app.post('/:userID/:slug', function(req, res){
      const userID = req.user.id;
    	const slug = req.params.slug;
    	const workout = new Workout({
    		Exercise: req.body.exercise,
    		Sets: req.body.sets,
        Reps: req.body.reps
      });
    	workout.save((err, workout) => {
    		Routine.findOne({slug: slug}, function(err, routines){
    			routines.setList.push(workout);
    			routines.save(()=>{
    				res.redirect('/' + userID + '/' + slug);
    			});
    		});
    	});
    });

app.post('/:userID/:slug/delete', function(req, res){
  const userID = req.user.id;
  const slug = req.params.slug;
  Routine.findOne({slug: slug}, function(err, routines) {
  const deleteid = req.body.delete;
    // console.log('workout Id is to be removed is: ' + deleteid);
       routines.setList.id(deleteid).remove();
         routines.save(()=>{
         Workout.findOne({_id:deleteid}, function(err, workouts){
           workouts.remove();
           workouts.save(()=>{
             res.redirect('/' + userID+ '/' + slug);
           });
         });
       });
    });
});

}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
}

function makePublic(userID){
  User.findOne({_id : userID}, function(err, users){
    users.local.visible = 'public';
    users.save();
    Routine.find({user: userID},function(err,routines){
      return routines.map(function(element){
        // console.log('public');
        // console.log(element.name);
        element.visible = 'public';
        element.save();
      });
    });
  });
}

function makePrivate(userID){
  User.findOne({_id : userID}, function(err, users){
    users.local.visible = 'private';
    users.save();
    Routine.find({user: userID},function(err,routines){
      return routines.map(function(element){
        // console.log('private');
        element.visible = 'private';
        element.save();
      });
    });
  });
}
