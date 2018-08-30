var ScormAPIImplement = (function () {
    function ScormAPIImplement(packageId, referenceId, packageBaseUrl, state, debug) {
        if (debug === void 0)
        {
             debug = true;
        }

        this.packageId = packageId;
        this.referenceId = referenceId;
        if (this.referenceId === '' || this.referenceId.length === 0) {
            this.referenceId = undefined;
        }
        this.packageBaseUrl = packageBaseUrl;
        this.currentResourceUri = null;

        this.timeout = null;
        this.startTime = null;
        
        this.state = state || {};
        this.state.item_states = this.state.item_states || [];

        this.debug = debug;
        this.commitStack = [];
        this.errors = [];
        this.debug = debug;

        this.LMSInitialize = this.Initialize;
        this.LMSFinish = this.Terminate;
        this.LMSGetValue = this.GetValue;
        this.LMSSetValue = this.SetValue;
        this.LMSCommit = this.Commit;
        this.LMSGetLastError = this.GetLastError;
        this.LMSGetErrorString = this.GetErrorString;
        this.LMSGetDiagnostic = this.GetDiagnostic;
    }

    ScormAPIImplement.prototype.Initialize = function () {
        try {
            this.CallLog('Initialize');
            $('#scorm-frame').attr('src', this.packageBaseUrl);
            this.currentResourceUri = this.packageBaseUrl;
            this.StartTimer();
            return 'true';
        }
        catch (e) {
            return 'true';
        }
    };

    ScormAPIImplement.prototype.Terminate = function (emptyString) {
        this.Commit(emptyString);
        this.StopTimer();
        return 'true';
    };

    ScormAPIImplement.prototype.GetValue = function (element) {
        var itemState = this.state.item_states[0];
        var value = readByPath(itemState, element);
        return value || '';
    };

    ScormAPIImplement.prototype.SetValue = function (element, value) {
        var itemState = this.state.item_states[0];
        if (!itemState) {
            itemState = {
                resource_uri: this.currentResourceUri
            };
            this.state.item_states.push(itemState);
        }
        var returnValue = setByPath(itemState, element, value);
        return returnValue;
    };

    ScormAPIImplement.prototype.Commit = function (emptyString) {
        var _this = this;
        var success = function (newStates) {
            _this.state.item_states = newStates;
        };
        $.ajax({
            type: 'POST',
            url: '/api/state',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                packageId: this.packageId,
                referenceId: this.referenceId,
                itemStates: this.state.item_states
            }),
            dataType: 'json',
            success: success
        });
        return 'true';
    };

    ScormAPIImplement.prototype.GetLastError = function () {
        this.CallLog('GetLastError: ');
        return this.errors.slice(-1)[0] || 0;
    };

    ScormAPIImplement.prototype.GetErrorString = function (parameter) {
        this.CallLog('GetErrorString: ' + parameter);
        return 'not implement';
    };

    ScormAPIImplement.prototype.GetDiagnostic = function (parameter) {
        this.CallLog('GetDianostic: ' + parameter);
        return 'true';
    };

    ScormAPIImplement.prototype.CallLog = function (...args) {
        if (this.debug) {
            console.log(args);
        }
    };

    ScormAPIImplement.prototype.StartTimer = function () {
        var intervalTime = 30000;
        var self = this;
        this.startTime = Date.now();
        this.timeout = setTimeout(function () {
            self.StopTimer();
            self.StartTimer();
        }, intervalTime);
    };

    ScormAPIImplement.prototype.StopTimer = function () {
        if (!this.startTime) {
            return 0;
        }
        var timeDuration = Date.now() - this.startTime;
        clearTimeout(this.timeout);
        $.ajax({
            type: 'POST',
            url: '/api/state/timespent',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                package_id: this.packageId,
                reference_id: this.referenceId,
                time_spent: Math.round(timeDuration / 1000)
            }),
            dataType: 'json'
        });
        return timeDuration;
    };

    return ScormAPIImplement;
}());

function readByPath(values, path) {
    if (!path) {
        return undefined;
    }
    return path.split('.').reduce(function (prev, next) {
        if (prev) {
            if (next === '_count') {
                return prev.length;
            }
            return prev[next];
        }
        return undefined;
    }, values);
}

function setByPath(target, path, value) {
    if (!target) {
        target = {};
    }
    if (typeof path === 'string') {
        return setByPath(target, path.split('.'), value);
    }
    else if (path.length === 1 && value !== undefined) {
        return target[path[0]] = value;
    }
    else if (path.length === 0) {
        return target;
    }
    else {
        if (!target[path[0]]) {
            target[path[0]] = {};
        }
        return setByPath(target[path[0]], path.slice(1), value);
    }
}
