const User = require('../models/User');

const newUser = new User({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    salt: 'random_salt',
    profile: {
        name: 'John Doe',
        age: 25,
        gender: 'Male',
        location: 'New York',
        bio: 'Hello, I am John Doe.'
    }
});

newUser.save((err, user) => {
    if (err) return console.log(err);
    console.log('User saved successfully', user);
});