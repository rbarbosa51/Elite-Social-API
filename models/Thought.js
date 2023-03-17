const {Schema, model} = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: Schema.Types.String,
            required: true,
            min: 1,
            max: 280
        },
        createAt: {

        },
        username: {
            type: Schema.Types.String,
            required: true
        },
        reactions: [Reaction]

    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);
module.exports = Thought;