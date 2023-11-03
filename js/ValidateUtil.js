function ValidateUtil() {
}

ValidateUtil.prototype.getLastConsonantLetter = function(word) {
  if (typeof word !== 'string') return null;
 
  var lastLetter = word[word.length - 1];
  var uni = lastLetter.charCodeAt(0);
 
  if (uni < 44032 || uni > 55203) return null;
 
  return (uni - 44032) % 28 != 0;
}

ValidateUtil.prototype.requires = function() {
	for (var index in arguments) {
		if (this.isEmpty(arguments[index])) {
			var fieldName = $(arguments[index]).data("field-name");
			alert(fieldName + (this.getLastConsonantLetter(fieldName) ? "은" : "는") + " 필수값 입니다.");
			return false;
		}
	}
	
	return true;
}

ValidateUtil.prototype.checkValidLength = function() {
	for (var index in arguments) {
		var element = $(arguments[index]);
		var minLength = element.data("min-length");
		if (minLength) {
			if (element.val().length < minLength) {
				var fieldName = element.data("field-name");
				alert(fieldName + (this.endEndWord(fieldName) ? "은" : "는") + " " + minLength + "글자 이상 입력하세요");
				return false;
			}
		}
	}
	
	return true;
}

ValidateUtil.prototype.removeTrimAll = function() {
	$("input, textarea").each(function(i, data) {
		$(data).val($.trim($(data).val()));
	});
}

ValidateUtil.prototype.removeTrim = function() {
	for (var index in arguments) {
		var element = $(arguments[index]);
		element.val($.trim(element.val()));
	}
}

ValidateUtil.prototype.isEmpty = function(jquerySelector) {
	return $.trim($(jquerySelector).val()) == "";
}

ValidateUtil.prototype.isMatchTo = function(jquerySelector, otherJQuerySelector) {
	return $.trim($(jquerySelector).val()) == $.trim($(otherJQuerySelector).val());
}

ValidateUtil.prototype.isExceedLength = function(jquerySelector, maxlength) {
	return $.trim($(jquerySelector).val()).length > maxlength;
}