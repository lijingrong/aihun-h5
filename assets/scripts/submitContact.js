
cc.Class({
    extends: cc.Component,

    properties: {
        zhNameText: {
            default: null,
            type: cc.EditBox,
        },
        telephoneText: {
            default: null,
            type: cc.EditBox,
        },
        addressText: {
            default: null,
            type: cc.EditBox,
        }
    },
    submitContact: function () {
        var Config = require("Config");
        var submitTipLabel = this.submitTip;
        var zhName = this.zhNameText.string;
        var telephone = this.telephoneText.string;
        var address = this.addressText.string;
        if(zhName===null || telephone===null || address===null 
            ||zhName.trim()==='' || telephone.trim()===''||address.trim()===''){
            alert("请把信息填写完整！");
        }
        var url = "/aihun/addContact";
        var params = "userId=" + encodeURIComponent(Config.uid) + "&zhName=" + encodeURIComponent(zhName) + "&telephone=" + encodeURIComponent(telephone) + "&address=" + encodeURIComponent(address);
        var request = cc.loader.getXMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                cc.log(response.code);
                if (response.code === 1) {
                    cc.director.loadScene("contactSuccess");
                }
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        request.send(params);
    },

});
