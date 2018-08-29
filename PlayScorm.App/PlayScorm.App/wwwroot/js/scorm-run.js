var ScormApi = function () {
    return {
        play: function () {
            var api = new ScormAPIImplement('1111', '1111', '/ScormPackage/01/index.html')
            window.API = api;
            window.API_1484_11 = api;
        }
    }
}();