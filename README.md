# 烏春｜班級飲料訂購

網站：https://kerry0407921117.github.io/2026teashop/

兩頁式靜態網站：`index.html` 點餐、`orders.html` 查看班級訂單。依原始菜單收錄 22 款飲品、4 種加料、5 種甜度與 4 種冰量。菜單圖片等比例呈現；點餐頁第一列為菜單，第二列為表單與價格，手機版改為直向排列。

## Google 試算表設定（尚待帳號授權與部署）

1. 在 Google Sheets 建立空白試算表，從「擴充功能 → Apps Script」開啟綁定專案。
2. 將 `apps-script/Code.gs` 與 `apps-script/Menu.gs` 分別放入同名程式檔。
3. 執行 `setup()` 並授權。試算表會命名為 `2026手搖飲點餐記錄`，自動建立「訂單」分頁與第一列欄名：訂單編號、時間、姓名、飲品、甜度、冰量、加料、杯數、總價、備註。
4. 「部署 → 新增部署作業 → 網頁應用程式」，執行身分選自己、存取權選任何人。此設定讓班級學生免 Google 登入即可點餐，訂單頁也可由任何取得網站網址的人查看姓名和訂單；請依班級使用範圍分享。
5. 將部署的 `/exec` 網址填入 `config.js` 的 `endpoint`，提交推送後即可啟用。程式更新時需更新 Apps Script 部署版本。
6. 實際送出兩筆具識別名稱的測試訂單，在試算表和點餐狀況頁確認姓名、飲料、杯數、總價一致。測試資料確認後可由試算表管理者刪除。

API 以 `doGet` 回傳 JSON 訂單、`doPost` 接收 JSON 字串。前端使用 `text/plain` 避免預檢；只有伺服器回傳 `ok:true` 才顯示確認成功，不以不透明回應假裝寫入完成。Apps Script 會重新驗證價格、限制欄位、阻擋試算表公式輸入，並利用鎖與訂單編號避免重複寫入。

官方部署說明：https://developers.google.com/apps-script/guides/web

## GitHub Pages

從 `main` 分支根目錄部署。`spec/` 由 `.gitignore` 排除，不推送。純 HTML/CSS/JavaScript，無套件或建置步驟。

## 尚待完成的驗證

Google 試算表尚未連接前，點餐表單可試算但會明確阻止送出；訂單頁不提供假資料。實際 Google Sheet 寫入測試必須於後端部署後執行。
