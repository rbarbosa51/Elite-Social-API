const { connect, connection } = require("mongoose");

const connectionURL = "mongodb://127.0.0.1:27017/EliteSocial";

connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
