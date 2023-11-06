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

        var formData = new FormData();
        
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

        function merge(obj1, obj2) {
            if (obj1) {
                var obj = obj1;
                for (var x in obj2) {
                    if (obj2.hasOwnProperty(x)) {
                        if (Array.isArray(obj[x])) {
                            for (var i in obj2[x]) {
                                obj[x].push(obj2[x][i])
                            }
                        }
                        else if (typeof(obj2[x]) == "object") {
                            merge(obj[x], obj2[x]);
                        }
                        else {
                            obj[x] = obj2[x];
                        }
                        
                    }
                }
                return obj;
            }
        }

        function makeObj(nameArr, index, value, obj) {
            if (index < 0) {
                return {...obj};
            }
            var key = nameArr[index];
            var isArray = key.includes("[");
            if (isArray) {
                key = key.substr(0, key.lastIndexOf("["));
            }
            var newObj = {};
            if (value != undefined) {
                if (!isArray) {
                    newObj[key] = value;
                }
                else {
                    newObj.push(value);
                }
            }
            else {
                if (!isArray) {
                    newObj[key] = {...obj};
                }
                else {
                    newObj[key] = [{...obj}];
                }
            }
            return makeObj(nameArr, index-1, undefined, newObj);
        }

        function formDataToJson() {
            let object = [];

            formData.forEach((value, key) => {
                let arr = key.split(".");
                object.push(makeObj(arr, arr.length - 1, value))
            });

            if (object.length == 0) {
                return {};
            }
            else if (object.length == 1) {
                console.log(object[0])
                return object[0];
            }
            else {
                var data = merge(object[0], object[1]);
                for (var i = 2; i < object.length; i++) {
                    data = merge(data, object[i]);
                }
                return data;
            }
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

        console.log(ajaxOption);
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