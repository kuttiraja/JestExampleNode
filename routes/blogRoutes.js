const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const clearHash = require('../middlewares/clearHash');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    const blogs = await Blog
    .find({ _user: req.user.id })
    .cache({key: req.user.id});
    // console.log("Serving from MongoDB");

    res.send(blogs);

    // const redis = require ('redis');
    // const redisUrl = 'redis://127.0.0.1:6379'
    // const client = redis.createClient(redisUrl);
    // const util = require('util');

    // client.get = util.promisify(client.get);
    // // Do we have data in Redis related to the query
    // const cachedBlogs = await client.get(req.user.id);

    // if(cachedBlogs) {
    //   console.log("Serving from Cache")
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    // // if yes, then respond to the request right away.

    // // if no, reach mongoDB

    // const blogs = await Blog.find({ _user: req.user.id });
    // console.log("Serving from MongoDB");

    // res.send(blogs);
    // client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, clearHash, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
    // clearHash(req.user.id);
  });
};
