function _BtnSubmit(id, validationGroup, causesValidation) {
	if (typeof (Page_ClientValidate) == 'function' && causesValidation) {
		if (validationGroup != '') {
			if (Page_ClientValidate(validationGroup)) {
				var btn = document.getElementsByTagName("div");
				for (var i = 0; i < btn.length; i++) {
					if (btn[i].id == 'hab_' + id)
						btn[i].style.display = 'none';
					else if (btn[i].id == 'deshab_' + id)
						btn[i].style.display = 'inline';
				}
				return true;
			} else {
				return false;
			}
		} else {
			if (Page_ClientValidate()) {
				var btn = document.getElementsByTagName("div");
				for (var i = 0; i < btn.length; i++) {
					if (btn[i].id == 'hab_' + id)
						btn[i].style.display = 'none';
					else if (btn[i].id == 'deshab_' + id)
						btn[i].style.display = 'inline';
				}
				return true;
			} else {
				return false;
			}
		}
	}
	else {
		var btn = document.getElementsByTagName("div");
		for (var i = 0; i < btn.length; i++) {
			if (btn[i].id == 'hab_' + id)
				btn[i].style.display = 'none';
			else if (btn[i].id == 'deshab_' + id)
				btn[i].style.display = 'inline';
		}
		return true;
	}
}
function _BtnMulSubmit(id) {
	if (typeof (Page_ClientValidate) == 'function') {
		if (Page_ClientValidate()) {
			var btn = document.getElementsByTagName("div");
			for (var i = 0; i < btn.length; i++) {
				if (btn[i].id == 'hab_' + id)
					btn[i].style.display = 'none';
				else if (btn[i].id == 'deshab_' + id)
					btn[i].style.display = 'inline';
			}
			return true;
		} else {
			return false;
		}
	}
	else {
		var btn = document.getElementsByTagName("div");
		for (var i = 0; i < btn.length; i++) {
			if (btn[i].id == 'hab_' + id)
				btn[i].style.display = 'none';
			else if (btn[i].id == 'deshab_' + id)
				btn[i].style.display = 'inline';
		}
		return true;
	}
}
//Bug para IE
if (typeof (window.external) != 'undefined') {
	document.getElementsByName = function (name) {
		var elems = document.getElementsByTagName('*');
		var res = [];
		for (var i = 0; i < elems.length; i++) {
			att = elems[i].getAttribute('name');
			if (att == name)
				res.push(elems[i]);
		}
		return res;
	}
}