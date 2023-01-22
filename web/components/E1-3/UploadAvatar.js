import React from "react"
import { useState } from "react"
import { message, Upload } from "antd"
import { LoadingOutlined } from '@ant-design/icons';
import Button from "../Button";

const UploadAvatar = ({ setImageUrl }) => {
    const [loading, setLoading] = useState(false)

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isValidType = file.type === 'image/jpg' || file.type === 'image/png' || file.type==='image/jpeg'
        if(!isValidType){
            message.error('This is not valid image')
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if(!isLt5M){
            message.error('Image must smaller than 2MB!');
        }
        return isValidType && isLt5M
    }
    
    const handleOnchange = (info) => {
        if(info.file.status === 'uploading'){
            setLoading(true)
            return;
        }
        if(info.file.status === 'done'){
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false)
                setImageUrl(url)
            })
        }
    }

    return(
        <Upload
            name="avatar"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleOnchange}
        >
            <div className="mt-4">
                <Button type="fill" >画像アップロード</Button>
            </div>
        </Upload>
    )
}
export default UploadAvatar


