import uiConfig from "../shared/config/ui-config";

const config = new Map(); // 初始化空的 config map

// 取得所有 key 的陣列，然後迭代
Object.keys(uiConfig.columnDisplay).forEach((key) => {
  const value = uiConfig.columnDisplay[key]; // 取得對應的 value

  // 將新格式的物件寫入 config
  config.set(key, {
    key: key,
    value: value,
  });
});

export const configMap = config;
export const primaryColumnKey = uiConfig.primaryColumnKey;
export const showTitleKey = Array.from(config.values()).map((item) => item.key);
export const showTitle = Array.from(config.values()).map((item) => item.value);
