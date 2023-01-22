import { useRouter } from "next/router";
import React from "react";
import SidebarItem from "./SidebarItem";
import PropTypes from "prop-types";
function SettingSidebar(props) {
  const router = useRouter();

  return (
    <div
      className={
        "setting-sidebar bg-white h-full flex flex-col gap-4 shadow-lg w-full " +
        (props.minimized ? "" : "p-6")
      }
    >
      <SidebarItem
        href="/setting/user/naiteisha"
        title="ユーザ設定"
        iconName="people-fill"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
      <SidebarItem
        href="/setting/company"
        title="企業設定"
        iconName="building"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
      <SidebarItem
        href="/setting/university"
        title="大学設定"
        iconName="school"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
      <SidebarItem
        href="/setting/class"
        title="授業設定"
        iconName="door-open-fill"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
      <SidebarItem
        href="/setting/test"
        title="試験設定"
        iconName="file-text"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
      <SidebarItem
        href="/setting/category"
        title="カテゴリー設定"
        iconName="category"
        currentPath={router.asPath}
        minimized={props.minimized}
      />
    </div>
  );
}

SettingSidebar.propTypes = {
  minimized: PropTypes.bool,
};

export default SettingSidebar;
