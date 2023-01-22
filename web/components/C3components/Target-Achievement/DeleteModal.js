import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, notification } from 'antd';

const { confirm } = Modal;

const msg = {
    c3204: "削除してもよろしいですか？",
    c3210: "目標を正常に削除しました",
}

const openNotification = (props) => {
    const key = `open${Date.now()}`;
    notification.open({
        type: props.type,
        message: props.title,
        description: props.description,
        key,
        duration: 2,
    });
}

export const handleOnDelete = (handleOnOk) => {
    confirm({
        title: msg.c3204,
        style: { top: 300 },
        icon: <ExclamationCircleOutlined/>,
        context: '',
        okText: 'はい',
        cancelText: 'いいえ',
        onOk(){
            openNotification({
                type: 'success',
                title: '削除成功',
                description: msg.c3210,
            })
            handleOnOk();
        },

        onCancel(){
            return;
        }
    })
}