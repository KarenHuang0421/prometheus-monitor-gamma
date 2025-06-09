# prometheus-angular-test
透過docker執行angular專案(指定8080 port)時，測試以prometheus持續追蹤系統狀態

## 執行方式
pull下來切換到develop分支後，以`docker compose up`指令啟用

## 使用
主要透過瀏覽器 `localhost:[port]` 讀取一些資訊

### :9090
為prometheus server，主要用來看圖表資訊, 警示或exporters的狀態，exporter用於輔助監聽

### :9115 
可以監聽 電競機(10.0.5.31)的80 port是否存活

### :9100 
可以看 電競機(10.0.5.31) CPU, memory等狀態