var ctx = context.getBosContext();
var userid = com.kingdee.eas.util.app.ContextUtil.getCurrentUserInfo(ctx).getId().toString();

var sql = "/*dialect*/" + 
         " select m.fid as id, m.fname_l2 as itemname, msu.fname_l2 as unit, "+
         " mg.fname_l2 as groupname, "+
         "  mg.fid as groupid"+
         " from ct_xpb_Materialpic m "+
         " left join  ct_xp_storemategroup mg on mg.fid = m.cfgroupid "+
         " left join T_BD_MEASUREUNIT msu on msu.fid = m.cfunitid "

var listpay = new java.util.ArrayList();
var rs =com.kingdee.eas.util.app.DbUtil.executeQuery(ctx,sql); 
while(rs.next()){
  	var id = rs.getString("id");
   	var itemname = rs.getString("itemname");

   	var objnopay = new java.util.HashMap();  
   	objnopay.put("product_id",id);
    objnopay.put("itemname",itemname);
    listpay.add(objnopay);
}

context.setResult(listpay);
