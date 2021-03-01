module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_ci',
    cookieKey: process.env.COOKIE_KEY,
    redisURL: process.env.REDIS_URL
  };
  