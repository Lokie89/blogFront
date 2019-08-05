
'use strict';
const express = require('express');
const router = express.Router();
const http = require('http');

router.all("*",function (req, res, next) {
    http.get('http://localhost:8080/', function (data) {
        let responseData = '';
        console.log('Response is ' + data.statusCode);
        data.on('data', function (chunk) {
            responseData += chunk;
        });

        data.on('end', function () {
            req.endPoints = JSON.parse(responseData);
            next();
        });
    });
});

module.exports = router;
