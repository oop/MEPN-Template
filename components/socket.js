class Socket {
    constructor(that) {
        this.io = that.io;
    }

    main() {
        this.io.of('site').on('connection', (socket) => {
            socket.emit('ping', '[ws/site] Server responding...');
           console.log('Client connected.')
        });
        this.io.of('panel').on('connection', (socket) => {
            socket.emit('ping', '[ws/panel] Server responding...');
            console.log('Admin connected.')
        });
    }
}

module.exports = Socket;