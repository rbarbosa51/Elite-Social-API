const {Schema, model} = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Schema.Types.ObjectId()
        },
        reactionBody: {
            type: Schema.Types.String,
            required: true,
            maxlength: 280
        },
        username: {
            type: Schema.Types.String,
            required: true
        },
        createdAt: {
            type: Schema.Types.Date,
            default: Date.now
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);
reactionSchema.methods.getTime = function() {
    return Date.format(this.createdAt);
}
module.exports = reactionSchema;