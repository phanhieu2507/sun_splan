import { Button, DatePicker, Form, Modal, Spin } from "antd";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import client from "~/api/client";
import FreeContentTarget from "~/components/C3components/AddTarget/FreeContentTarget";
import JapanesesContest from "~/components/C3components/AddTarget/JapanesesContest";
import SelectTargetType from "~/components/C3components/SelectTargetType";
import HomeLayout from "~/components/layout/HomeLayout";
import PageHeader from "~/components/PageHeader";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { showNotification } from "~/components/Notification";
import { useRouter } from "next/router";

const { confirm } = Modal;

const CreateTarget = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState([]);
  const [dateOfTarget, setDateOfTarget] = useState("");
  const [dateOfTargetsFromAPI, setDateOfTargetsFromAPI] = useState([]);
  const [reGetDateOfTargets, setReGetDateOfTargets] = useState(false);
  const [form] = Form.useForm();
  const ref = useRef(0);
  const router = useRouter();

  const handleAddJapaneseContestTarget = (contestName) => {
    const newTarget = {
      id: ref.current++,
      category: "日本語",
      exam_date: "",
      type: 0,
      contest_name: contestName,
      score_eaches: [
        { part_name: "言語知識", expected_score: -1 },
        { part_name: "読解", expected_score: -1 },
        { part_name: "聴解", expected_score: -1 },
      ],
    };
    setTargets([...targets, newTarget]);
  };

  const handleAddFreeContentTarget = (category) => {
    const newTarget = {
      id: ref.current++,
      category,
      type: 1,
      content: "",
    };
    setTargets([...targets, newTarget]);
  };

  const handleDeleteTarget = (id) => {
    const newTargets = targets.filter((target) => target.id !== id);
    setTargets(newTargets);
  };

  const handleEditTarget = (id, target) => {
    const newTargets = [...targets];
    const index = newTargets.indexOf(
      newTargets.find((target) => {
        return target.id === id;
      })
    );
    newTargets[index] = target;
    setTargets(newTargets);
  };

  const onFinish = async (values) => {
    const newTarget = {
      date_of_target: dateOfTarget,
      targets,
    };
    try {
      const res = await client
        .post("target/create", { json: newTarget })
        .json();
      if (res && res.success) {
        form.resetFields();
        setReGetDateOfTargets((state) => !state);
        setTargets([]);
        setDateOfTarget("");
        ref.current = 0;
        showNotification({
          type: "success",
          title: "目標が正常に作成されました",
        });
      } else {
        showNotification({
          type: "error",
          title: "新しい目標が失敗しました",
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: "新しい目標が失敗しました",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleBack = () => {
    if (targets.length === 0 && !dateOfTarget) {
      router.back();
      return;
    }

    confirm({
      title: "変更内容が保存されません。",
      style: { top: 250 },
      destroyOnClose: true,
      icon: <ExclamationCircleOutlined />,
      content: "よろしいですか？",
      okText: "はい",
      cancelText: "いいえ",
      onOk() {
        router.back();
      },
      onCancel() {
        return;
      },
    });
  };

  useEffect(() => {
    const callAPI = async () => {
      try {
        setLoading(true);
        const userId = Number(
          JSON.parse(localStorage.getItem("currentUser")).id
        );
        const userRes = await client
          .get(`user/naiteisha?user_id=${userId}`)
          .json();
        if (!userRes.data) {
          router.push("/");
        } else {
          setUserInfo(userRes.data);
        }
      } catch (err) {
        setUserInfo({});
      } finally {
        setLoading(false);
      }
    };
    callAPI();
  }, [router]);

  useEffect(() => {
    const callAPI = async () => {
      try {
        setLoading(true);
        const userId = Number(
          JSON.parse(localStorage.getItem("currentUser")).id
        );
        const dateOfTargetRes = await client
          .get(`targets/date-of-target/${userId}`)
          .json();
        if (!dateOfTargetRes.data) {
          router.push("/");
        } else {
          setDateOfTargetsFromAPI(dateOfTargetRes.data);
        }
      } catch (err) {
        setDateOfTargetsFromAPI([]);
      } finally {
        setLoading(false);
      }
    };
    callAPI();
  }, [reGetDateOfTargets, router]);

  return (
    <HomeLayout userInfo={userInfo} active={"学習目標"}>
      <div className="w-full h-full bg-white mt-2 p-8 overflow-y-scroll rounded-2xl">
        <PageHeader
          type="create"
          title="目標新規登録"
          onBackBtnClick={handleBack}
        />
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true,
          }}
          labelCol={{
            span: 8,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="edit-test-form"
        >
          <Form.Item
            label={<h4 className="text-default font-medium">マイルストーン</h4>}
            name="dateOfTarget"
            wrapperCol={{ span: 10, offset: 1 }}
            rules={[
              {
                required: true,
                message: "この項目は必須です",
              },
            ]}
          >
            <DatePicker
              className="w-60"
              disabledDate={(current) => {
                return (
                  (current && current < moment().subtract(1, "days")) ||
                  dateOfTargetsFromAPI.find(
                    (dateOfTarget) =>
                      moment(dateOfTarget.dateOfTarget).format("YYYY-MM") ===
                      moment(current._d).format("YYYY-MM")
                  )
                );
              }}
              mode="month"
              picker="month"
              labelAlign="right"
              placeholder="マイルストーン"
              onChange={(date, dateString) =>
                setDateOfTarget(dateString + "-01")
              }
            />
          </Form.Item>
          <Form.Item
            label={<h4 className="text-default font-medium">学習目標</h4>}
            name="学習目標"
            wrapperCol={{ span: 10, offset: 1 }}
            rules={[
              {
                message: "目標を選択してください",
                validator: (_, value) => {
                  if (targets.length === 0) {
                    return Promise.reject("Some message here");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <SelectTargetType
              handleAddJapaneseContestTarget={handleAddJapaneseContestTarget}
              handleAddFreeContentTarget={handleAddFreeContentTarget}
            />
          </Form.Item>
          <div className="gap-3 flex flex-col">
            {targets.map((target) => {
              if (target.type) {
                return (
                  <FreeContentTarget
                    freeContentTarget={target}
                    key={target.id}
                    handleDeleteTarget={handleDeleteTarget}
                    handleEditTarget={handleEditTarget}
                  />
                );
              } else {
                return (
                  <JapanesesContest
                    japaneseContest={target}
                    key={target.id}
                    handleDeleteTarget={handleDeleteTarget}
                    handleEditTarget={handleEditTarget}
                    dateOfTarget={dateOfTarget}
                  />
                );
              }
            })}
          </div>
          <div className="flex justify-end mt-3">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                作成
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      {loading && (
        <div
          className={
            "loading flex flex-col gap-3 justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 z-[999] "
          }
        >
          <style>
            {`
              .loading .ant-spin-text {
                color: #fff;
              }
              .loading .ant-spin-dot-item {
                background-color: white;
              }
            `}
          </style>
          <Spin size="large" />
          <div className="text-white text-lg"> 読み込んでいます... </div>
        </div>
      )}
    </HomeLayout>
  );
};

export default CreateTarget;
