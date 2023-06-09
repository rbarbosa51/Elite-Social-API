const User = require("../models/User");
const Thought = require("../models/Thought");

//Global Constants
const http_200 = 200;
const http_404 = 404;
const http_500 = 500;
const msg = {
  noUserFound: "No user with that ID",
  successDeletion: "User and thoughts were succesfully deleted!",
};

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-__v");
      res.status(http_200).json(users);
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );
      user
        ? res.status(http_200).json(user)
        : res.status(http_404).json({ message: msg.noUserFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async createNewUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(http_200).json(user);
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async updateById(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body }
      );
      user
        ? res.status(http_200).json(user)
        : res.status(http_404).json({ message: msg.noUserFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      //Guard - exit if no user
      if (!user) {
        res.status(http_404).json({ message: msg.noUserFound });
        return;
      }
      /*Bonus -> Delete all associated thoughts before deleting
      Return value (user) is the value before deletion.
      We can then extract the username to delete the thoughts if available*/
      const deletedCount = await Thought.deleteMany({
        username: user.username,
      });
      console.log(deletedCount);
      res.status(http_200).json({ message: msg.successDeletion });
    } catch (error) {
      res.status(http_500).json(error);
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
        ? res.status(http_200).send(friend)
        : res.send(http_404).json({ message: msg.noUserFound });
    } catch (error) {
      res.status(http_500).json(error);
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
        ? res.status(http_200).json(user)
        : res.status(http_404).json({ message: msg.noUserFound });
    } catch (error) {
      res.status(http_500).json(error);
    }
  },
};
