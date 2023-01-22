import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import React, { useEffect } from "react";
import DefaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "~/components/Icon";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import client from "~/api/client";
import { showNotification } from "~/components/Notification";

const UserCard = ({
  avatar,
  userId,
  name,
  company,
  university,
  role,
  setReRender,
}) => {
  const { confirm } = Modal;
  const router = useRouter();

  const handleDeleteUser = async () => {
    try {
      const res = await client.delete(`user/user-manager/${userId}`).json();
      if (res.success) {
        setReRender((state) => !state);
        showNotification({
          type: "success",
          title: "ユーザを削除することに成功しました。",
        });
      } else {
        showNotification({
          type: "error",
          title: "ユーザを削除することに失敗しました。",
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: "このユーザを削除してもよろしいですか?",
      icon: <ExclamationCircleOutlined />,
      content: "削除後に復元できません。",
      cancelText: <span>キャンセル</span>,
      okText: <span>削除</span>,
      async onOk() {
        await handleDeleteUser();
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
      <Link href={`user-detail/${userId}`}>
        <div className="flex items-center flex-col w-full">
          <div className="mt-5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */} 
            <img
              src={avatar ? avatar : DefaultAvatar.src}
              alt="avatar"
              className="object-cover rounded-full w-[96px] h-[96px]"
            />
          </div>

          <h5 className="font-medium max-w-[75%] truncate my-2">{name}</h5>
          {university && (
            <span className="max-w-[75%] text-disabled truncate my-2">
              {university}
            </span>
          )}

          {company && (
            <span className="max-w-[75%] text-disabled truncate my-2">
              {company}
            </span>
          )}

          {role === 2 && (
            <span className="max-w-[75%] text-disabled truncate my-2">GEU</span>
          )}
        </div>
      </Link>
      {role && role !== 2 && (
        <div
          className="w-full h-12 flex items-center"
          style={{ borderTop: "1px solid #d9d9d9" }}
        >
          <div
            className="group flex-1 h-6 flex justify-center items-center hover:text-danger transition-all"
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
          <Link href={`user-detail/edit/${userId}`}>
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
      )}
    </div>
  );
};

export default UserCard;
