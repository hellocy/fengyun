var GLOBAL = {};

var options = {
	param: {}
}

GLOBAL.host = '/';
GLOBAL.body = $(".page-current");
GLOBAL.authority = [];
//页面跳转
GLOBAL.go = function(url) {
    if(!url){
        return;
    }
    if(sessionStorage.uid == null){
        location.href = "/login.html";
    }
    options.initPage = null;
    var role = sessionStorage.role;
    $.showIndicator();
    GLOBAL.body.empty().load(url, function(e) {
        $.hideIndicator();
        
        var navHtml = '';
        if(role == 0){
           navHtml = '<nav class="bar bar-tab"><a class="tab-item active" href="javascript:" data-url="index.html"><span class="icon icon-home"></span><span class="tab-label">首页</span></a><a class="tab-item" href="javascript:" data-url="session_list.html"><span class="icon icon-settings"></span><span class="tab-label">买点</span></a><a class="tab-item" href="javascript:" data-url="me.html"><span class="icon icon-me"></span><span class="tab-label">我</span></a></nav>';
        }else{
    	   navHtml = '<nav class="bar bar-tab"><a class="tab-item active" href="javascript:" data-url="index.html"><span class="icon icon-home"></span><span class="tab-label">首页</span></a><a class="tab-item" href="javascript:" data-url="setting.html"><span class="icon icon-settings"></span><span class="tab-label">设置</span></a><a class="tab-item" href="javascript:" data-url="me.html"><span class="icon icon-me"></span><span class="tab-label">我</span></a></nav>';
        }
    	GLOBAL.body.append(navHtml);

    	$("[data-url]").click(function(){
        	var url = $(this).data("url");
        	GLOBAL.go(url);
        })

        $("[data-authority]").each(function(){
            var authId = $(this).attr('data-authority');
            if($.inArray(authId, GLOBAL.authority) >= 0 && !$(this).hasClass("tab")){
                $(this).show();
            }
        })
    	options.initPage && options.initPage();
    });
}

GLOBAL.ajax = function(method, url, data, fn){
    $.showIndicator();
    $.ajax({
        type: method,
        url: url,
        data: data,
        success: function(e){
            $.hideIndicator();
            fn && fn(e);
        }
    })
}