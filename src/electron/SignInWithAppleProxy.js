
var webviewPersistId = 'applesignin.tuto.com';
var arrScopes = ['name', 'email'];

var SignInWithApple = {

    signin: function (options, successCallback, errorCallback) {

        var scopes = options.requestedScopes.map(scopeId => arrScopes[scopeId]).join('%20');
        var redirectURI = options.redirectURI;
        var clientId = options.clientId;
        var redirectUriObj = document.createElement('a');
        redirectUriObj.href = redirectURI;

        var webview = document.createElement('webview');
        webview.setAttribute('id', 'apple-login');
        webview.setAttribute('partition', 'persist:' + webviewPersistId);
        webview.src = 'https://appleid.apple.com/auth/authorize?client_id='+clientId+'&redirect_uri='+redirectURI+'&response_type=code%20id_token&scope='+scopes+'&response_mode=fragment';

        var el = document.getElementById('background-loading-applesignin');
        el.appendChild(webview);
        webview.addEventListener('load-commit', _loadcommit);

        function _loadcommit(event) {
            var currUrl = document.createElement('a');
            currUrl.href = event.url;
            if (currUrl.hostname === redirectUriObj.hostname) {
                _parseAndProcess(event);
            }
        }

        function _parseAndProcess(event) {

            var responseUrl = document.createElement('a');
            responseUrl.href = event.url;

            var searchParams = new URLSearchParams(responseUrl.hash.substring(1));
            var params = {};

            searchParams.forEach(function (val, key) {
                params[key]=val;
            });

            if (params['code']) {
                view.close();
                successCallback(params);
            } else {
                view.close();
                errorCallback(params);
            }

            webview.removeEventListener('load-commit', _loadcommit);
        }

    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);
