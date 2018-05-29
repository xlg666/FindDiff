app.db.objectStoreName = "behaviorStatics";
var orgData = []

function GetDateStr(AddDayCount) { 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+AddDayCount);
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;
    if(m<10){
      m = "0" + m
    }
    var d = dd.getDate(); 
      if(d<10){
         d="0"+d
      }
    return y+"-"+m+"-"+d; 
}
/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var today = GetDateStr(0)

var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//格式化日期：yyyy-MM-dd
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}
//获得某月的天数
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}
//获得本季度的开始月份
function getQuarterStartMonth() {
    var quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}
//获得本周的开始日期
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
}
//获得本周的结束日期
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
}
//获得上周的开始日期
function getLastWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
    return formatDate(weekStartDate);
}
//获得上周的结束日期
function getLastWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
    return formatDate(weekEndDate);
}
//获得本月的开始日期
function getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}
//获得本月的结束日期
function getMonthEndDate() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}
//获得上月开始时间
function getLastMonthStartDate() {
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}
//获得上月结束时间
function getLastMonthEndDate() {
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

function getDateRange(date_type){
    var start_date = ''
    var end_date = ''
    if(date_type=='0'){//今天
      start_date = today
      end_date = today
    }else if(date_type=='-1'){//昨天
      start_date = GetDateStr(-1)
      end_date = GetDateStr(-1)
    }else if(date_type=='-3'){//最近3天
      start_date = GetDateStr(-3)
      end_date = today
    }else if(date_type=='-7'){//最近7天
       start_date = GetDateStr(-7)
       end_date = today
    }else if(date_type=='8'){//本周
       start_date = getWeekStartDate()
       end_date = getWeekEndDate()
    }else if(date_type=='9'){//本月
       start_date = getMonthStartDate()
       end_date = getMonthEndDate()
    }else if(date_type=='10'){//上周
       start_date = getLastWeekStartDate()
       end_date = getLastWeekEndDate()
    }else if(date_type=='11'){//上月
       start_date = getLastMonthStartDate()
       end_date = getLastMonthEndDate()
    }
    return {start_date, end_date}
}
function renderOrderList(data){
    var html = ''
    //console.log("order_list_data：："+JSON.stringify(data));
    if(data){
        for(var i=0;i<data.length;i++){
           var item = data[i]  
           var fid = item.fid
           var orgName = item.orgName
           var fnumber = item.fnumber
           var orderDate = item.orderDate
           var deliverDate = item.deliverDate
           var orderSource = item.orderSource == '0' ? '网页':'微信公众号'
           var needtime = item.needtime == '0' ? '上午': '下午'
           var cusName = item.cusName
           html += '<div class = "order_item" fid = "'+fid+'" fnumber = "'+fnumber+'"  style="background-color:#fff;margin-top:10px;border-radius:8px;box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.19)">'+
                        '<div style="padding:10px;color:#999;font-size:13px">'+
                             '<i style="color:#3cbaff" class="glyphicon glyphicon-map-marker"></i>'+
                             '<span style="color:#3cbaff">'+ cusName +'</span>'+
                             '<span style="color:#ccc;float:right">来自<span style="color:#3cbaff">'+orderSource+'</span></span>'+
                        '</div>'+
                        '<div style="padding:10px;border-top:1px solid #ededed;border-bottom:1px solid #ededed">'+
                             '<div>'+
                                 '<span style="color:#ccc">订货日期：</span>'+orderDate+
                             '</div>'+
                             '<div>'+
                                  '<span style="color:#ccc">要货日期：</span>'+deliverDate+"  "+needtime+
                             '</div>'+
                             '<div>'+
                                 '<span style="color:#ccc">组织名称：</span>'+orgName+
                             '</div>'+
                          '</div>'+
                     	  '<div style="padding:10px;color:#999;font-size:13px">'+
                             '<span style="color:#ccc">'+ fnumber +'</span>'+
                             '<i style="float:right;top:2px;color:#3cbaff"class="glyphicon glyphicon-chevron-right" aria-hidden="true"></i>'+
                             '<span style="color:#3cbaff;float:right;">查看</span>'+
                          '</div>'+
                     '</div>'
          }
      }
      $("#order_list").html(html)
  
      $(".order_item").click(function(){
          app.db.get(180322210, function(item) {
             if(item) {
                item.count++;
                app.db.save(item);
             } else {
                app.db.save({id: 180322210, menu: '订货单列表-详情查看', count: 1, abbr: 'OrderListViewDetail'})
             }
          });        
          var fid = $(this).attr("fid")
          mbos.ui.open({
             name:"orderEdit.editui",
             path:"WSXP_REPORT",
             params:{
               billID:fid,
               operateState:"VIEW"
              }
          });
       })
}

function getOrderListData(fnumber, customer_name, org_id, startDate, endDate){
     //请求服务端
    mbos.eas.invokeScript("getOrders",[fnumber, customer_name, org_id, startDate, endDate],function(data){
       console.log(data)
       renderOrderList(data)
    }); 
}
mbos('page').bind('afterOnload',function(event){
   var org_id = '';
   var org_info = localStorage.getItem("app_list_org_info");
   if(org_info){
	     var org_info_JSON = $.parseJSON(org_info)
         org_id = org_info_JSON.orgfid
    }
    $('.modal-body table tr td div').click(function(){
      if($(this).hasClass('date-range-btn-selected')){return}
      $('.date-range-btn-selected .sign-icon-selected').removeClass('sign-icon-selected')
      $('.date-range-btn-selected').removeClass('date-range-btn-selected')
      $(this).addClass('date-range-btn-selected')
      $(this).find("i").addClass('sign-icon-selected')
      var date_type = $(this).attr('value');
      var date_range = getDateRange(date_type)
      $('#start_day').val(date_range.start_date)
      $('#end_day').val(date_range.end_date)
   })
   $("[mymodal-dismiss]").click(function(){
        $('#myModal').toggleClass("lzc-fade-in");
   });
   $("#save-btn").click(function(){
      var start_day = $('#start_day').val()
      var end_day = $('#end_day').val()
      if(start_day == end_day){
         $("#date_range_lzc").html(start_day)
      }else{
         $("#date_range_lzc").html(start_day + "至" + end_day)
      }
      $('#myModal').toggleClass("lzc-fade-in");
  })
    //时间选择
    $("#jump_select_date_lzc").click(function(){
      $('#myModal').toggleClass("lzc-fade-in");
    })

    $("#confirmLabel").click(function(){
       var fnumber = $("#orderNumber").val()||"";
       var customer_name = $("#customerName").val() || "";
       var startDate = $('#start_day').val()||"";
       var endDate = $('#end_day').val()||"";
       console.log(customer_name)
       //console.log(fnumber, customer_name, org_id,startDate, endDate)
       getOrderListData(fnumber, customer_name, org_id, startDate, endDate)
       sessionStorage.setItem("orderList_endDate", endDate)
       sessionStorage.setItem("orderList_startDate",startDate) 
       sessionStorage.setItem("orderList_fnumber",fnumber) 
       sessionStorage.setItem("orderList_customerName",customer_name) 
    });
    var date_type = $('.date-range-btn-selected').attr('value');
    var date_range = getDateRange(date_type)
    var start_date = sessionStorage.getItem("orderList_startDate") || date_range.start_date
    var end_date = sessionStorage.getItem("orderList_endDate") || date_range.end_date
    $('#start_day').val(start_date)
    $('#end_day').val(end_date)
    if(start_date == end_date){
      $("#date_range_lzc").html(start_date)
    }else{
      $("#date_range_lzc").html(start_date + '至' + end_date)
    }
    var fnumber = sessionStorage.getItem("orderList_fnumber") || "";
    var customer_name = sessionStorage.getItem("orderList_customerName") || "";
    $("#orderNumber").val(fnumber)
    $("#customerName").val(customer_name)
    getOrderListData(fnumber,customer_name , org_id, start_date, end_date)
})
