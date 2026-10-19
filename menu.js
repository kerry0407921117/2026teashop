const MENU = [
 ['奶香舖','Velvet Lite Milk',[['晚韻萃乳',70],['蟬茗萃乳',65],['春包萃乳',65],['荃語萃乳',65],['鐵香萃乳',65],['蕎穀萃乳',70]]],
 ['茶行味','Original Tea',[['紅韻晚韻',40],['春包清露',35],['金萱細語',35],['蟬語春山',35],['鐵焙禾泉',35],['蕎香穀韻',40]]],
 ['茶乳閣','Milk Tea',[['春包厚白',70],['鐵香厚白',70],['蟬鳴厚白',70],['穀語厚白',75]]],
 ['雲蓋樓','Snow Cap Tea',[['晚韻浮雲',75],['艾翠浮雲',70],['穀吟浮雲',75]]],
 ['果香園','Fruit Tea',[['芭紅朝露',75],['蓮霧文翠',75],['桃觀暮雪',75]]]
];
const TOPPINGS = [['白澄珍珠',10],['蕎麥凍凍',15],['綠葡萄凍',15],['紫芋Q比',15]];
const SUGARS = ['無糖 0%','微糖 10%','少糖 30%','半糖 50%','正常糖 70%'];
const ICES = ['去冰','微冰','少冰','正常冰'];
function priceOf(order) {
 const item = MENU.flatMap(g=>g[2]).find(i=>i[0]===order.drink);
 if(!item) throw new Error('請選擇飲料');
 return (item[1]+(order.toppings||[]).reduce((sum,name)=>sum+(TOPPINGS.find(t=>t[0]===name)?.[1]||0),0))*order.quantity;
}
