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
            !thought ? res.status(404).json({message: 'No such thought'}) : res.status(200).json(thought);
            return;
        } catch (error) {
            res.status(500).json(error)
        }
        
    },
    async createNewThought(req,res) {
        try {
            const user = await User.findById(req.body.userId);
            const thought = await Thought.create({thoughtText: req.body.thoughtText, username: req.body.username});
            await user.thoughts.push(thought._id);
            await user.save();
            res.status(200).json({thought});
        } catch (error) {
            res.status(500).json(error);
        }
        
    },
    updateThoughtById(req,res) {

    },
    deleteThoughtById(req,res) {

    },
    createReaction(req,res) {

    },
    deleteReaction(req,res) {
        
    }
}
