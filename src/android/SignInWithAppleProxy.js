
var arrScopes = ['name', 'email'];

var SignInWithApple = {

    signin: function (options, successCallback, errorCallback) {

        var scopes = options.requestedScopes.map(scopeId => arrScopes[scopeId]).join('%20');
        var redirectURI = options.redirectURI;
        var clientId = options.clientId;
        var redirectUriObj = document.createElement('a');
        redirectUriObj.href = redirectURI;

        var view = cordova.InAppBrowser.open('https://appleid.apple.com/auth/authorize?client_id='+clientId+'&redirect_uri='+redirectURI+'&response_type=code%20id_token&scope='+scopes+'&response_mode=fragment','_blank');

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

            view.removeEventListener('loadstart', _loadstart);
        }

    }
};

module.exports = SignInWithApple;

require("cordova/exec/proxy").add("SignInWithApple", SignInWithApple);