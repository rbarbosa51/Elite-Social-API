const Thought = require("../models/Thought");
const User = require("../models/User");

//Global constants

const http_200 = 200;
const http_404 = 404;
const http_500 = 500;
const msg = {
  notThoughtFound: "No such thought",
  notUserFound: "No such user",
  thoughtDeleted: "Thought successfully deleted",
  noThoughtorReaction: "No such thought or reaction",
};


module.exports = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(http_200).json(thoughts);
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      thought
        ? res.status(http_200).json(thought)
        : res.status(http_404).json({ message: msg.notThoughtFound });
      return;
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async createNewThought(req, res) {
    try {
      const user = await User.findById(req.body.userId);
      //Guard -- Exit if no user found
      if (!user) {
        res.status(http_404).json({ message: msg.notUserFound });
        return;
      }
      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
      });
      await user.thoughts.push(thought._id);
      await user.save();
      res.status(http_200).json({ thought });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async updateThoughtById(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body }
      );
      thought
        ? res.status(http_200).json(thought)
        : res.status(http_404).json({ message: msg.notThoughtFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async deleteThoughtById(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      thought
        ? res.status(http_200).json({ message: msg.thoughtDeleted })
        : res.status(http_404).json({ message: msg.notThoughtFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      thought
        ? res.status(http_200).json(thought)
        : res.status(http_404).json({ message: msg.notThoughtFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { new: true }
      );
      thought
        ? res.status(http_200).json(thought)
        : res.status(http_404).json({ message: msg.noThoughtorReaction });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
};
