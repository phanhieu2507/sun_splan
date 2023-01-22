import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import client from "~/api/client";
import Icon from "~/components/Icon";
import { showNotification } from "~/components/Notification";
import Logo from "~/assets/app-logo.svg";
import Image from "next/image";
import defaultAvatar from "~/assets/images/default-avatar.png";
import { Popover } from "antd";

const Navbar = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState();
  const handleLogout = async () => {
    try {
      await client.get("auth/logout");
      localStorage.removeItem("currentUser");
      router.push(`/login`);
      showNotification({
        type: "success",
        title: "ログアウトが成功しました。",
      });
    } catch (error) {
      console.log("Logout false with error: ", error);
      router.push(`/login`);
      showNotification({
        type: "success",
        title: "ログアウトが成功しました。",
      });
    }
  };

  React.useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser) {
      setAvatar(currentUser.avatar);
    }
  }, []);

  const [visible, setVisible] = React.useState(false);
  const hide = () => {
    setVisible(false);
  };
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  return (
    <div
      style={{ borderBottom: "1px solid #ddd" }}
      className="h-16 mx-auto px-8 bg-white flex justify-between items-center shadow-md"
    >
      <Image src={Logo} alt="SPLAN" height={60} width={120} />
      <div className="flex gap-10 items-center">
        <Link href="/">
          <a className="text-lg font-extrabold">ホーム</a>
        </Link>
        <Link href="/home/1">
          <a className="text-lg">内定者TOP</a>
        </Link>
        <Link href="/documents">
          <a className="text-lg">教材一覧</a>
        </Link>
        <Link href="/setting/user/naiteisha">
          <a className="text-lg">設定</a>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Icon name="notification" size={28} />
        <Popover
          placement="bottomRight"
          content={
            <div className="flex flex-col items-end gap-2">
              <span className="text-base font-medium cursor-pointer hover:text-primary">
                プロフィール表示
              </span>
              <span
                className="text-base font-medium cursor-pointer hover:text-primary"
                onClick={() => handleLogout()}
              >
                ログアウト
              </span>
            </div>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <div className="avatar-container w-9 h-9 overflow-hidden rounded-full cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="rounded-full object-cover w-[36px] h-[36px]" 
              alt="avatar" 
              src={
                avatar ? 
                (avatar.startsWith('images/') ? "/" : "") + avatar 
                : 
                defaultAvatar.src
              } 
            />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
