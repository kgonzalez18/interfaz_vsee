var validFileExtensions = new Array('.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.pdf', '.txt', '.ppt', '.pptx', '.csv');

;(function () {
	$.ui.autocomplete.filter = function (array, term) {
		var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
		return $.grep(array, function (value) {
			return matcher.test(value.label || value.value || value);
		});
	};
})();

function getQueryStrings() {
	var assoc = {};
	var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
	var queryString = location.search.substring(1);
	var keyValues = queryString.split('&');
	if (queryString.length > 0)
		for (var i = 0; i < keyValues.length; i++) {
			var key = keyValues[i].split('=');
			if (key.length > 1) {
				assoc[decode(key[0])] = decode(key[1]);
			}
		}
	/*
	for (var pair in keyValues) {
	var key = keyValues[pair].split('=');
	if (key.length > 1) {
	assoc[decode(key[0])] = decode(key[1]);
	}
	}
	*/

	return assoc;
}

Date.prototype.getJulian = function () {
	return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
};

function sliderMove(sliderId, next) {
	var slider = $('#' + sliderId);
	var $current = slider.children(':visible');

	if (next) {
		var nextDiv = $current.next();
		if (nextDiv.length > 0) {
			$current.stop().hide("slide", { direction: "left" }, 1500, function () {
				$current.css({ "position": "absolute" });
			});
			nextDiv.css({ "position": "absolute" });
			nextDiv.stop().show("slide", { direction: "right" }, 1500, function () {
				nextDiv.css({ "position": "relative" });
			});
		}
	} else {
		var prevDiv = $current.prev();
		if (prevDiv.length > 0) {
			$current.stop().hide("slide", { direction: "right" }, 1500, function () {
				$current.css({ "position": "absolute" });
			});
			prevDiv.stop().show("slide", { direction: "left" }, 1500, function () {
				prevDiv.css({ "position": "relative" });
			});
		}
	}
}

function MayusculaSinAcento(sender) {
    var u = sender.value;
    u = u.toUpperCase();
	u = u.replace('Á', 'A');
	u = u.replace('É', 'E');
	u = u.replace('Í', 'I');
	u = u.replace('Ó', 'O');
	u = u.replace('Ú', 'U');
	sender.value = u;
}

function IdiomaDatePicker() {
	$.datepicker.regional[cultura] = {
		closeText: global.close,
		prevText: global.previous,
		nextText: global.next,
		currentText: global.calendar.today,
		monthNames: global.calendar.months.names,
		monthNamesShort: global.calendar.months.namesAbbr,
		dayNames: global.calendar.days.names,
		dayNamesShort: global.calendar.days.namesAbbr,
		dayNamesMin: global.calendar.days.namesShort,
		weekHeader: global.calendar.week,
		dateFormat: global.calendar.patterns.d,
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional[cultura]);
}

function IdiomaNotify() {
	$.pnotify.defaults.redisplay = global.notify.redisplay;
	$.pnotify.defaults.all = global.notify.all;
	$.pnotify.defaults.last = global.notify.last;
}

var buttonEnter;

document.onkeydown = function kd(e) {
    if (!e)
	    e = event || window.event;
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) {
		VCHI.Info('Init button Enter ' + buttonEnter);
		cancelDefaultAction(e);
		if (buttonEnter != undefined && buttonEnter != null && buttonEnter != '') {
			var selector = $('#' + buttonEnter);
			if (selector.length == 0) {
				VCHI.Info('Selector ' + buttonEnter + ' NOT FOUND!');
				return false;
			}
			selector[0].click();
			VCHI.Info(buttonEnter + ' CLICKED!');
		}
	}
}

function cancelDefaultAction(e) {
	var evt = e ? e : window.event;
	if (evt.preventDefault) evt.preventDefault();
	if (evt.cancelBubble != null) evt.cancelBubble = true;
	evt.returnValue = false;
	return false;
}

function getObjectsJson(obj, key, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getObjectsJson(obj[i], key, val));
		} else if (i == key && obj[key].toUpperCase() == val.toUpperCase()) {
			objects.push(obj);
		}
	}
	return objects;
}

function RedirectJS(url) {
    saliendo = true;
	window.location = url;
}

function SimularPostBack(postback) {
	var btnPostBack = document.getElementById(postback);
	btnPostBack.click();
}

function Show(id) {
	$('#' + id).css("display", "block");
}

function ShowInline(id) {
	$('#' + id).css("display", "inline-block");
}

function Hide(id) {
	$('#' + id).css("display", "none");
}

(function ($) {
    $.webMethod = function (options) {
        console.error("WebMethod esta marcado como OBSOLETO, usar RestwebMethod");
		var settings = $.extend({
			'methodName': '',
			'async': true,
			'cache': false,
			timeout: 30000,
			debug: false,
			'parameters': {},
			success: function (response) { },
			error: function (xmlHttpError, methodName, error, description) { }
		}, options); var parameterjson = "{}";
		var result = null;
		if (settings.parameters != null) { parameterjson = $.toJSON(settings.parameters); }
		$.ajax({
			type: "POST",
			url: location.pathname + "/" + settings.methodName,
			data: parameterjson,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			async: settings.async,
			cache: settings.cache,
			timeout: settings.timeout,
			success: function (value) {
				result = value.d;
				settings.success(result);
			},
			error: function (xmlHttpError, error, description) {
				settings.error(xmlHttpError, settings.methodName, error, description);
			}
		});
		return result;
	};
})(jQuery);


(function ($) {
    $.RestwebMethod = function (options) {
		var settings = $.extend({
			'methodName': '',
			'async': true,
			'cache': false,
			timeout: 30000,
			debug: false,
			'parameters': {},
			success: function (response) { },
			error: function (xmlHttpError, methodName, error, description) { }
		}, options); var parameterjson = "{}";
		var result = null;
        if (settings.parameters != null) { parameterjson = $.toJSON(settings.parameters); }
        $.ajax({
            type: "POST",
            url: "/api/v1/"+settings.methodName,
            data: parameterjson,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: settings.async,
            cache: settings.cache,
            beforeSend: function (xhr) {xhr.setRequestHeader('Authorization','Basic ' + window.publickey);},
            timeout: settings.timeout,
            success: function (value) {
                if (value != null) {
                    if (value.d != null){
                        result = value.d;
                    }
                    else {
                        result = value;
                    }
                    settings.success(result);
                }
            },
            error: function (xmlHttpError, error, description) {
                settings.error(xmlHttpError, settings.methodName, error, description);
            }
        });
        return result;
    };
})(jQuery);    

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

function ForzarCrossDomain() {
	if (!jQuery.support.cors && window.XDomainRequest) {
		var httpRegEx = /^https?:\/\//i;
		var getOrPostRegEx = /^get|post$/i;
		var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
		var xmlRegEx = /\/xml/i;

		// ajaxTransport exists in jQuery 1.5+
		jQuery.ajaxTransport('text html xml json', function (options, userOptions, jqXHR) {
			// XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
			if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
				var xdr = null;
				var userType = (userOptions.dataType || '').toLowerCase();
				return {
					send: function (headers, complete) {
						xdr = new XDomainRequest();
						if (/^\d+$/.test(userOptions.timeout)) {
							xdr.timeout = userOptions.timeout;
						}
						xdr.ontimeout = function () {
							complete(500, 'timeout');
						};
						xdr.onload = function () {
							var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
							var status = {
								code: 200,
								message: 'success'
							};
							var responses = {
								text: xdr.responseText
							};
							try {
								if (userType === 'json') {
									try {
										responses.json = JSON.parse(xdr.responseText);
									} catch (e) {
										status.code = 500;
										status.message = 'parseerror';
										//throw 'Invalid JSON: ' + xdr.responseText;
									}
								} else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
									var doc = new ActiveXObject('Microsoft.XMLDOM');
									doc.async = false;
									try {
										doc.loadXML(xdr.responseText);
									} catch (e) {
										doc = undefined;
									}
									if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
										status.code = 500;
										status.message = 'parseerror';
										throw 'Invalid XML: ' + xdr.responseText;
									}
									responses.xml = doc;
								}
							} catch (parseMessage) {
								throw parseMessage;
							} finally {
								complete(status.code, status.message, responses, allResponseHeaders);
							}
						};
						xdr.onerror = function () {
							complete(500, 'error', {
								text: xdr.responseText
							});
						};
						xdr.open(options.type, options.url);
						//xdr.send(userOptions.data);
						xdr.send();
					},
					abort: function () {
						if (xdr) {
							xdr.abort();
						}
					}
				};
			}
		});
	};
}

/*! jQuery JSON plugin 2.4.0 | code.google.com/p/jquery-json */
(function ($) {
	'use strict'; var escape = /["\\\x00-\x1f\x7f-\x9f]/g, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, hasOwn = Object.prototype.hasOwnProperty; $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
		if (o === null) { return 'null'; }
		var pairs, k, name, val, type = $.type(o); if (type === 'undefined') { return undefined; }
		if (type === 'number' || type === 'boolean') { return String(o); }
		if (type === 'string') { return $.quoteString(o); }
		if (typeof o.toJSON === 'function') { return $.toJSON(o.toJSON()); }
		if (type === 'date') {
			var month = o.getUTCMonth() + 1, day = o.getUTCDate(), year = o.getUTCFullYear(), hours = o.getUTCHours(), minutes = o.getUTCMinutes(), seconds = o.getUTCSeconds(), milli = o.getUTCMilliseconds(); if (month < 10) { month = '0' + month; }
			if (day < 10) { day = '0' + day; }
			if (hours < 10) { hours = '0' + hours; }
			if (minutes < 10) { minutes = '0' + minutes; }
			if (seconds < 10) { seconds = '0' + seconds; }
			if (milli < 100) { milli = '0' + milli; }
			if (milli < 10) { milli = '0' + milli; }
			return '"' + year + '-' + month + '-' + day + 'T' +
hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
		}
		pairs = []; if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) { pairs.push($.toJSON(o[k]) || 'null'); }
			return '[' + pairs.join(',') + ']';
		}
		if (typeof o === 'object') {
			for (k in o) {
				if (hasOwn.call(o, k)) {
					type = typeof k; if (type === 'number') { name = '"' + k + '"'; } else if (type === 'string') { name = $.quoteString(k); } else { continue; }
					type = typeof o[k]; if (type !== 'function' && type !== 'undefined') { val = $.toJSON(o[k]); pairs.push(name + ':' + val); }
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	}; $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) { return eval('(' + str + ')'); }; $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		var filtered = str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''); if (/^[\],:{}\s]*$/.test(filtered)) { return eval('(' + str + ')'); }
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	}; $.quoteString = function (str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape, function (a) {
				var c = meta[a]; if (typeof c === 'string') { return c; }
				c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};
} (jQuery));

jQuery(function () {
	jQuery("#linkMostrarMiCuenta").on("click", function (e) {
		e.preventDefault();
		jQuery('a[href=#tabMiCuenta]').click();
		jQuery('a[href=#MisDatos]').click();
		return false;
	});
});

window.VCHI = {};
VCHI.INFO = false;

VCHI.Info = function (whatToPrint) {
	if (VCHI.INFO)
		console.log(new Date().getTime() + ' INFO: ' + whatToPrint);
};

VCHI.Global = {};
VCHI.Global.initValidarRequisitosMinimos = false;

jQuery(function () {
	var osName = "Unknown OS";
	var browserName = "Unknown Browser";

	if (navigator.appVersion.match(/Win/)) osName = "windows";
	else if (navigator.appVersion.match(/Mac/)) osName = "macOS";

	if (!!navigator.userAgent.match(/Chrome/)) browserName = "chrome";
	else if (!!navigator.userAgent.match(/Safari/)) browserName = "safari";
	else if (!!navigator.userAgent.match(/MSIE/) || !!navigator.userAgent.match(/Trident/)) browserName = "ie";
	else if (!!navigator.userAgent.match(/Firefox/)) browserName = "firefox";
	if (browserName == "safari") {
		$("head").append('<style type="text/css">select { -webkit-appearance: none; }</style>');
	}
	else if (browserName == "chrome" && osName == "macOS") {
		$("head").append('<style type="text/css">select { -webkit-appearance: none; }</style>');
	}
});


//Function encargada de limpiar el modal de Alergia
function LimpiarCamposModales(containerName) {
	$(containerName + " select").prop('selectedIndex', 0);
    $(containerName + " input[type=text]").val('');
    $(containerName + " textarea").val('');
    $(containerName + ".radio").prop('checked', false);
    $(containerName + " input[type=radio]").prop('checked', false);
    $(containerName + " input:checkbox").prop('checked', false);
    var chk = $(containerName + " span.checked");
    chk.each(function (i) { $(this).toggleClass('checked'); });
    Page_ClientValidateReset();
}

function Page_ClientValidateReset() {
    if (typeof (Page_Validators) != "undefined") {
        for (var i = 0; i < Page_Validators.length; i++) {
            var validator = Page_Validators[i];
            validator.isvalid = true;
            ValidatorUpdateDisplay(validator);
        }
    }
}