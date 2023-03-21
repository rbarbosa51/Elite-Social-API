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
            type: Date,
            default: Date.now,
            get: v => `Created at: ${v}`
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
            getters: true
        }
    }
);
thoughtSchema.methods.getTime = function() {
    return Date.format(this.createdAt);
}
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);
module.exports = Thought;