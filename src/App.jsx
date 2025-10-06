import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { DownOutlined } from "@ant-design/icons";
import {
  Tree,
  Button,
  Input,
  Flex,
  Spin,
  Divider,
  List,
  Typography,
} from "antd";

const getInfoString = (key, infoMap) => {
  const info = infoMap.get(key);
  if (!info) {
    return `${key}`;
  }
  return `${key}-${info["material_type"]} (${info["manufacturer"]})`;
};

const getAllParentKeys = (data, keys = []) => {
  data.forEach((item) => {
    // 只有有 children 的節點才需要被展開
    if (item.children && item.children.length > 0) {
      keys.push(item.key);
      getAllParentKeys(item.children, keys);
    }
  });
  return keys;
};

function App() {
  const [hierarchyTree, setHierarchyTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchParent, setSearchParent] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onExpand = (newExpandedKeys) => {
    // 每次使用者操作時，更新 expandedKeys 狀態
    setExpandedKeys(newExpandedKeys);
  };

  const buildHierarchyTree = (flatList, infoMap) => {
    if (!flatList || flatList.length === 0) {
      return [];
    }

    // 建立所有節點 map，供快速查找
    const map = new Map();

    // 紀錄所有 children 的列表
    const childrenNames = new Set();

    // 最後的結果
    const tree = [];

    // 把所有節點紀錄進去 map 內
    flatList.forEach((item) => {
      // 確保父節點存在
      if (!map.has(item.parent)) {
        map.set(item.parent, {
          title: getInfoString(item.parent, infoMap),
          key: item.parent,
          children: [],
        });
      }

      // 確保子節點存在
      if (!map.has(item.child)) {
        map.set(item.child, {
          title: getInfoString(item.child, infoMap),
          key: item.child,
          children: [],
        });
      }

      // 記錄子節點名稱
      childrenNames.add(item.child);
    });

    map.forEach((node) => {
      // 檢查當前節點是否存在於 childrenNames 內
      // 沒有就代表這個節點只有 parent 沒有 child ，所以是 root

      if (!childrenNames.has(node.key)) {
        // 這個節點是 Level 1 的頂層節點
        tree.push(node);
      }
    });

    // 建立關係
    flatList.forEach((item) => {
      const parentNode = map.get(item.parent);
      const childNode = map.get(item.child);

      if (parentNode && childNode) {
        // 由於 map.set 已經確保每個節點只會被建立一次，
        // 這裡直接將子節點附加到父節點的 children 陣列中。
        // 需要檢查避免重複（在某些 BOM 結構中可能會出現，儘管遞迴查詢通常不會）：
        if (!parentNode.children.some((c) => c.key === childNode.key)) {
          parentNode.children.push(childNode);
        }
      }
    });

    // 移除 children 為空的
    map.forEach((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  const clickQuery = async (header) => {
    setLoading(true);
    const res = await window.api.getHierarchyList(header);
    const listSet = new Set();
    res.forEach((x) => {
      listSet.add(x["child"]);
      listSet.add(x["parent"]);
    });
    const infoRes = await window.api.getInfoByKey([...listSet]);
    const infoMap = new Map();
    infoRes.forEach((item) => {
      if (!infoMap.has(item["material"])) {
        infoMap.set(item["material"], item);
      }
    });
    const hierarchyTree = buildHierarchyTree(res, infoMap);
    const allKeys = getAllParentKeys(hierarchyTree);
    setHierarchyTree(hierarchyTree);
    setExpandedKeys(allKeys);
    setLoading(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "400px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Flex
            align="center"
            gap="middle"
            style={{ width: "100%" }}
            justify="center"
          >
            <Spin size="large" />
          </Flex>
        ) : (
          <>
            <Input
              placeholder="Please Input the key"
              variant="underlined"
              value={searchParent}
              onChange={(e) => setSearchParent(e.target.value)}
              onPressEnter={() => clickQuery(searchParent)}
            />
            <Tree
              style={{
                flex: 1,
                width: "100%",
                overflow: "auto",
              }}
              showLine
              switcherIcon={<DownOutlined />}
              onSelect={onSelect}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              treeData={hierarchyTree}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
