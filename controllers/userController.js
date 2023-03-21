const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    async getAllUsers(req, res) {
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json(error);
      }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({_id: req.params.userId});
      user ? res.status(200).json(user) : res.status(404).json({message: 'No user with that ID'});
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async createNewUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async updateById(req,res) {
    try {
      const user = await User.findOneAndUpdate({_id: req.params.userId},{$set:req.body});
      user ? res.status(200).json(user) : res.status(404).json({message: 'No user with that ID'});
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteUser(req,res) {
    try {
      const user = await User.findOneAndDelete({_id: req.params.userId});
      
      user ? res.status(200).json({message: 'User succesfully deleted!'}) : res.status(404).json({message: 'No user with that ID'});
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async addNewFriendUserList(req,res) {
    try {
      const friend = await User.findOneAndUpdate({_id: req.params.userId}, {$addToSet: {friends: req.params.friendId}}, { runValidators: true, new: true });
      friend ? res.status(200).send(friend) : res.send(404).json({message: 'No friend with that ID'});
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async removeFriendUserList(req,res) {
    try {
      const user = await User.findById(req.params.userId);
      //Guard - exit if no user
      if (!user) {
        res.status(404).json({message: 'No user with that ID'});
        return;
      }
      await user.friends.pull(req.params.friendId);
      user = await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    } 
  }
};

/*
    User.findOneAndUpdate({_id: req.params.userId}, {$pull: {friends: {ObjectId: req.params.friendId}}}, {new: true })
    .then(user => !user ? res.status(404).json({message: 'No user with that id'}) : res.json(user))
    .catch(error => res.status(500).json(error))
    */