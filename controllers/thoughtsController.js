const Thought = require('../models/Thought');
const User = require('../models/User');
const Reaction = require('../models/Reaction');

module.exports = {
    async getAllThoughts(req,res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts)
        } catch (error) {
            res.status(500).json(error)
        }

    },
    async getSingleThought(req,res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
            thought ? res.status(200).json(thought) : res.status(404).json({message: 'No such thought'});
            return;
        } catch (error) {
            res.status(500).json(error)
        }
        
    },
    async createNewThought(req,res) {
        try {
            const user = await User.findById(req.body.userId);
            //Guard -- Exit if no user found
            if (!user) {
                res.status(404).json({message: 'No such user'});
                return;
            }
            const thought = await Thought.create({thoughtText: req.body.thoughtText, username: req.body.username});
            await user.thoughts.push(thought._id);
            await user.save();
            res.status(200).json({thought});
        } catch (error) {
            res.status(500).json(error);
        }
        
    },
    async updateThoughtById(req,res) {
        try {
            const thought = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$set:req.body});
            thought ? res.status(200).json(thought) : res.status(404).json({message: 'No such thought'});
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteThoughtById(req,res) {
        try {
            const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});
            thought ? res.status(200).json({message: 'Thought successfully deleted'}) : res.status(404).json({message: 'No such thought'})
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async createReaction(req,res) {
        try {
            const thought = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$addToSet: {reactions: req.body}}, {new: true});
            thought ? res.status(200).json(thought) : res.status(404).json({message: 'No such thought'});

        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteReaction(req,res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            //Guard - Exit if no thought
            if (!thought) {
                res.status(404).json({message: 'No such thought'});
                return;
            }
            await thought.reactions.pull(req.body.reactionId);
            thought = await thought.sabe();
            res.status(200).json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
