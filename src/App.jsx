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
  const [resultStr, setResultStr] = useState('');


  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  
  const clickTestQuery = async () => {
    const res = await window.api.getTestResultText();
    setResultStr(JSON.stringify(res));
  };

  return (
    <>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={['0-0-0']}
        onSelect={onSelect}
        treeData={treeData}
      />

      { resultStr }

      <Button
        onClick={clickTestQuery}
      >
        Test Query
      </Button>
    </>
  )
}

export default App
