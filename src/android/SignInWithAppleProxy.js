
var arrScopes = ['name', 'email'];

var SignInWithApple = {

    signin: function (options, successCallback, errorCallback) {

        var scopes = options.requestedScopes.map(scopeId => arrScopes[scopeId]).join('%20');
        var redirectURI = options.redirectURI;
        var clientId = options.clientId;
        var redirectUriObj = document.createElement('a');
        redirectUriObj.href = redirectURI;

        var view = cordova.InAppBrowser.open('https://appleid.apple.com/auth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectURI + '&response_type=code%20id_token&scope=' + scopes + '&response_mode=fragment', '_blank', 'location=no,hardwareback=no');

        var finished = false;
        view.addEventListener('loadstart', _loadstart);

        view.addEventListener('exit', _exit);

        function _exit() {
            if (!finished) {
                errorCallback(-1);
                finished = true;
                view.removeEventListener('loadstart', _loadstart);
                view.removeEventListener('exit', _exit);
            }
        }
        function _loadstart(event) {
            if (event.url.startsWith(redirectUriObj.href)) {
                _parseAndProcess(event);
            }
        }

        function _parseAndProcess(event) {

            var responseUrl = document.createElement('a');
            responseUrl.href = event.url;

            var searchParams = new URLSearchParams(responseUrl.hash.substring(1));
            var params = {};

            searchParams.forEach(function (val, key) {
                params[key] = val;
            });

            if (params['code']) {
                view.close();
                successCallback(params);
            } else {
                view.close();
                errorCallback(params);
            }

            finished = true;
            view.removeEventListener('loadstart', _loadstart);
            view.removeEventListener('exit', _exit);
        }

    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);