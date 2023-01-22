import { useEffect } from "react"
import { useState } from "react"
import { message, Upload } from "antd"
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import Button from "../Button";
import DefaultAvatar from "../../assets/images/default-avatar.png";


const UploadAvatar = ({ 
    formData, 
    setFormData, 
    submittedForm,
}) => {
    const [previewAvatar, setPreviewAvatar] = useState(true); 
    const [imgLoading, setImgLoading] = useState(false);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Set preview image
    const handlePreviewAvatar = (file) => {
        file.preview = URL.createObjectURL(file);
		setFormData({...formData, avatar: file});
        setPreviewAvatar(!previewAvatar);
    }

    // Delete preview image
    const handleDeletePreviewAvatar = () => {
        URL.revokeObjectURL(formData?.avatar?.preview);
        setFormData({...formData, avatar: null});
        setFileList([]);
    }

    const beforeUpload = (file) => {
        const isValidType = file.type === 'image/jpg' || file.type === 'image/png' || file.type==='image/jpeg'
        if(!isValidType){
            message.error('This is not valid image');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if(!isLt5M){
            message.error('Image must smaller than 5MB!');
        }
        if(isLt5M && isValidType){
            setImgLoading(true);
            handlePreviewAvatar(file);
            setFileList([{
                uid: "image",
                name: file?.name,
                percent: 100,
                status: true,
                url: file?.preview,
            }])
            setImgLoading(false);
        }
        return isValidType && isLt5M;
    }

    useEffect(() => {
        handleDeletePreviewAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submittedForm])

    // Delete preview image
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(formData?.avatar?.preview)
        }
    }, [previewAvatar, formData?.avatar?.preview])

    return(
        <div className="flex flex-col relative">
            <div 
                onMouseOver={() => setShowDeleteBtn(true)}
                onMouseLeave={() => setShowDeleteBtn(false)}
            >
                <div className="flex justify-center items-center rounded-full w-[150px] h-[150px] bg-gray-100">
                    {imgLoading ? 
                        <LoadingOutlined /> 
                        : 
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                            className="rounded-full object-cover w-[150px] h-[150px]" 
                            alt="avatar" 
                            src={
                                formData?.avatar?.preview 
                                || 
                                (formData?.avatar && (formData.avatar.startsWith('images/') ? "/" : "") + formData.avatar)
                                || 
                                DefaultAvatar.src
                            } 
                        />
                    }
                </div>
                {(formData?.avatar?.preview || formData?.avatar) && showDeleteBtn && 
                    <div className="flex justify-center items-center rounded-full w-[150px] h-[150px] bg-neutral-900/40 absolute top-0 z-10">
                        <DeleteOutlined 
                            className="text-2xl text-white/80 cursor-pointer hover:text-red-500/80" 
                            onClick={handleDeletePreviewAvatar}
                        />
                    </div>
                }
            </div>
            <div className="mt-4">
                <Upload
                    name="avatar"
                    className="avatar-uploader"
                    maxCount={1}
                    fileList={fileList}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                >
                    <Button type="fill" htmlType="button">画像アップロード</Button>
                </Upload>
            </div>
        </div>
    )
}
export default UploadAvatar;
