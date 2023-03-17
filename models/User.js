const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: Schema.Types.String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => {
                    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
                },
                message: p => `${p.value} is not a valid email address!`
            }
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);
userSchema.virtual('friendCount').get( function() {
    return this.friends.length;
});
const User = model('user', userSchema);
module.exports = User;
