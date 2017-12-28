$(function () {
    window.socket = io('/site', {forceNew: true});

    socket.on('ping', function(data) {
        console.log(data)
    });

    window.languageTest = () => {
        alert(translation.label)
    };

    window.languageChange = () => {
        window.location = '?lang=' + $("#language").val();
    };
});