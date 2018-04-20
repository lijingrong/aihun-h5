
cc.Class({
    extends: cc.Component,

    properties: {
        zhNameText:{
            default:null,
            type:cc.EditBox,
        },
        telephoneText:{
            default:null,
            type:cc.EditBox,
        },
        addressText:{
            default:null,
            type:cc.EditBox,
        },
        submitTip:{
            default:null,
            type:cc.Label,
        }
    },
    submitContact:function(){
        cc.log("button clicked!");
        cc.log(this.zhNameText.string);
        var submitTipLabel = this.submitTip;
        var zhName = this.zhNameText.string;
        var telephone = this.telephoneText.string;
        var address = this.addressText.string;
        var url = "http://localhost:8080/addContact";
        var params = "zhName="+encodeURIComponent(zhName)+"&telephone="+encodeURIComponent(telephone)+"&address="+encodeURIComponent(address);
        var request = cc.loader.getXMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                cc.log(response.code);
                if(response.code===1){
                    submitTipLabel.string="提交成功";
                }
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
        request.send(params);
    },
    
});
