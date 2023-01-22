import { Input, InputNumber, Modal, Select, message } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import TextArea from "antd/lib/input/TextArea";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import defaultAvatar from "~/assets/images/default-avatar.png";
import PropTypes from "prop-types";
import ky from "ky";

const { Option } = Select;
const { confirm } = Modal;


const C1CreatePost = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plans, setPlans] = useState([]);
  const [unit, setUnit] = useState("");
  const [memo, setMemo] = useState("");
  const [postAmount, setPostAmount] = useState(0);
  const [postJikan, setPostJikan] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ky
          .get(`/api/user/plan-details?user_id=${props.currentUser.id}`)
          .json();
        setPlans(res.data);
      } catch (error) {
        //
        message.error("Failed to fetch plans");
      }
    };

    fetchData();
  }, [props.currentUser.id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClickOk = async () => {
    if (postAmount === 0 || (postJikan === 0 && unit !== "時間") || !selectedPlan?.id) {
      message.error("入力必須項目は、全てご記入下さい！");
      return;
    } 
    const key = "updatable";

    let newPost = {
      user_id: props.currentUser.id,
      memo: memo,
      real_amount: postAmount,
      real_time: postJikan,
      plan_detail_id: selectedPlan.id,
    };

    try {
      message.loading({
        content: "処理ている...",
        key,
      });
      let res = await ky
        .post(`/api/posts/create-post/`, {
          json: newPost,
        })
        .json();
      props.addPost(res.data);
      setIsModalVisible(false);
      setUnit("");
      setMemo("");
      setPostAmount(0);
      setPostJikan(0);
      setSelectedPlan({});
      setIsModalVisible(false);
      message.success({ content: "学習の状況を報告った！", key });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    if (memo != "" || postAmount != 0 || postJikan != 0 || selectedPlan?.id ) {
      confirm({
        title: 'まだ学習の状態を報告していません。',
        style: { top: 200 },
        destroyOnClose: true,
        icon: <ExclamationCircleOutlined />,
        content: '報告せずに閉じますか？',
        okText: 'はい',
        cancelText: 'いいえ',
        onOk() {
          setUnit("");
          setMemo("");
          setPostAmount(0);
          setPostJikan(0);
          setSelectedPlan({});
          setIsModalVisible(false);
        },
        onCancel() {
          return;
        },
      })
    }
    else {
      setIsModalVisible(false);
    }
  };

  const handleChange = (value) => {
    value = JSON.parse(value);
    setUnit(value.unit);
    setSelectedPlan(value);
  };

  return (
    <div>
      <div
        className="flex items-center gap-4 px-4 bg-white py-3 mb-2 shadow-md pr-8 w-full rounded-2xl cursor-pointer"
        onClick={showModal}
      > 
        <div className="avatar w-12 h-12 rounded-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            className="rounded-full object-fill w-[48px] h-[48px]" 
            alt="avatar" 
            src={
              props.currentUser?.avatar ? 
              (props.currentUser.avatar.startsWith('images/') ? "/" : "") + props.currentUser.avatar 
              : 
              defaultAvatar.src
            } 
          />
        </div>
        <div
          className="rounded-lg h-10 flex items-center px-5 w-full"
          style={{ border: "1px solid #BFBFBF" }}
        >
          <span className="text-base" style={{ color: "rgba(0, 0, 0, 0.5)" }}>
            学習の状況を報告する
          </span>
        </div>
      </div>
      <Modal
        title={
          <span className="text-default font-medium">学習の状態を報告する</span>
        }
        width={680}
        visible={isModalVisible}
        destroyOnClose={true}
        onOk={handleClickOk}
        onCancel={handleCancel}
        cancelText={<span className="text-default">キャンセル</span>}
        okText={<span className="text-white">報告</span>}
      >
        <div>
          <div className="flex items-center mb-5">
            <div className="w-32 text-right mr-5 text-default">
              <span>計画</span>
              <span className="text-danger">*</span>
              <span>:</span>
            </div>
            <div>
              <Select
                placeholder={<span className="flex justify-center">計画</span>}
                style={{
                  width: 480,
                }}
                onSelect={handleChange}
              >
                {plans.map((plan) => (
                  <Option key={plan.id} value={JSON.stringify(plan)}>
                    {plan.doc_name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          {
            unit && (
              <div className="flex items-center gap-5 mb-5">
                <div className="w-32 text-right text-default">
                  <span>学習した単位</span>
                  <span className="text-danger">*</span>
                  <span>:</span>
                </div>
                <div className="flex items-center text-default">
                  <InputNumber
                    className="w-[200px] mr-2 text-default"
                    placeholder="数字"
                    min={1}
                    max={selectedPlan.expected_amount - selectedPlan.real_amount}
                    onChange={(value) => setPostAmount(value)}
                  />
                  <span className="">{unit}</span>
                </div>
                {unit !== "時間" && (
                  <div className="flex items-center text-default">
                    <InputNumber
                      className="w-[200px] mr-2 text-default"
                      placeholder="数字"
                      // precision={2}
                      min={1}
                      onChange={(value) => setPostJikan(value)}
                    />
                    <span className="">時間</span>
                  </div>
                )}
              </div>
            )
          }
          
          <div className="flex gap-5">
            <div className="min-w-[128px] text-right text-default">
              <span>メモ</span>
              <span>:</span>
            </div>
            <div className="flex-1">
              <TextArea
                style={{aspectRatio: '32/9'}}
                className="text-default w-[480px]"
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

C1CreatePost.propTypes = {
  currentUser: PropTypes.object,
  addPost: PropTypes.func
};

export default C1CreatePost;
