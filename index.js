const Client = require("./src/Client");

const { prefix, developerID, token } = require("./config/config.json");

const application = new Client(token, prefix, developerID);
application.connect();
