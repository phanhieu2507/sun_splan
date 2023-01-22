import { Button } from "antd";
import Link from "next/link";
import React from "react";
import DefaultAvatar from "~/assets/images/default_test_avatar.gif";
import Icon from "~/components/Icon";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { showNotification } from "../Notification";
import { Modal } from "antd";
import { deleteTest } from "~/utils/test";

const { confirm } = Modal;

const TestCard = ({ imageUrl, name, id, deletedTest }) => {
  const { confirm } = Modal;
  if (name == null) name = "試験の名前";
  //console.log(imageUrl);
  const handleDeleteTestById = async (id) => {
    await deleteTest(id);
    deletedTest(id);
  };

  const showConfirm = () => {
    confirm({
      title: "この試験を削除してもよろしいですか?",
      icon: <ExclamationCircleOutlined />,
      content: "削除後に復元できません。",
      cancelText: <span>キャンセル</span>,
      okText: <span>削除</span>,
      onOk() {
        handleDeleteTestById(id);
        console.log("ok");
        showNotification({
          type: "success",
          title: "試験を正常に削除しました。",
        });
      },

      onCancel() {
        console.log("Cancel");
      },
      centered: true,
    });
  };

  return (
    <div
      className="rounded-sm flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl transition-all duration-300"
      style={{ border: "1px solid #d9d9d9" }}
    >
      <Link href={`test/${id}`}>
        <div className="flex flex-col items-center">
          <div className="mt-5 mb-6">
            {/* <Image
              src={imageUrl ? imageUrl : DefaultAvatar}
              width={160}
              height={90}
              alt="avatar"
              className="object-cover"
            /> */}
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={
                (imageUrl.startsWith("images/")
                    ? `/`
                    : "") + imageUrl
              }
              width="100%" 
              height="173px" 
              alt="#" 
              style={{objectFit: 'contain'}} 
            />
          </div>

          <h5 className="font-medium max-w-[75%] truncate my-2">{name}</h5>
        </div>
      </Link>

      <div
        className="w-full h-12 flex items-center"
        style={{ borderTop: "1px solid #d9d9d9" }}
      >
        <div
          className="group flex-1 h-12 flex justify-center items-center hover:text-danger transition-all"
          style={{ border: "none" }}
          onClick={showConfirm}
        >
          <Icon
            name="delete"
            size={18}
            color="disabled"
            className="group-hover:bg-danger transition-all"
          />
        </div>
        <Link href={`test/${id}/edit`}>
          <div
            className="flex flex-1 h-6 justify-center items-center text-center group hover:text-primary transition-all"
            style={{ borderLeft: "1px solid #d9d9d9" }}
          >
            <Icon
              name="pencil-squared"
              size={18}
              color="disabled"
              className="group-hover:bg-primary transition-all"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TestCard;
