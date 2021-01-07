var webviewPersistId = 'applesignin.tuto.com';

function _callWebview(onSignInViewLoaded, callback) {
    var webview = document.createElement('webview');

    webview.setAttribute('id', 'apple-signin');
    webview.setAttribute('partition', 'persist:' + webviewPersistId);
    webview.setAttribute('minwidth', '576');
    webview.setAttribute('minheight', '580');
    webview.setAttribute('height', '580');
    webview.setAttribute('style', 'height:580px!important');
    webview.addEventListener('loadcommit', _loadcommit);
    webview.src = 'http://localhost:9004';
    document.body.appendChild(webview);

    function _loadcommit(event) {
        console.log('_loadcommit event', event);
        var currUrl = document.createElement('a');
        currUrl.href = event.url;
        if (currUrl.hostname !== 'localhost') {
            onSignInViewLoaded(webview);
        }
        //webview.removeEventListener('loadcommit', _loadcommit);
    }
}

var SignInWithApple = {

    login: function (successCallback, errorCallback, options) {
        console.log('options', options);
        var http = window.require('http');
        var server = http.createServer(handleRequest);
        server.listen(9004);
        var param = 'scope=' + options[0].scopes;
        param += '&client_id=' + options[0].webClientId;
        param += '&redirect_uri=http://localhost:9004';
        param += '&response_type=code,id_token';
        param += '&state=code';

        var modal;

        function _appendWebview(webview) {
            document.getElementById('background-loading-applesignin').appendChild(webview);
        }

        function handleRequest(request, response) {
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(
                '<html>' +
                '<body>' +
                '<script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/fr_FR/appleid.auth.js"></script>' +
                '<script type="text/javascript">' +
                "AppleID.auth.init({" +
                "    clientId : 'com.tuto.website'," +
                "    scope : 'name email'," +
                "    redirectURI : 'https://fr.tuto.com'," +
                "    state : 'abcdefg'," +
                "    nonce : 'nonce-abcdef'," +
                "    usePopup : false //or false defaults to false" +
                "});" +
                "try {" +
                "     const data = await AppleID.auth.signIn()" +
                "} catch ( error ) {" +
                "     console.error(error)" +
                "}" +
                '</script>' +
                '</body>' +
                '</html>'
            );
            response.end();
        }

        _callWebview(_appendWebview);
    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);