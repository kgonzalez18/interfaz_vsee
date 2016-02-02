﻿/*
* Globalize Culture es
*
* http://github.com/jquery/globalize
*
* Copyright Software Freedom Conservancy, Inc.
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* This file was generated by the Globalize Culture Generator
* Translation: bugs found in this file need to be fixed in the generator
*/

(function (window, undefined) {

	var Globalize;

	if (typeof require !== "undefined" &&
        typeof exports !== "undefined" &&
        typeof module !== "undefined") {
		// Assume CommonJS
		Globalize = require("globalize");
	} else {
		// Global variable
		Globalize = window.Globalize;
	}

	Globalize.addCultureInfo("es", "default", {
		name: "es",
		englishName: "Spanish",
		nativeName: "español",
		language: "es",
		close: 'Cerrar',
		next: 'Sig>',
		previous: '<Ant',
		numberFormat: {
			",": ".",
			".": ",",
			"NaN": "NeuN",
			negativeInfinity: "-Infinito",
			positiveInfinity: "Infinito",
			percent: {
				",": ".",
				".": ","
			},
			currency: {
				pattern: ["-n $", "n $"],
				",": ".",
				".": ",",
				symbol: "€"
			}
		},
		calendars: {
			standard: {
				today: 'Hoy',
				week: 'Sm',
				firstDay: 1,
				days: {
					names: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
					namesAbbr: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
					namesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']
				},
				months: {
					names: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', ''],
					namesAbbr: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', '']
				},
				AM: null,
				PM: null,
				eras: [{ "name": "d.C.", "start": null, "offset": 0}],
				patterns: {
					d: "dd/mm/yy",
					moment: "DD/MM/YYYY"
				}
			}
		},
		notify: {
			redisplay: "Mostrar",
			all: "Todos",
			last: "Últimos",
		},
});

} (this));