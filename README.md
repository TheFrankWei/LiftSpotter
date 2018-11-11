# LiftSpotter 

## Overview


LiftSpotter is a web app that will allow users to keep track of their lifting process. Users can create new lifting routines, record reps and sets, and record weight lifted. In addition, users can upload their routines online for other users to rate and use. 

## Data Model
The application will store Users, Lists and Items

* users can have multiple lists (via references)
* each list can have multiple items (by embedding)

An Example User:

```javascript
{
  username: "Chestbrah",
  hash: // a password hash,
  lists: // an array of references to List documents
  
}
```

An Example List with Embedded Items:

```javascript
{
  user: // a reference to a User object
  name: "5/3/1 Routine",
  Routine: [
    { name: "bench", sets and reps: [3, 8], weight: 225, finished: true},
    { name: "squats", sets and reps: [3, 8], weight: 435, finished: false},
  ],
  createdAt: // timestamp
}
```

## Wireframes

[Link to Wireframes](https://balsamiq.cloud/s3ici/puf7b)

## Site map

[Link to Site Map](https://balsamiq.cloud/s3ici/puf7b/r97A5)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new routine
4. as a user, I can view all of the routines I've created in a single list
5. as a user, I can add workouts to an existing routine
6. as a user, I can edit values in each workout (reps, set, weight)
7. as a user, I can mark routines as completed.
8. as a user, I can upload routines online
9. as a user, I can save routines online to my own
10. as a user, I can rate other users' routines online

## Research Topics

* Integrate user authentication
* Perform client side form validation using a JavaScript library

## [Link to Initial Main Project File](https://github.com/nyu-csci-ua-0480-003-fall-2017/yw1685-final-project/blob/master/src/app.js) 

