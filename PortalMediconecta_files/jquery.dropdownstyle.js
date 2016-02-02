function dropDownStyle(el) {
	this.dd = el;
	this.initEvents();
}

dropDownStyle.prototype = {
	initEvents: function () {
		var obj = this;

		obj.dd.on('click', function (event) {
			$(this).toggleClass('active');
			event.stopPropagation();
		});
	}
};