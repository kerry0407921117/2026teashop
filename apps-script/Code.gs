const HEADERS = ['訂單編號','時間','姓名','飲品','甜度','冰量','加料','杯數','總價','備註'];
function setup() {
 const sheet=SpreadsheetApp.getActiveSpreadsheet();
 sheet.rename('2026手搖飲點餐記錄');
 PropertiesService.getScriptProperties().setProperty('SHEET_ID',sheet.getId());
 const tab=sheet.getSheetByName('訂單')||sheet.insertSheet('訂單');
 if(tab.getLastRow()===0)tab.appendRow(HEADERS);
 tab.setFrozenRows(1);tab.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#edf0e5');
}
function tab_(){const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw new Error('請先執行 setup');return SpreadsheetApp.openById(id).getSheetByName('訂單');}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function safe_(value){return /^[=+@\-]/.test(value)?"'"+value:value;}
function validate_(o){
 if(typeof o.id!=='string'||!/^[a-zA-Z0-9-]{10,80}$/.test(o.id))throw new Error('訂單編號錯誤');
 if(typeof o.name!=='string'||!o.name.trim()||o.name.length>30)throw new Error('請填寫姓名（30字以內）');
 if(!Number.isInteger(o.quantity)||o.quantity<1||o.quantity>30)throw new Error('杯數必須為1至30');
 if(!SUGARS.includes(o.sugar)||!ICES.includes(o.ice))throw new Error('甜度或冰量錯誤');
 if(!Array.isArray(o.toppings)||new Set(o.toppings).size!==o.toppings.length||o.toppings.some(t=>!TOPPINGS.some(i=>i[0]===t)))throw new Error('加料錯誤');
 if(MENU[3][2].some(i=>i[0]===o.drink)&&!['少冰','正常冰'].includes(o.ice))throw new Error('雲蓋樓限少冰或正常冰');
 if(typeof o.note!=='string'||o.note.length>200)throw new Error('備註限200字');
 const total=priceOf(o);if(total!==o.total)throw new Error('價格不一致，請重新選餐');
 return total;
}
function doPost(e){
 const lock=LockService.getScriptLock();
 try{const o=JSON.parse(e.postData.contents);const total=validate_(o);lock.waitLock(20000);const tab=tab_();const rows=tab.getDataRange().getValues();if(rows.slice(1).some(row=>row[0]===o.id))return json_({ok:true,id:o.id,duplicate:true});tab.appendRow([o.id,new Date(),safe_(o.name.trim()),o.drink,o.sugar,o.ice,o.toppings.join('、'),o.quantity,total,safe_(o.note)]);SpreadsheetApp.flush();return json_({ok:true,id:o.id,total});}catch(error){return json_({ok:false,error:error.message});}finally{if(lock.hasLock())lock.releaseLock();}
}
function doGet(){try{const rows=tab_().getDataRange().getValues().slice(1);return json_({ok:true,orders:rows.filter(r=>r[0]).map(r=>({id:r[0],time:r[1],name:r[2],drink:r[3],sugar:r[4],ice:r[5],toppings:r[6]?String(r[6]).split('、'):[],quantity:r[7],total:r[8],note:r[9]}))});}catch(error){return json_({ok:false,error:error.message});}}
