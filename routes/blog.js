'use strict';

const express = require('express');
const router = express.Router();
const http = require('http');

router.all('*', (req, res, next) => {
    http.get("http://localhost:8080" + req.endPoints.blog, function (data) {
        let responseData = '';
        data.on('data', function (chunk) {
            responseData += chunk;
        });

        data.on('end', function () {
            req.endPoints = JSON.parse(responseData);
            next();
        });
    });
});
router.get('/', (req, res, next) => {
    res.render('blog', {data: req.endPoints});
});

router.all('/:id', (req, res, next) => {
    let [blog] = req.endPoints.filter((e) => {
        return e.id == req.params.id;
    });
    req.blog = blog;
    next();
});


router.get('/:id', (req, res, next) => {
    res.render('blogDetail', {data: req.blog});
});
router.post('/:id', (req, res, next) => {
    let data = {
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content
    };
    httpRequest(req, res, next, req.blog._links.create, data);
});
router.put('/:id', (req, res, next) => {
    let data = {
        id: req.body.id,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content
    };
    httpRequest(req, res, next, req.blog._links.update, data);
});
router.delete('/:id', (req, res, next) => {
    let data = {
        id: req.body.id
    };
    httpRequest(req, res, next, req.blog._links.delete, data);
});

const callback = (response) => {
    let body = '';
    response.on('data', function (data) {
        body += data;
    });
    response.on('end', () => {
        console.log(body);
    })
}
const httpRequest = (req, res, next, _link, data) => {
    let options = {
        host: 'localhost',
        port: '8080',
        path: _link.href,
        method: _link.type,
        qs: data
    };

    let requestServer = http.request(options, callback);

    requestServer.end();
    res.status(200);
};


module.exports = router;
