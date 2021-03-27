const express = require('express');
require('dotenv').config()
const request = require('request');
const querystring = require('querystring');

let app = express()

let redirect_uri = process.env.REDIRECT_URI;

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    const access_token = body.access_token;
    res.redirect(process.env.FRONTEND_URI + '#access_token=' + access_token)
  })
})

console.log(`Listening on port ${process.env.PORT}. Go /login to initiate authentication flow.`)
app.listen(process.env.PORT)