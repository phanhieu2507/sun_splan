import { Input, Popover } from "antd";
import React, { useContext } from "react";
import Icon from "../Icon";
import NaiteiShaFilter from "./NaiteiShaFilter";
import { useState } from "react";
import KyoushiFilter from "./KyoushiFilter";
import KigyoutantoushaFilter from "./KigyoutantoushaFilter";
import { UserListContext } from "~/pages/setting/user/[userType]";

const UserSearch = ({ role }) => {
  const [visible, setVisible] = useState(false);
  const { name, setName } = useContext(UserListContext);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  return (
    <div className="w-[680px]">
      <div className="container rounded-2xl">
        <div className="grid justify-items-center">
          <div className="flex items-center">
            <Input
              className="my-4 mr-4
                            border-[1px]  border-input-default rounded-[2px]
                            focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                            "
              placeholder="検索"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <Popover
              content={
                <div className="pt-4">
                  {role === "naiteisha" && (
                    <NaiteiShaFilter
                      handleVisibleChange={handleVisibleChange}
                    />
                  )}

                  {role === "teacher" && (
                    <KyoushiFilter handleVisibleChange={handleVisibleChange} />
                  )}

                  {role === "manager" && (
                    <KigyoutantoushaFilter
                      handleVisibleChange={handleVisibleChange}
                    />
                  )}
                </div>
              }
              title={<h4>検索オプション</h4>}
              trigger="click"
              visible={visible}
              placement="bottomRight"
              onVisibleChange={handleVisibleChange}
            >
              {role !== "mentor" && (
                <div className="flex justify-center items-center">
                  <Icon name="filter cursor-pointer" size={32}></Icon>
                </div>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
