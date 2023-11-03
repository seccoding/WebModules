function AjaxUtil() {
	this.sendTarget = [
		"input[type=checkbox]:checked",
		"input[type=color]",
		"input[type=date]",
		"input[type=email]",
		"input[type=hidden]",
		"input[type=image]",
		"input[type=month]",
		"input[type=number]",
		"input[type=password]",
		"input[type=radio]:checked",
		"input[type=range]",
		"input[type=tel]",
		"input[type=text]",
		"input[type=url]",
		"input[type=time]",
		"input[type=week]",
		"textarea"
	]

    this.USE_RESTFUL = true;
    this.USE_FORM = false;

    this.waterfallNames = {};

    this.replaceInputName = function(inputName, replaceRule) {
        var that = this;

        if (replaceRule[inputName]) {
            inputName = replaceRule[inputName];
        }
        if (inputName.includes("[].")) {
            if (that.waterfallNames[inputName] != undefined) {
                that.waterfallNames[inputName] += 1;
            }
            else {
                that.waterfallNames[inputName] = 0;
            }

            inputName = inputName.replace("[].", `[${that.waterfallNames[inputName]}].`)
        }
        return inputName;
    }

    this.makeFormData = function (parentSelector, replaceRule, useRESTful) {

        var formData = undefined;
        if (useRESTful == this.USE_RESTFUL) {
            formData = isArray ? [] : {};
        }
        else {
            formData = new FormData();
        }
        
        var that = this;
        var form = $(parentSelector);
        form.find(that.sendTarget.join(", ")).each(function() {
            inputNm = $(this).attr("name") || $(this).attr("id")
            
            if (inputNm) {
                inputNm = that.replaceInputName(inputNm, replaceRule);
                formData.append(inputNm, $(this).val());
            }
        });

        if (useRESTful == that.USE_FORM) {
            form.find("input[type=file]").each(function() {
                inputNm = $(this).attr("name") || $(this).attr("id")
                
                if ($(this)[0].files.length > 0) {
                    inputNm = that.replaceInputName(inputNm, replaceRule);
                    formData.append(inputNm, $(this)[0].files[0]);
                }
            });
        }
        return formData;
    }

    this.send = function (url, method, formData, fnCallback, useRESTful) {

        function formDataToJson() {
            var object = {};
            formData.forEach((value, key) => {
                // Reflect.has in favor of: object.hasOwnProperty(key)
                if(!Reflect.has(object, key)){
                    object[key] = value;
                    return;
                }
                if(!Array.isArray(object[key])){
                    object[key] = [object[key]];    
                }
                object[key].push(value);
            });
            return JSON.stringify(object);
        }

        var ajaxOption = {
            type: method,
            url: url,
            processData: false,
            success: function(response) {
                fnCallback(response);
            }
        }

        if (formData) {
            ajaxOption.data = useRESTful ? formDataToJson() : formData;
        }

        if (useRESTful === true) {
            ajaxOption.contentType = "application/json";
        }
        $.ajax(ajaxOption);
    }

}

AjaxUtil.prototype.restDelete = function(url, fnCallback) {
	this.send(url, "DELTE", undefined, fnCallback, this.USE_RESTFUL);
}

AjaxUtil.prototype.restPut = function(formSelector, url, fnCallback, replaceRule = {}) {
    var formData = this.makeFormData(formSelector, replaceRule, this.USE_RESTFUL);
	this.send(url, "PUT", formData, fnCallback, this.USE_RESTFUL);
}

AjaxUtil.prototype.restGet = function(url, fnCallback) {
	this.send(url, "GET", undefined, fnCallback, this.USE_RESTFUL);
}

AjaxUtil.prototype.restPost = function(formSelector, url, fnCallback, replaceRule = {}) {
    var formData = this.makeFormData(formSelector, replaceRule, this.USE_RESTFUL);
	this.send(url, "POST", formData, fnCallback, this.USE_RESTFUL);
}




AjaxUtil.prototype.delete = function(url, fnCallback) {
	this.send(url, "DELTE", undefined, fnCallback, this.USE_FORM);
}

AjaxUtil.prototype.put = function(formSelector, url, fnCallback, replaceRule = {}) {
    var formData = this.makeFormData(formSelector, replaceRule, this.USE_FORM);
	this.send(url, "PUT", formData, fnCallback, this.USE_FORM);
}

AjaxUtil.prototype.get = function(url, fnCallback) {
	this.send(url, "GET", undefined, fnCallback, this.USE_FORM);
}

AjaxUtil.prototype.post = function(formSelector, url, fnCallback, replaceRule = {}) {
    var formData = this.makeFormData(formSelector, replaceRule, this.USE_FORM);
	this.send(url, "POST", formData, fnCallback, this.USE_FORM);
}



/**
 * 파일 업로드
 */
AjaxUtil.prototype.postMultipartForm = function(formSelector, url, fnCallback, replaceRule = {}) {
	var formData = this.makeFormData(formSelector, replaceRule, this.USE_FORM);
	this.send(url, "POST", formData, fnCallback, this.USE_FORM);
}