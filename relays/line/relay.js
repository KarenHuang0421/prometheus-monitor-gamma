const express = require("express");
const axios = require("axios");

require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = 3000;

const statusType = {
  resolved: "已解決",
  firing: "異常",
};

const alertName = {
  WebDown: "網站異常",
  HighCpuUsagePort9182: "CPU 使用率過高",
  HighMemoryUsagePort9182: "記憶體使用率過高",
};

app.post("/alert", async (req, res) => {
  // Alertmanager 可能一次送多條；這裡把關鍵欄位組合成文字
  const alerts = req.body.alerts || [];
  const lines = alerts.map((a) => {
    const status = statusType[a.status] || "未知狀態";
    const name =
      alertName[a.labels.alertname] || `未知警報(${a.labels.alertname})`;
    const content = a.annotations.summary + ":\n" + a.annotations.description;
    const timestamp = new Date(a.startsAt).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
    });
    const timestamp2 = new Date(a.endsAt).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
    });
    const timeStampCurrent = new Date().toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
    });

    if (a.status !== "resolved") {
      return `【${status}】${name}\n\n${
        content || ""
      }\n\n異常時間：\n${timestamp} 至${timeStampCurrent}(當前)`;
    }

    return `【${status}】${name}\n\n${
      content || ""
    }\n\n異常時間：\n${timestamp} 至\n${timestamp2}`;
  });
  const msg = lines.join("\n\n");

  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: process.env.LINE_TO_USER_ID,
        messages: [{ type: "text", text: msg.slice(0, 1000) }],
      },
      { headers: { Authorization: `Bearer ${process.env.LINE_CHANNEL_TOKEN}` } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("LINE push error", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () =>
  console.log(`LINE relay listening on http://localhost:${PORT}/alert`)
);
