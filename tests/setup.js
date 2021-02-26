jest.setTimeout(300000); //Instruct jest to wait before failing a test due to long wait/timeout

require('../models/User');
require('../models/Blog');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true});

Number.prototype._called = {}; //fix for Jest error

