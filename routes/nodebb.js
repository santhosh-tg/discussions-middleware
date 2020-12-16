const proxyUtils = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy');
const { NODEBB_SERVICE_URL } = require('../helpers/environmentVariablesHelper.js');
const { logger } = require('@project-sunbird/logger');
const BASE_REPORT_URL = "/discussion";
const express = require('express');
const app = express();
const mongo = require('../helpers/dbConnection');

// TODO: need to remove the static forum id and add the actual ID getting from DB
app.get(`${BASE_REPORT_URL}/forumId/:id`, async (req, res) => {
  const id = req.params.id;
  if(id) {
    const response = await getForumId(id);
    res.send(response);
   }
});

app.post(`${BASE_REPORT_URL}/forum`, async (req, res, next) => {
  const object = req.body;
  if(object) {
   const response = await addDetails(object);
   res.send(response);
  }
});

app.get(`${BASE_REPORT_URL}/tags`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories`, proxyObject());
app.get(`${BASE_REPORT_URL}/notifications`, proxyObject());

app.get(`${BASE_REPORT_URL}/user/:userslug`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/upvoted`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/downvoted`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/bookmarks`, proxyObject())

// categories apis
app.get(`${BASE_REPORT_URL}/category/:category_id/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories`, proxyObject());
app.get(`${BASE_REPORT_URL}/category/:cid`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories/:cid/moderators`, proxyObject());

// topic apis
app.get(`${BASE_REPORT_URL}/unread`, proxyObject());
app.get(`${BASE_REPORT_URL}/recent`, proxyObject());
app.get(`${BASE_REPORT_URL}/popular`, proxyObject());
app.get(`${BASE_REPORT_URL}/top`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/:topic_id/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/unread/total`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/teaser/:topic_id`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/pagination/:topic_id`, proxyObject());

// groups api
app.get(`${BASE_REPORT_URL}/groups`, proxyObject());
app.get(`${BASE_REPORT_URL}/groups/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/groups/:slug/members`, proxyObject());

// post apis
app.get(`${BASE_REPORT_URL}/recent/posts/:day`, proxyObject());

// all admin apis
app.get(`${BASE_REPORT_URL}/user/admin/watched`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/info`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/bookmarks`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/posts`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/groups`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/upvoted`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/downvoted`, proxyObject());

// topics apis
app.post(`${BASE_REPORT_URL}/v2/topics`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/state`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyObject());

// categories apis
app.post(`${BASE_REPORT_URL}/v2/categories`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyObject());

// groups apis 
app.post(`${BASE_REPORT_URL}/v2/groups`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyObject());


// post apis 
app.put(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyObject());

// util apis 
app.post(`${BASE_REPORT_URL}/v2/util/upload`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyObject());

// user api
app.post(`${BASE_REPORT_URL}/v2/users`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/password`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/users/:uid/chats`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyObject());
app.get(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/tokens/:token`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/username/:username`, proxyObject());



function getForumId(id) {
  return new Promise((resolve) => {
    try {
      mongo.then(async (db) => {
        const dbo = db.db('nodebb');
        const data = await dbo.collection('sbcategory_category').findOne({id: id});
        resolve(data);
      });
    }
    catch(error) {  
      resolve(error);
    }
  })
}

function addDetails(object) {
  return new Promise((resolve) => {
    try {
      mongo.then(async (db) => {
        const dbo = db.db('nodebb');
        const data = await dbo.collection('sbcategory_category').insertOne(object);
        resolve(data);
      });
    }
    catch(error) {
      resolve(error);
    }
  });
}


function proxyObject() {
  return proxy(NODEBB_SERVICE_URL, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/discussion', '');
      let query = require('url').parse(req.url).query;
      if (query) {
        return require('url').parse(NODEBB_SERVICE_URL + urlParam + '?' + query).path
      } else {
        return require('url').parse(NODEBB_SERVICE_URL + urlParam).path
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
        const data = JSON.parse(proxyResData.toString('utf8'));
        logger.info({ message: `${req.url} called ${JSON.stringify(data)}` });
        if (proxyRes.statusCode === 404 && (typeof data.message === 'string')) {
          res.send(data)
        } else {
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        }
      } catch (err) {
        logger.info({ message: `Error while htting the ${req.url} ${err.message}` });
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  })
}

module.exports = app;