var ScormApi = function () {
    return {
        play: function () {
            $.get('/api/state/1111', function (data) {

                data = $.extend(true, data, { itemStates: undefined })
                var api = new ScormAPIImplement('1111', '1111', '/ScormPackage/01/index.html')
                var state = []
                if (data.itemStates != undefined) {
                    api.LMSSetValue('cmi.location', data.itemStates[data.itemStates.length - 1].cmi.location)
                }
                window.API = api;
                window.API_1484_11 = api;
                
                api.Initialize()
            })
        }
    }
}();