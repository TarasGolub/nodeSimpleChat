var express = require('express');
var rooms = require('./data/rooms.json');
var messages = require('./data/messages.json');
var uuid = require('uuid');
var _ = require('lodash');
var users = require('./data/users.json');

var router = express.Router();
module.exports = router;

router.get('/rooms', function (req, res) {
    res.json(rooms);
});

router.route('/rooms/:roomId/messages')
    .get(function (req, res, next) {
        var roomId = req.params.roomId;
        var room = _.find(rooms, r => r.id === roomId);
        var roomMessages = messages
            .filter(m => m.roomId === roomId)
            .map(m => {
                var user = _.find(users, u => u.id === m.userId);
                var now = new Date(m.time);
                now = now.getHours() + ':' + now.getMinutes();
                return {text: `[${now}] ${user.name}: ${m.text}`};
            });

        if (!room) {
            next("No such room((");
            return;
        }

        res.json({
            room: room,
            messages: roomMessages
        });
    })
    .post(function (req, res) {
        var roomId = req.params.roomId;
        var now = new Date();
        var message = {
            text: req.body.text,
            roomId: roomId,
            userId: req.user.id,
            time: now,
            id: uuid.v4()
        }
        messages.push(message);
        res.sendStatus(200);
    })
    .delete(function (req, res) {
        var roomId = req.params.roomId;
        messages = messages.filter(m => m.roomId !== roomId);
        res.sendStatus(200);
    });