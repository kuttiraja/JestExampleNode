const mongoose = require('mongoose')
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys')


const redisClient = redis.createClient(keys.redisURL);
redisClient.get = util.promisify(redisClient.get);
redisClient.hget = util.promisify(redisClient.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key|| 'default'); // 'default' in case no key is passed

    return this;
}

mongoose.Query.prototype.exec = async function() {

    if(!this.useCache){
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {collection: this.mongooseCollection.name}));
    
    // See if we have a value for 'key' in redis
    const cacheValue = await redisClient.hget(this.hashKey, key);

    // if yes, return
    if(cacheValue){
        // console.log(cacheValue);
        // console.log(this);
        const doc = JSON.parse(cacheValue);

        //cacheValue can be an array or a single document.
        return Array.isArray(doc) 
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
        // return returnDoc;
    }
    // Otherwise, issue the query

    const result = await exec.apply(this, arguments);

    // redisClient.set(key, JSON.stringify(result),'EX', 10);
    redisClient.hset(this.hashKey, key, JSON.stringify(result),'EX', 10);
    return result;

}

module.exports = {
    clearHash(hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    }
};