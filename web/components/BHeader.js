import { Tabs } from "antd";
import Image from "next/image";
import defaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "./Icon";

const { TabPane } = Tabs;

const BHeader = () => {
  return (
    <div className="shadow-md">
      <div className="flex pt-4">
        <div className="mx-10 flex items-center">
          <Image
            className="object-cover rounded-full"
            width={100}
            height={100}
            src={defaultAvatar}
            alt="avatar"
          ></Image>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-default">グエン・アイン・ヴオン</h3>
          <div className="flex">
            <h5 className="text-default">ハノイ工科大学</h5>
            <h5 className="text-default mx-2 ">-</h5>
            <h5 className="text-default">K64</h5>
          </div>
          <div className="flex">
            <h5 className="text-default">Sun*</h5>
            <h5 className="text-default mx-2 ">-</h5>
            <h5 className="text-default">2022/09/08</h5>
          </div>
          <div className="flex">
            <h5 className="text-default mr-2">卒業予定日:</h5>
            <h5 className="text-default">2024/09/08</h5>
          </div>
        </div>
      </div>
      <div>
        <style>
          {`.ant-tabs-tab.ant-tabs-tab-active .custom-icon, .ant-tabs-tab:hover .custom-icon {
              background-color: #3DA9FC;
            }
              .custom-icon {
                transition: all .3s;
              }
            `}
        </style>
        <Tabs tabPosition="bottom" defaultActiveKey="Home" centered={true}>
          <TabPane
            tab={
              <div className="w-24 flex justify-center items-center gap-1">
                <Icon name="house" size={16} />
                ホーム
              </div>
            }
            key="Home"
          ></TabPane>
          <TabPane
            tab={
              <div className="w-24 flex justify-center items-center gap-1">
                <Icon name="info" size={16} />
                基本データ
              </div>
            }
            key="基本データ"
          ></TabPane>
          <TabPane
            tab={
              <div className="w-24 flex justify-center items-center gap-1">
                <Icon name="plant" size={16} /> 学習目標
              </div>
            }
            key="学習目標"
          ></TabPane>

          <TabPane
            tab={
              <div className="w-24 flex justify-center items-center gap-1">
                <Icon name="schedule" size={16} />
                学習統計
              </div>
            }
            key="学習統計"
          ></TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default BHeader;
