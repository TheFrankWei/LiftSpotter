const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var bcrypt   = require('bcrypt-nodejs');
const fs = require('fs');

// * a workout list
// * includes the quantity of sets and reps (in an Array), the weight of each rep,
// * description of the workout, and a boolean to mark a workout as done
const Workout = new mongoose.Schema({
	Sets: {type: Number, required: true},
	Reps: {type: Number, required: true},
	Exercise: {type: String, required: true},
});

// * a routine
// * each list must have a related user
// * a list can have 0 or more items
const Routine = new mongoose.Schema({
	user: String, //creator of the list's ID
	name:{type: String, required: true},
	setList: [Workout], //double array of the day x workouts on that day
	visible: String
});

const User = new mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
				visible			 : String
    }
});

Routine.plugin(URLSlugs('name'));

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', User);
mongoose.model('Routine', Routine);
mongoose.model('Workout', Workout);


// is the environment variable, NODE_ENV, set to PRODUCTION?
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 let dbconf = conf.dbconf;
 mongoose.connect(dbconf);
} else {
 // if we're not in PRODUCTION mode, then use
 let dbconf = 'mongodb://localhost/finalProj';
 mongoose.connect(dbconf);
}


// mongoose.connect('mongodb://localhost/finalProj');
