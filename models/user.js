const { Schema, model } = require('mongoose');

var validateEmail = function (email) {
    var val = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    return val.test(email);
}

const userSchema = new Schema (
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please fill a valid email address']
        }, 
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        }, 
        id: false,
    }
);


userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;