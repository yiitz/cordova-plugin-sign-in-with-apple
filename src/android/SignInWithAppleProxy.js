
var arrScopes = ['name', 'email'];

var SignInWithApple = {

    signin: function (options, successCallback, errorCallback) {

        var scopes = options.requestedScopes.map(scopeId => arrScopes[scopeId]).join('%20');
        var redirectURI = options.redirectURI;
        var clientId = options.clientId;
        var redirectUriObj = document.createElement('a');
        redirectUriObj.href = redirectURI;

        var view = cordova.InAppBrowser.open('https://appleid.apple.com/auth/authorize?client_id='+clientId+'&redirect_uri='+redirectURI+'&response_type=code&scope='+scopes+'&response_mode=form_post');

        view.addEventListener('loadstart', _loadstart);

        function _loadstart(event) {
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
                view.close();
                successCallback(arrParams['data']);
            } else {
                view.close();
                errorCallback(arrParams['message']);
            }

            view.removeEventListener('loadstart', _loadstart);
        }

    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);