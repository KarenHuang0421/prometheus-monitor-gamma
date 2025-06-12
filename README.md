# prometheus-monitor-gamma

以 Prometheus 監控遠端主機並在異常時發出通知（郵件與 LINE）。預設會監控 10.0.5.31，此 IP 無法以環境變數設定，若欲監控其他主機請修改 `prometheus/prometheus.yml`。

## 執行方式
1. 取得程式碼（預設 develop 分支）。
2. 執行 `docker compose up -d` 啟動所有服務。

## 服務列表
- **Prometheus**：<http://localhost:9090>
- **Blackbox Exporter**：<http://localhost:9115>
- **Alertmanager**：<http://localhost:9093>
- **LINE relay**：<http://localhost:3000>
- **Grafana**：<http://localhost:3001>（預設帳密 `admin/admin`）

## Grafana 資訊面板
啟動後可使用預設帳號 `admin/admin` 登入 Grafana。資料來源已在
`grafana/provisioning/datasources/datasource.yml` 中指向 Prometheus，目錄
`grafana/dashboards/` 內的 JSON 會自動匯入為儀表板。若想增加或修改面板，可將新
的 JSON 放入此目錄並在 `grafana/provisioning/dashboards/dashboards.yml`
設定路徑，即可在重啟容器後看到。

## LINE 推播設定
建立 LINE Developer 帳號並啟用 Message API，取得下列參數後在 `relays/line/.env` 檔設定：
```
LINE_TO_USER_ID=<user id>
LINE_CHANNEL_TOKEN=<channel token>
```
訊息格式可在 `relays/line/relay.js` 中調整。

## 郵件設定
於 `alertmanager.yml` 中填入 SMTP 帳號密碼即可使用。因 Prometheus 不支援以環境變數設定此處，帳密將直接寫在設定檔內。

## 警示規則
警示條件定義在 `prometheus/rules/` 目錄下的 YAML 檔。當前範例包含
`node_alerts.yml` 與 `blackbox_alerts.yml`：
* **node_alerts.yml**：監控 CPU、記憶體與磁碟用量，並偵測目標主機是否離線。
* **blackbox_alerts.yml**：透過 Blackbox Exporter 檢查網站連線是否正常。

要調整警示閾值，請編輯規則檔內的 `expr`。新增規則時把 YAML 檔放入此目錄即可被
`prometheus.yml` 的 `rule_files` 設定自動載入。
更多訊息格式請參考 [官方文件](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config)，其他可用 webhook 範例可見 [此處](https://prometheus.io/docs/operating/integrations/#alertmanager-webhook-receiver)。

## 檔案結構
- `prometheus/`：Prometheus 設定與警示規則。
- `alertmanager.yml`：Alertmanager 設定。
- `grafana/`：Grafana dashboards 與自動匯入設定。
- `relays/line/`：推播 LINE 的中繼服務。

啟動後即可透過瀏覽器連至上述服務查看監控狀態，並在發生問題時收到通知。
