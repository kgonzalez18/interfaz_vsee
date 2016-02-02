var globalvideoConferencia;
var globalCamara;
var globalMicrofono;
var globalVSee;
var globalPostBack;
var globalRealizarPostBack;
var detector;

function ValidarRequesitosMinimos(videoConferencia, vCamara, vMicrophone, vVSee, postback, realizarPostback) {
	globalvideoConferencia = videoConferencia;
	globalCamara = document.getElementById(vCamara);
	globalMicrofono = document.getElementById(vMicrophone);
	globalVSee = document.getElementById(vVSee);
	globalPostBack = document.getElementById(postback);
	globalRealizarPostBack = realizarPostback;
	if (globalvideoConferencia == 'Tokbox') {
	    if ((typeof OT !== "undefined") && (OT.checkSystemRequirements() == OT.HAS_REQUIREMENTS)) {
			OT.getDevices(devicesDetectedHandlerVideoTest);
		} else {
			globalCamara.value = 'true';
			globalMicrofono.value = 'true';
			if (globalRealizarPostBack)
				globalPostBack.click();
		}
	} else if (globalvideoConferencia == 'VSee') {
		try {
			if (!App.isiOS() && !App.isAndroid()) {
				initDetectVSee();
				$('div[id^="SwfStore_vsee"]').hide();
				detector.isVSeeInstalled(function(installed, data) {
					if (installed == "installed")
						globalVSee.value = true;
					else
						globalVSee.value = false;
					if (globalRealizarPostBack)
						globalPostBack.click();
				});
			} else {
				globalVSee.value = true;
				if (globalRealizarPostBack)
					globalPostBack.click();
			}
		} catch (err) {
			globalVSee.value = 'false';
			if (globalRealizarPostBack)
				globalPostBack.click();
		}
	}
	return false;
}

function devicesDetectedHandlerVideoTest(error, devices) {
	if (error == undefined && devices != undefined) {
		var camara = globalCamara;
		var microphone = globalMicrofono;

		camara.value = 'false';
		microphone.value = 'false';

		if (devices)
			$.each(devices, function (index, device) {
				if (device.kind == "audioInput")
					microphone.value = 'true';
				else if (device.kind == "videoInput")
					camara.value = 'true';
			});

		if (globalRealizarPostBack)
			globalPostBack.click();
	}
}

var initDetectVSee = function () {
	if (detector == null || detector == undefined)
		detector = new VSeeDetect({ debug: false, debugSwf: false });
};
