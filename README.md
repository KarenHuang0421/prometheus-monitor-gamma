# prometheus-monitor-gamma
以prometheus持續追蹤系統狀態，若有異常則發送警告(Mail, Line)

 ```
 ⚠️ 因為IP無法設置為環境變數，所以固定監聽內網的10.0.5.31
 ``` 

## 執行方式
pull預設的develop分支，以`docker compose up`指令啟用

## 使用
主要透過瀏覽器 `[IP]:[port]` 讀取一些資訊，若要跳異常推播通知，需設定環境變數

### localhost:9090
為prometheus server，主要用來看圖表資訊, 警示或exporters的狀態，exporter用於輔助監聽

### localhost:9115 
可以監聽 電競機(10.0.5.31)的80 port是否存活

### 10.0.5.31:9100 
可以看 電競機(10.0.5.31) CPU, memory等狀態


## 警告推播
跳警告的條件設定於prometheus.rules.yml，
訊息僅有兩種狀態: firing, resolved
* 詳細訊息格式 [連結](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config)
* 其他支援的webhook(Jira, Discord, Telegram...etc) [連結](https://prometheus.io/docs/operating/integrations/#alertmanager-webhook-receiver)

### Mail
可自行建立，至alertmanager.yml修改參數，但需設置`雙重驗證`及`應用程式密碼`
```
prometheus不支援設定環境變數(僅external_label, http_proxy等)，故直接hardcode在上面
```

### Line
設定建立line developer帳號，至後台設定好Message API，取得`User id`及`Channel access token`，分別為 `LINE_TO_USER_ID` 以及 `LINE_CHANNEL_TOKEN` 環境變數，取得並修改env參數，若需要調整訊息格式可從中繼程式(relay.js)中修改
