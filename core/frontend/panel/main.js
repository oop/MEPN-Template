$(function () {
    window.socket = io('/panel', {forceNew: true});
    socket.on('ping', function (data) {
        socket.on('ping', function(data) {
            console.log(data)
        });
    });
});