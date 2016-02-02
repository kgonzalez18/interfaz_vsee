function Room(roomId, apiKey, sessionId, token, configuration) {
	this.roomId = roomId;
	this.apiKey = apiKey;
	this.sessionId = sessionId;
	this.token = token;
	this.configuration = configuration;

	this.messageTemplate = Handlebars.compile(this.findElement("#messageTemplate").html());
	this.messageTemplateSuscribers = Handlebars.compile(this.findElement("#messageTemplateSuscribers").html());
	this.userStreamTemplate = Handlebars.compile(this.findElement("#userStreamTemplate").html());
	this.notifyTemplate = Handlebars.compile(this.findElement("#notifyTemplate").html());
	this.initialized = false;

	this.chatData = [];
	this.filterData = {};
	this.allRooms = {};
	this.subscribers = {};
	this.leader = false;

	var self = this;

	var parentDiv = this.findElement("#" + this.configuration.targetElementPublisher);
	var divId = 'myPublisher';
	var publisherDiv = this.userStreamTemplate({ id: divId });
	parentDiv.append(publisherDiv);

	if (!this.configuration.autoPublish)
		$('#myPublisher').hide();

	OT.addEventListener("exception", this.exceptionEventHandler);

	this.publisher = OT.initPublisher(divId, {
		width: this.configuration.publisherWidth ? this.configuration.publisherWidth : "100%",
		height: this.configuration.publisherHeight ? this.configuration.publisherHeight : "100%"
	});

	this.session = OT.initSession(this.apiKey, this.sessionId);
	this.session.on({
		"sessionDisconnected": this.sessionDisconnected,
		"streamCreated": this.streamCreated,
		"streamDestroyed": this.streamDestroyed,
		"connectionCreated": this.connectionCreated,
		"connectionDestroyed": this.connectionDestroyed,
		"signal": this.signalReceived
	}, this);

	this.connect();

	this.findElement("#" + this.configuration.displayChat).click(function () {
		self.findElement("#" + self.configuration.messageInput).focus();
	});

	this.findElement("#" + this.configuration.messageInput).keypress(function (e) {
		self.inputKeypress(e);
	});

	this.findElement("#" + this.configuration.buttonChat).click(function (e) {
		if(e.isDefaultPrevented())
			e.preventDefault();
		self.processMessage();
		return false;
	});
}

Room.prototype.exceptionEventHandler = function (event) {
	var exit = false;
	if (room && room.configuration && room.configuration.fnException)
		exit = room.configuration.fnException(event);
	if (exit)
		return;
	//if (event.code == 1013 || event.code == 1500) {
	//	if (room && room.configuration && room.configuration.autoRecord)
	//		self.triggerActivity('record', 'stop');
	//	if(room)
	//		room.sendSignal("reload", { reload: true });
	//	location.reload();
	//}
};

Room.prototype.findElement = function(selector) {
	var element = $(selector);
	//if (element.length == 0)
		//element = $('iframe').contents().find(selector);
	return element;
};

Room.prototype.saveLog = function (message) {
	if (this.configuration.fnSaveLog)
		this.configuration.fnSaveLog(message);
	console.log(message);
};

Room.prototype.connect = function () {
	var self = this;

	this.session.connect(this.token, function (err) {
		//self.connect();
		var countConnections = 0;
		if(self && self.session && self.session.connections)
			countConnections = self.session.connections.length();

		self.findElement('#myPublisher').removeClass('OT_mini');
		if (err) {
			var exit = false;
			if (self.configuration.fnConnect)
				exit = self.configuration.fnConnect(countConnections, err);
			if (exit)
				location.reload();
			return;
		}
		self.myConnectionId = self.session.connection.connectionId;
		self.name = self.configuration.guestName;
		self.allRooms[self.myConnectionId] = self.name;
		if (self.configuration.autoPublish)
			self.startPublishing();
		if (self.configuration.fnConnect)
			self.configuration.fnConnect(countConnections);
		if (self.configuration.autoRecord)
			self.triggerActivity('record', 'start');
		self.sendSignal("connect", { cid: self.myConnectionId, name: self.name });
	});
};

Room.prototype.disconnect = function () {
	if (this.configuration.autoRecord)
		this.triggerActivity('record', 'stop');
	this.session.disconnect();
};

Room.prototype.startPublishing = function () {
	if(!this.configuration.autoPublish)
		$('#myPublisher').show();
	this.session.publish(this.publisher);
};

Room.prototype.stopPublishing = function () {
	this.session.unpublish(this.publisher);
};

Room.prototype.stopSubscribers = function () {
	for (var streamConnectionId in this.subscribers)
		if (this.subscribers[streamConnectionId] && this.subscribers[streamConnectionId].stream)
			this.session.forceUnpublish(this.subscribers[streamConnectionId].stream);
};

Room.prototype.reSubscribers = function () {

	var parentDiv = this.findElement("#" + this.configuration.targetElementSubscriber);
	parentDiv.html(null);
	var divId = 'mySubscribe';
	var publisherDiv = this.userStreamTemplate({ id: divId });
	parentDiv.append(publisherDiv);

	for (var streamConnectionId in this.subscribers)
		if (this.subscribers[streamConnectionId]) {
			var stream = this.subscribers[streamConnectionId].stream;
			if (stream) {
				this.session.unsubscribe(stream);
				this.subscribers[streamConnectionId] = this.session.subscribe(stream, divId, {
					width: this.configuration.subscriberWidth ? this.configuration.subscriberWidth : "100%",
					height: this.configuration.subscriberHeight ? this.configuration.subscriberHeight : "100%",
					audioVolume: 100
				});
			}
		}
};

Room.prototype.publishVideo = function (enabled) {
	this.publisher.publishVideo(enabled);
};

Room.prototype.publishAudio = function (enabled) {
	this.publisher.publishAudio(enabled);
};

Room.prototype.getSubscribersImgData = function () {
	var imgData = [];
	for (var streamConnectionId in this.subscribers)
		imgData.push(this.subscribers[streamConnectionId].getImgData());
	return imgData;
};

Room.prototype.getImgData = function () {
	return this.publisher.getImgData();
};

Room.prototype.sessionDisconnected = function (event) {
	this.saveLog("session Disconnected");

	var override = false;
	if (this.configuration.fnSessionDisconnected)
		override = this.configuration.fnSessionDisconnected(event);
	if (override)
		return;

	var msg = (event.reason === "forceDisconnected") ? "Fue removido de la sala" : "Se ha desconectado, intente de nuevo la conexion";
	alert(msg);
	
	if (this.configuration.autoRecord)
			this.triggerActivity('record', 'stop');

	window.location.reload();
};

Room.prototype.streamCreated = function (event) {
	this.saveLog("stream Created");

	var override = false;
	if (this.configuration.fnStreamCreated)
		override = this.configuration.fnStreamCreated(event);
	if (override)
		return;

	var streamConnectionId = event.stream.connection.connectionId;

	var parentDiv = this.findElement("#" + this.configuration.targetElementSubscriber);
	var divId = 'mySubscribe';
	var publisherDiv = this.userStreamTemplate({ id: divId });
	parentDiv.append(publisherDiv);

	this.subscribers[streamConnectionId] = this.session.subscribe(event.stream, divId, {
		width: this.configuration.subscriberWidth ? this.configuration.subscriberWidth : "100%", 
		height: this.configuration.subscriberHeight ? this.configuration.subscriberHeight : "100%",
		audioVolume: 100,
	});
	this.syncStreamsProperty();

	this.findElement('#mySubscribe').removeClass('OT_mini');
};

Room.prototype.streamDestroyed = function (event) {
	this.saveLog("stream Destroyed");

	var override = false;
	if (this.configuration.fnStreamDestroyed)
		override = this.configuration.fnStreamDestroyed(event);
	if (override)
		return;

	this.removeStream(event.stream.connection.connectionId);
};

Room.prototype.connectionCreated = function (event) {
	this.saveLog("connection Created");

	var override = false;
	if (this.configuration.fnConnectionCreated)
		override = this.configuration.fnConnectionCreated(event);
	if (override)
		return;

	var cid = event.connection.connectionId;
	if (!this.allRooms[cid])
		this.allRooms[cid] = this.configuration.guestName;
	var dataToSend = { chat: this.chatData, filter: this.filterData, users: this.allRooms, random: [1, 2, 3], leader: this.leader };
	if (this.archiveId && this.findElement('#recordButton').hasClass("selected"))
		dataToSend.archiveId = this.archiveId;
	this.sendSignal("initialize", dataToSend, event.connection);
};

Room.prototype.connectionDestroyed = function (event) {
	this.saveLog("connection Destroyed");

	var override = false;
	if (this.configuration.fnConnectionDestroyed)
		override = this.configuration.fnConnectionDestroyed(event);
	if (override)
		return;

	var cid = event.connection.connectionId;
	this.displayChatMessage(this.notifyTemplate({ message: this.allRooms[cid] + " se ha desconectado" }));
	if (this.subscribers[cid])
		delete (this.subscribers[cid]);
	delete this.allRooms[cid];
};

Room.prototype.signalReceived = function (event) {
	var data = JSON.parse(Encoder.htmlDecode(event.data));
	var k, i, e, streamConnectionId;
	var streamContainer$ = this.findElement(".streamContainer");
	switch (event.type) {
		case "signal:reload":
			if(data.reload)
				window.location.reload();
			break;
		case "signal:connect":
			this.allRooms[data.cid] = data.name;
			if (data.showMyDisplay === false && room.isMe(data.cid))
				break;
			this.displayChatMessage(this.notifyTemplate({ message: this.allRooms[data.cid] + " se ha conectado" }));
			break;
		case "signal:initialize":
			this.leader = data.leader;
			for (k in data.users) {
				if (this.myConnectionId == k)
					this.allRooms[k] = this.name;
				else
					this.allRooms[k] = data.users[k];
			}
			for (k in data.filter)
				this.filterData[k] = data.filter[k];
			for (i in data.chat)
				this.writeChatData(data.chat[i]);
			if (data.archiveId) {
				this.archiveId = data.archiveId;
				this.findElement('#recordButton').addClass("selected");
			}
			var init = this.initialized;
			this.initialized = true;
			if (!init)
				this.syncStreamsProperty();
			break;
		case "signal:chat":
			this.writeChatData(data);
			break;
		case "signal:focus":
			this.leader = data;
			for (i = 0; i < streamContainer$.length; i++)
				this.setLeaderProperties(streamContainer$[i]);
			if (this.myConnectionId === this.leader)
				this.findElement("#" + this.configuration.targetElementPublisher).addClass("OT_big");
			this.writeChatData({ name: this.allRooms[data], text: "/serv " + this.allRooms[data] + " esta liderando la conversación" });
			break;
		case "signal:unfocus":
			this.leader = false;
			this.findElement("#" + this.configuration.targetElementPublisher).removeClass("OT_big");
			for (i = 0; i < streamContainer$.length; i++) {
				e = streamContainer$[i];
				$(e).removeClass("OT_big");
				streamConnectionId = $(e).data('connectionid');
				if (this.subscribers[streamConnectionId])
					this.subscribers[streamConnectionId].restrictFrameRate(false);
			}
			this.writeChatData({ name: this.allRooms[data], text: "/serv Todos los usuario se encuentran iguales, ninguno lidera la conersación" });
			break;
		case "signal:filter":
			this.applyClassFilter(data.filter, ".stream" + data.cid);
			break;
		case "signal:name":
			var oldName = this.allRooms[data[0]];
			this.allRooms[data[0]] = data[1];
			this.writeChatData({ name: this.allRooms[data[0]], text: "/serv " + oldName + " ahora es " + this.allRooms[data[0]] });
			break;
		case "signal:archive":
//			var actionVerb;
//			if (data.action === "start") {
//				actionVerb = "iniciado";
//				this.findElement(".controlOption[data-activity=record]").addClass('selected');
//			} else {
//				actionVerb = "finalizado";
//				this.findElement(".controlOption[data-activity=record]").removeClass('selected');
//			}
//			this.archiveId = data.archiveId;
//			var archiveUrl = window.location.origin + "/archive/" + data.archiveId + "/" + this.roomId;
//			this.writeChatData({ name: data.name, text: "/serv La grabación de la sesión ha " + actionVerb + ". Puede verla aqui: " + archiveUrl });
			break;
	}

	if (this.configuration.fnSignalReceived)
		this.configuration.fnSignalReceived(event);
};

Room.prototype.inputKeypress = function (e) {
	if (e.keyCode !== 13)
		return;
	this.processMessage();
};

Room.prototype.processMessage = function () {
	var text = this.findElement("#" + this.configuration.messageInput).val().trim();
	if (text.length < 1)
		return;

	var parts = text.split(' '), k;
	switch (parts[0]) {
		case "/hide":
			this.findElement("#" + this.configuration.messageInput).blur();
			this.findElement('.container').css('right', '-300px');
			break;
		case "/help":
			break;
		case "/list":
			this.displayChatMessage(this.notifyTemplate({ message: "-----------" }));
			this.displayChatMessage(this.notifyTemplate({ message: "Usuarios conectados" }));
			for (k in this.allRooms)
				this.displayChatMessage(this.notifyTemplate({ message: "- " + this.allRooms[k] }));
			this.displayChatMessage(this.notifyTemplate({ message: "-----------" }));
			break;
		case "/focus":
			this.sendSignal("focus", this.myConnectionId);
			break;
		case "/unfocus":
			this.sendSignal("unfocus", this.myConnectionId);
			break;
		default:
			this.sendSignal("chat", { name: this.name, text: text });
	}
	var messageInput = this.findElement("#" + this.configuration.messageInput);
	setTimeout(function() { messageInput.val(''); }, 0);
	messageInput.focus();
};

Room.prototype.sendSignal = function (type, data, to) {
	var signalData = { type: type, data: Encoder.htmlEncode(JSON.stringify(data), false) };
	if (to)
		signalData.to = to;
	this.session.signal(signalData, this.errorSignal);
};

Room.prototype.setLeaderProperties = function (e) {
	var streamConnectionId = $(e).data('connectionid');
	if (streamConnectionId === this.leader && this.subscribers[this.leader]) {
		$(e).addClass("OT_big");
		this.subscribers[this.leader].restrictFrameRate(false);
	} else {
		$(e).removeClass("OT_big");
		if (this.subscribers[streamConnectionId] && (this.subscribers[this.leader] || this.leader === this.myConnectionId))
			this.subscribers[streamConnectionId].restrictFrameRate(true);
	}
};

Room.prototype.syncStreamsProperty = function () {
	var i, e, streamConnectionId;
	for (i = 0; i < this.findElement(".streamContainer").length; i++) {
		e = this.findElement(".streamContainer")[i];
		this.setLeaderProperties(e);
		streamConnectionId = $(e).data('connectionid');
		if (this.filterData && this.filterData[streamConnectionId])
			this.applyClassFilter(this.filterData[streamConnectionId], ".stream" + streamConnectionId);
	}
	if (this.myConnectionId === this.leader)
		this.findElement("#" + this.configuration.targetElementPublisher).addClass("OT_big");
};

Room.prototype.errorSignal = function (error) {
	if (error)
		console.log("signal error: " + error.reason);
};

Room.prototype.triggerActivity = function (activity, action) {
	console.log("iniciando la actividad");
	switch (activity) {
		case "record":
			var data = { action: action, roomId: this.roomId, archiveId: null, sessionId: null };
			if (this.archiveId)
				data.archiveId = this.archiveId;
			if (this.sessionId)
				data.sessionId = this.sessionId;
			var self = this;
			var options = {
				type: "POST",
				url: (self.configuration.recordMethod != undefined &&
					self.configuration.recordMethod != null &&
					self.configuration.recordMethod != "") ? self.configuration.recordMethod : (location.pathname + "/" + 'Archive'),
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				async: true,
				cache: false,
				timeout: 30000,
				error: self.configuration.recordError,
				success: function(id) {
					console.log("guardando el archivo");
					console.log(id);
					if (id) {
						self.archiveId = id;
						self.sendSignal("archive", { name: self.name, archiveId: id, action: action });
						self.configuration.recordSuccess(id);
					}
				}
			};
			if (self.configuration.recordAuthorization)
				options.beforeSend = function (xhr) { xhr.setRequestHeader('Authorization', self.configuration.recordAuthorization); },
			$.ajax(options);
			break;
	}
};

Room.prototype.removeStream = function (cid) {
	this.saveLog("remove Stream");
	this.findElement(".stream" + cid).remove();
};

Room.prototype.writeChatData = function (val) {
	this.chatData.push({ name: val.name, text: unescape(val.text) });
	var text = val.text.split(' ');
	var message = "";
	var urlRegex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})(\/.*)?$/g;
	var i, e;
	for (i in text) {
		e = text[i];
		if (e.length < 2000 && e.match(urlRegex) && e.split("..").length < 2 && e[e.length - 1] !== ".")
			message += e.replace(urlRegex, "<a href='http://$2.$3$4' target='_blank'>$1$2.$3$4<a>") + " ";
		else
			message += Handlebars.Utils.escapeExpression(e) + " ";
	}
	val.text = message;
	if (text[0] === "/serv") {
		this.displayChatMessage(this.notifyTemplate({ message: val.text.split("/serv")[1] }));
		return;
	}
	if (val.name == this.name)
		this.displayChatMessage(this.messageTemplate(val));
	else
		this.displayChatMessage(this.messageTemplateSuscribers(val));
	if (this.configuration.fnNewMessage)
		this.configuration.fnNewMessage(val);
};

Room.prototype.displayChatMessage = function (message) {
	this.findElement("#" + this.configuration.displayChat).append(message);
	var elementChat = document.getElementById(this.configuration.displayChat);
	elementChat.scrollTop = elementChat.scrollHeight;
};

Room.prototype.isMe = function(connectionId){
	return connectionId === this.session.connection.connectionId;
},

Room.prototype.connectionsLength = function() {
	return this.session.connections.length();
},

window.Room = Room;

