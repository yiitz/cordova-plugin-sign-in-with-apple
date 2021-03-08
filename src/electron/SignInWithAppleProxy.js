
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
        webview.src = 'https://appleid.apple.com/auth/authorize?client_id='+clientId+'&redirect_uri='+redirectURI+'&response_type=code&scope='+scopes+'&response_mode=form_post';

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

            var searchParams = new URLSearchParams(responseUrl.search);
            var arrParams = [];

            searchParams.forEach(function (val, key) {
                var subArraySplited = key.split('[');
                if (subArraySplited.length > 1) {
                    if (!arrParams.hasOwnProperty(subArraySplited[0])) {
                        arrParams[subArraySplited[0]] = [];
                    }
                    arrParams[subArraySplited[0]][subArraySplited[1].slice(0, -1)] = val;
                } else {
                    arrParams[key] = val;
                }
            });

            if (arrParams['status'] === 'success') {
                successCallback(arrParams['data']);
            } else {
                errorCallback(arrParams['message']);
            }

            webview.removeEventListener('load-commit', _loadcommit);
        }

    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);
