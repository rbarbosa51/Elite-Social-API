const User = require('../models/User');

module.exports = {
    getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createNewUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  updateById(req,res) {
    res.send('Not finished')
  },
  deleteUser(req,res) {
    User.findOneAndDelete({_id: req.params.userId})
    .then((user) => !user ? res.status(400).json({message: 'No user with that ID'}) : res.json({message: 'User was deleted'}))
  },
  addNewFriendUserList(req,res) {
    User.findOneAndUpdate({_id: req.params.userId}, {$addToSet: {friends: req.params.friendId}})
    .then( (friend) => !friend ? res.send(404).json({message: 'No friend with that ID'}) : res.send(friend))
    .catch((error) => res.status(500).json({error}));
  },
  removeFriendUserList(req,res) {
    res.send('Not finished')
  }
};
