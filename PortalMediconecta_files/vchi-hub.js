;$(function () {
    VCHI.Hub = VCHI.Hub || $.connection.vchiHub;

    VCHI.pacienteEnFilaLoaded = function () {
        return typeof VCHI.PacientesEnFila !== "undefined";
    }

    VCHI.Hub.client.actualizarListaAgendamiento = function () {
        startPollingCitasAgendadas();
    };

    VCHI.Hub.client.actualizarPacientesEnFila = function (data) {
        if (VCHI.pacienteEnFilaLoaded()) {
            VCHI.PacientesEnFila.Add(data);
        }
    };

    VCHI.Hub.client.quitarPacienteEnFila = function (data) {
        if (VCHI.pacienteEnFilaLoaded()) {
            VCHI.PacientesEnFila.Remove(data);
        }
    };

    VCHI.Hub.client.refreshFilaPacientes = function () {
        if (VCHI.pacienteEnFilaLoaded()) {
            VCHI.PacientesEnFila.Refresh();
        }
    };

    VCHI.Hub.client.estatusPacienteEnFila = function (data) {
        if (VCHI.pacienteEnFilaLoaded()) {
            VCHI.PacientesEnFila.Estatus(data);
        }
    };

    VCHI.Hub.client.actualizarHistoricoDeCitas = function () {
        if (typeof VCHI.ListadoHCitas !== "undefined") VCHI.ListadoHCitas.actualizarHistoricoDeCitas();
    };

    VCHI.Hub.client.actualizarHistoricoDeCitasExamenes = function () {
        if (typeof VCHI.ListadoHCitas !== "undefined") VCHI.ListadoHCitas.actualizarHistoricoDeCitas();
     //   if (typeof VCHI.ListadoExamenPaciente !== "undefined") VCHI.ListadoExamenPaciente.actualizarExamenes();
    };

    VCHI.Hub.client.actualizarHistoricoDeCitasPrescripciones = function () {
        if (typeof VCHI.ListadoPrescripcionesPaciente !== "undefined") VCHI.ListadoPrescripcionesPaciente.actualizarPrescripciones();
        //if (typeof VCHI.ListadoHCitas !== "undefined") VCHI.ListadoHCitas.actualizarHistoricoDeCitas();
    };

    VCHI.Hub.client.actualizarHistoricoDeCitasPrescripcionesExamenes = function () {
        if (typeof VCHI.ListadoPrescripcionesPaciente !== "undefined") VCHI.ListadoPrescripcionesPaciente.actualizarPrescripciones();
      //  if (typeof VCHI.ListadoHCitas !== "undefined") VCHI.ListadoHCitas.actualizarHistoricoDeCitas();
      // if (typeof VCHI.ListadoExamenPaciente !== "undefined") VCHI.ListadoExamenPaciente.actualizarExamenes();
    };

    VCHI.startHub = function () {
        $.connection.hub.logging = true;
        $.connection.hub.start().done(function () { console.log("Connected, transport = " + $.connection.hub.transport.name) });
    };

    VCHI.startHub();

    $.connection.hub.disconnected(function () {
        if (VCHI.pacienteEnFilaLoaded() && VCHI.PacientesEnFila.mostrarAvisoDesconexion) {
            $('.disconnectedMsg').toggleClass('hidden');
            setTimeout(function () {
                VCHI.PacientesEnFila.Refresh();
                VCHI.startHub();
            }, 1500);
        }
    });
});