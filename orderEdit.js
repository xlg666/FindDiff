app.db.objectStoreName = "behaviorStatics";

function isHomeNumberInUserRoles(home_number,user_roles){
  var is_find = false
     for(var i = 0; i < user_roles.length; i ++){
        var item = user_roles[i]
        if(item.menuNumber == home_number){
          is_find = true
        }
     }
  return is_find
}
function setUserRoles(){
    var user_roles_storage =  localStorage.getItem("app_user_roles")
    var user_roles = []
    if(user_roles_storage){
       user_roles = $.parseJSON(user_roles_storage)
    }
    console.log(user_roles)
    if(!isHomeNumberInUserRoles( 'OrderDetailEdit',user_roles)){
         $("#btnEdit").css("display","none")
         console.log('none')
    }else{
         $("#btnEdit").css("display","block")
         console.log('block')
    }
   
}
function entrysAfterRendered(){
   mbos('entrys').bind('afterRendered',function(e){
      var index=e.index;//分录的序号
      $("#entrys_qty_"+index).bind("change",index,function(e){
          var qty = mbos('entrys.qty',index).value()
          var price = mbos('entrys.price',index).value()
          mbos('entrys.amt',index).value(qty * price)
      })
   })
}
// function getProductsOfStore(){
//    mbos.eas.invokeScript("getProductsOfStore",[null],function(data){
//       console.log(data)
//       //renderOrderList(data)
//    }); 
// }
mbos('page').bind('afterOnload',function(event){
     setUserRoles();
     entrysAfterRendered();
     //getProductsOfStore();
     setTimeout(function(){
         var IfAuditing = mbos('IfAuditing').value();
         if(IfAuditing){
         console.log(IfAuditing)
         }
     },500)
})
// mbos('entrys.materialQuery').bind('beforeLoad',function(){
//     var filter = {};
//     filter.filteritems = new Array();
//     var filteritem = {};
//     filteritem.propertyname="CFMaterialID";
//     filteritem.comparetype="in";
//     filteritem.comparevalue='"Y5Cyx4doMZXgUwsBCgqVLIGSJbM="';
//     filteritem.datatype="String";
//     filter.filteritems.push(filteritem);
//     // var filteritem1={};
//     // filteritem1.propertyname="FlockStatus";
//     // filteritem1.comparetype="<>";
//     // filteritem1.comparevalue="3";
//     // filteritem1.datatype="String";
//     // filter.filteritems.push(filteritem1);
//     mbos('entrys.materialQuery').setParam({'df':JSON.stringify(filter)});
// })
function getTotalAmt(){
    var entrys = mbos('entity').value().entrys
    var total_amt = 0;
    console.log(entrys)
    for(var i = 0; i < entrys.length; i ++){
       var entry = entrys[i]
       total_amt += entry.amt
    }
    console.log("total_amt:"+total_amt)
    return total_amt
}

function setAuditTrue(){
    var editData = mbos('entity').value();
    //请求服务端审核
    mbos.eas.invokeScript("setAuditTrue",[editData],function(data){
    // debugger;
      if(data == "true"){
            mbos.ui.showInfo("审核成功");
            setTimeout(function(){
              page.changeState("VIEW",mbos("entity").value().id)
            },1000)
      }
  });
}

_this.edit = function(event){
    app.db.get(180322220, function(item) {
      if(item) {
        item.count++;
        app.db.save(item);
      } else {
        app.db.save({id: 180322220, menu: '订货单详情-编辑', count: 1, abbr: 'OrderDetailEdit'})
      }
    });    
	return  page.edit && page.edit(event);
               
}
_this.submit = function(event){
    var total_amt = getTotalAmt();
    var customerid = mbos('entity').value().customer.id
    mbos.eas.invokeScript("getCustomerBalance",[customerid],function(data){
       console.log(data[0].balance)
       var balance = data[0].balance
       if(balance < total_amt){
         var param2 = {
                        title:"提示",
                        msg:"账户余额不足",
                        callback:function(data){
                           if(data===0){
                            setAuditTrue()
                           }else{
                             return 
                           }    
                        }
                      };
         mbos.ui.showConfirm(param2);
       }else{
          setAuditTrue()
       }
    }); 
               
}
_this.back = function(event){
	return  page.back && page.back(event);
               
}
