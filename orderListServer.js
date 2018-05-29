var ctx = context.getBosContext();
var userid = com.kingdee.eas.util.app.ContextUtil.getCurrentUserInfo(ctx).getId().toString();
var fnumber = context.getParam(0);
var customer_name = context.getParam(1);
var org_id = context.getParam(2);
var startDate = context.getParam(3);
var endDate = context.getParam(4);
var org_id_sql = ""
var fnumber_sql = ""
var customer_name_sql = ""
var start_date_sql = ""
var end_date_sql = ""
var select_sql = ""
if (org_id.length() > 0){
	org_id_sql = "and o.cforgunitid = '@orgId' ";
}

if(customer_name.length() > 0){
   customer_name_sql = "and t.cusName like '%@customer_name%' "
}	
if (startDate.length() > 0){
  	 start_date_sql = " and o.fbizdate >= to_date('@df"+"', 'yyyy-mm-dd') " 

}
if (endDate.length()>0) {
      end_date_sql = " and o.fbizdate < to_date('@dt"+"', 'yyyy-mm-dd') + 1" 
}
if (fnumber.length() > 0) {
	fnumber_sql = "and t.fnumber = '@sfnumber'";
    select_sql = fnumber_sql
}else{
   //select_sql = org_id_sql + customer_name_sql + start_date_sql + end_date_sql
    select_sql = customer_name_sql
}

var listpay = new java.util.ArrayList();
var sql = "/*dialect*/ select \r\n" + 
	   		"t.fid,\r\n" + 
	   		"t.fnumber,\r\n" + 
	   		"t.needtime,\r\n" + 
	   		"t.orderDate,\r\n" + 
	   		"t.orderSource,\r\n" + 
	   		"t.deliverDate,\r\n" + 
	   		"t.cusName,\r\n" + 
            "t.orgName,\r\n" + 
	   		"t.FBizDate\r\n" + 
	   		"from (\r\n" + 
	   		"SELECT\r\n" + 
	   		"o.fid as fid, \r\n" + 
	   		"o.fnumber as fnumber, \r\n" + 
	   		"o.CFneedtime as needtime, \r\n" + 
	   		"to_char(o.cforderdate, 'yyyy-mm-dd') as orderDate, \r\n" + 
	   		"o.cfordersource as orderSource,  \r\n" + 
	   		"to_char(o.cfdeliverydate, 'yyyy-mm-dd') as deliverDate, \r\n" + 
	   		"org.fname_l2 as orgName, cus.fname_l2 as cusName,\r\n" + 
	   		"o.FBizDate \r\n" + 
	   		"from ct_xps_xporder o \r\n" + 
	   		"inner join t_org_storage org on org.fid = o.cforgunitid \r\n" + 
	   		"inner join ct_xp_storesinfo cus on cus.cfcustomerid = o.cfcustomerid \r\n" + 
	   		"inner join (select srse.CFSTOREID as storefid from CT_XP_UserSRSE srse \r\n" + 
	   		"inner join( SELECT \r\n" + 
	   		"           DISTINCT store.FID as storeid,\r\n" + 
	   		"           org.FID as forgid,org.FName_l2 as fname_l2 \r\n" + 
	   		"           FROM ct_xp_userstorerelation store \r\n" + 
	   		"           inner join T_ORG_Storage org on store.CFORGUNITWENSID = org.FID \r\n" + 
	   		"           WHERE CFUSERID = '@userid' and org.FID ='@orgId') temp \r\n" + 
	   		"on srse.FParentID = temp.storeid ) temp_store   \r\n" + 
	   		"on temp_store.storefid = cus.fid \r\n" + 
	   		"where 1=1 and o.cforgunitid = '@orgId'  \r\n" + 
	   		"and o.fbizdate >= to_date('@df', 'yyyy-mm-dd')  \r\n" + 
	   		"and o.fbizdate < to_date('@dt', 'yyyy-mm-dd') + 1 \r\n" + 
	   		")t\r\n" + 
            "where 1=1"+select_sql+
	   		"group by t.fid,\r\n" + 
	   		"t.fnumber,\r\n" + 
	   		"t.needtime,\r\n" + 
	   		"t.orderDate,\r\n" + 
	   		"t.orderSource,\r\n" + 
	   		"t.deliverDate,\r\n" + 
	   		"t.cusName,\r\n" + 
    	     "t.orgName,\r\n" + 
	   		"t.FBizDate\r\n" + 
	   		"order by t.FBizDate desc \r\n" 
          


sql = sql.replace('@sfnumber',fnumber);
sql = sql.replace('@df',startDate);
sql = sql.replace('@dt',endDate);
sql = sql.replace('@customer_name',customer_name);
sql = sql.replace('@orgId',org_id);
sql = sql.replace('@userid',userid);



var rs =com.kingdee.eas.util.app.DbUtil.executeQuery(ctx,sql); 
while(rs.next()){
  	var fid = rs.getString("fid");
	var orgName = rs.getString("orgName");
  	var fnumber = rs.getString("fnumber");
  	var orderDate = rs.getString("orderDate");
  	var deliverDate = rs.getString("deliverDate");
  	var cusName = rs.getString("cusName");
    var needtime = rs.getString("needtime");
    var orderSource = rs.getString("orderSource")
  	var objnopay = new java.util.HashMap();  
  	objnopay.put("fid",fid);
  	objnopay.put("orgName",orgName);
  	objnopay.put("fnumber",fnumber);
    objnopay.put("orderDate",orderDate);
    objnopay.put("deliverDate",deliverDate);
  	objnopay.put("cusName",cusName);
    objnopay.put("needtime",needtime);
    objnopay.put("orderSource",orderSource);  
    listpay.add(objnopay);
}

context.setResult(listpay)
