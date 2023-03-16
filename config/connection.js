const { connect, connection } = require('mongoose');

//127.0.0.1:27017
connect('mongodb://127.0.0.1:27017/EliteSocial', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
