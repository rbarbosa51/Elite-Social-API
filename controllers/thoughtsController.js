const Thought = require("../models/Thought");
const User = require("../models/User");

//Global constants
const notFoundError = "No such thought";
const statusCodes = [200, 404, 500];
const otherUserFeedback = [
  "No such user",
  "Thought successfully deleted",
  "No such thought or reaction",
];

module.exports = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(statusCodes[0]).json(thoughts);
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      thought
        ? res.status(statusCodes[0]).json(thought)
        : res.status(statusCodes[1]).json({ message: notFoundError });
      return;
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async createNewThought(req, res) {
    try {
      const user = await User.findById(req.body.userId);
      //Guard -- Exit if no user found
      if (!user) {
        res.status(statusCodes[1]).json({ message: otherUserFeedback[0] });
        return;
      }
      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
      });
      await user.thoughts.push(thought._id);
      await user.save();
      res.status(statusCodes[0]).json({ thought });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async updateThoughtById(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body }
      );
      thought
        ? res.status(statusCodes[0]).json(thought)
        : res.status(statusCodes[1]).json({ message: notFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async deleteThoughtById(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      thought
        ? res.status(statusCodes[0]).json({ message: otherUserFeedback[1] })
        : res.status(statusCodes[1]).json({ message: notFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
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
        ? res.status(statusCodes[0]).json(thought)
        : res.status(statusCodes[1]).json({ message: notFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
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
        ? res.status(statusCodes[0]).json(thought)
        : res.status(statusCodes[1]).json({ message: otherUserFeedback[2] });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
};
