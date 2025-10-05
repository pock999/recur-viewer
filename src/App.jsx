import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { DownOutlined } from '@ant-design/icons';
import { Tree, Button } from 'antd';

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
          {
            title: 'leaf',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          {
            title: 'leaf',
            key: '0-0-2-0',
          },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
];

function App() {
  const [hierarchyTree, setHierarchyTree] = useState([]);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  
  const buildHierarchyTree = (flatList) => {
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
    flatList.forEach(item => {
      // 確保父節點存在
      if (!map.has(item.parent)) {
        map.set(item.parent, {
          title: item.parent,
          key: item.parent,
          children: []
        });
      }
      
      // 確保子節點存在
      if (!map.has(item.child)) {
        map.set(item.child, {
          title: item.child,
          key: item.child,
          children: []
        });
      }
      
      // 記錄子節點名稱
      childrenNames.add(item.child);
    });

    map.forEach(node => {
      // 檢查當前節點是否存在於 childrenNames 內
      // 沒有就代表這個節點只有 parent 沒有 child ，所以是 root
      
      if (!childrenNames.has(node.key)) {
        // 這個節點是 Level 1 的頂層節點
        tree.push(node);
      }
    });

    // 建立關係
    flatList.forEach(item => {
      const parentNode = map.get(item.parent);
      const childNode = map.get(item.child);
      
      if (parentNode && childNode) {
          // 由於 map.set 已經確保每個節點只會被建立一次，
          // 這裡直接將子節點附加到父節點的 children 陣列中。
          // 需要檢查避免重複（在某些 BOM 結構中可能會出現，儘管遞迴查詢通常不會）：
          if (!parentNode.children.some(c => c.key === childNode.key)) {
              parentNode.children.push(childNode);
          }
      }
    });

    // 移除 children 為空的
    map.forEach(node => {
      if (node.children && node.children.length === 0) {
          delete node.children;
      }
    });

    return tree;

  };

  const clickTestQuery = async () => {
    const res = await window.api.getHierarchyList();
    setHierarchyTree(buildHierarchyTree(res));
  };

  return (
    <>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={['0-0-0']}
        onSelect={onSelect}
        treeData={hierarchyTree}
      />

      <Button
        onClick={clickTestQuery}
      >
        Query
      </Button>
    </>
  )
}

export default App
