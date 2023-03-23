const User = require("../models/User");
const Thought = require("../models/Thought");

//Global Constants
const statusCodes = [200, 404, 500];
const NotFoundError = "No user with that ID";

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-__v");
      res.status(statusCodes[0]).json(users);
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );
      user
        ? res.status(statusCodes[0]).json(user)
        : res.status(statusCodes[1]).json({ message: NotFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async createNewUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(statusCodes[0]).json(user);
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async updateById(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body }
      );
      user
        ? res.status(statusCodes[0]).json(user)
        : res.status(statusCodes[1]).json({ message: NotFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      //Guard - exit if no user
      if (!user) {
        res.status(statusCodes[1]).json({ message: NotFoundError });
        return;
      }
      /*Bonus -> Delete all associated thoughts before deleting
      Return value (user) is the value before deletion.
      We can then extract the username to delete the thoughts if available*/
      const deletedCount = await Thought.deleteMany({
        username: user.username,
      });
      console.log(deletedCount);
      res
        .status(statusCodes[0])
        .json({ message: "User and thoughts were succesfully deleted!" });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async addNewFriendUserList(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      friend
        ? res.status(statusCodes[0]).send(friend)
        : res.send(statusCodes[1]).json({ message: NotFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
  async removeFriendUserList(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { $eq: req.params.friendId } } },
        { new: true }
      );
      user
        ? res.status(statusCodes[0]).json(user)
        : res.status(statusCodes[1]).json({ message: NotFoundError });
    } catch (error) {
      res.status(statusCodes[2]).json(error);
    }
  },
};
