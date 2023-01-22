import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { Modal } from 'antd';

export default function confirmModal(title, message, okText, cancelText, okCallback){
    Modal.confirm({
        title: (
            <div className="text-default font-bold text-base"> { title } </div>
        ),
        icon: <ExclamationCircleOutlined />,
        content: (
            <div className="">{ message }</div>
        ),
        okText: okText,
        cancelText: cancelText,
        centered: true,
        onOk: okCallback
      });
}


