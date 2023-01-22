import {
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import client from "~/api/client";
import styles from "~/styles/E5.module.css";
import Icon from "../Icon";
import { showNotification } from "../Notification";
import PageHeader from "../PageHeader";

const { confirm } = Modal;

const CreateTest1 = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [items, setItems] = useState([]);
  const ref = useRef(0);
  const [form] = Form.useForm();

  const handleAddItem = () => {
    const newItem = {
      id: ref.current++,
      title: "",
      score: 0,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleCreateTest = async (value) => {
    const data = new FormData();
    if (selectedImage instanceof File) {
      data.append("image", selectedImage);
    }
    else {
      data.append("image", "/images/contest-no-image.gif");
    }
    data.append("contest_name", value.testName);
    data.append("pass_score", value.passScore);
    data.append("total_score", totalScore || value.totalScore);
    data.append("items", JSON.stringify(items));

    try {
      let res = await client.post("test/create", { body: data }).json();
      if (res && res.success) {
        form.resetFields();
        handleDeleteImage();
        setItems([]);
        ref.current = 0;
        showNotification({
          type: "success",
          title: "新しい試験作成が成功しました",
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: "新しい試験作成が失敗しました",
      });
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setPreviewImage(URL.createObjectURL(image));
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    URL.revokeObjectURL(previewImage);
  };

  const handleBack = () => {
    if (
      !(
        selectedImage ||
        totalScore ||
        items.length > 0 ||
        form.getFieldValue("testName") ||
        form.getFieldValue("passScore") ||
        form.getFieldValue("totalScore")
      )
    ) {
      router.push("/setting/test");
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
        router.push("/setting/test");
      },
      onCancel() {
        return;
      },
    });
  };

  useEffect(() => {
    const getTotalScore = () => {
      if (items && items.length > 0) {
        const totalScore = items.reduce((total, currentItem) => {
          return total + currentItem.score;
        }, 0);
        setTotalScore(totalScore);
      } else setTotalScore(0);
    };
    getTotalScore();
  }, [items]);
  return (
    <div>
      <PageHeader
        type="create"
        title="試験新規登録"
        onBackBtnClick={handleBack}
      />
      <Form
        name="edit-test-form"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 12,
          offset: 1,
        }}
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={handleCreateTest}
        autoComplete="off"
        className="edit-test-form w-full mt-6"
      >
        <Form.Item
          label={<h4 className="text-default font-medium">サムネイル</h4>}
        >
          {selectedImage ? (
            <div className="relative w-40 h-[90px] group my-2">
              <div className="group-hover:bg-neutral-900/40 group-hover:flex hidden absolute top-0 left-0 bottom-0 right-0 z-10 items-center justify-center">
                <div className="cursor-pointer" onClick={handleDeleteImage}>
                  <DeleteOutlined className="text-white/80 cursor-pointer text-lg hover:text-red-500/80" />
                </div>
              </div>
              <Image
                className="absolute z-0 top-0 left-0 object-cover"
                src={previewImage}
                alt="test image"
                layout="fill"
              />
            </div>
          ) : (
            <div>
              <label className="inline-block w-fit z-10" htmlFor="imageInput">
                <div
                  className={`group ${styles.upload_button_border} transition-all h-8 w-40 cursor-pointer flex justify-center items-center`}
                >
                  <UploadOutlined className="mr-2 group-hover:text-primary" />
                  <span className="group-hover:text-primary">
                    Click to Upload
                  </span>
                </div>
              </label>
              <input
                hidden
                id="imageInput"
                type="file"
                name="image"
                onChange={(event) => {
                  handleSelectImage(event.target.files[0]);
                }}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item
          label={<h4 className="text-default font-medium">試験名</h4>}
          name="testName"
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <Input placeholder="試験名" />
        </Form.Item>

        <Form.Item
          label={<h4 className="text-default font-medium">合格点</h4>}
          name="passScore"
          rules={[
            { required: true, message: "この項目は必須です" },
            {
              message: "総合得点を超えることはできない",
              validator: (_, value) => {
                if (
                  (totalScore && totalScore < value) ||
                  (form.getFieldValue("totalScore") &&
                    form.getFieldValue("totalScore") < value)
                ) {
                  return Promise.reject("Some message here");
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <InputNumber min={0} placeholder="0" />
        </Form.Item>

        {items && items.length > 0 ? (
          <Form.Item
            label={<h4 className="text-default font-medium">総合得点</h4>}
            labelCol={{ offset: 12, span: 4 }}
            wrapperCol={8}
          >
            <InputNumber
              value={totalScore}
              disabled={items && items.length > 0}
              className="ml-[4%] w-[88px]"
              placeholder="0"
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={<h4 className="text-default font-medium">総合得点</h4>}
            name="totalScore"
            labelCol={{ offset: 12, span: 4 }}
            wrapperCol={8}
            rules={[
              {
                required: true,
                message: "この項目は必須です",
              },
            ]}
          >
            <InputNumber
              value={totalScore}
              disabled={items && items.length > 0}
              className="ml-[4%] w-[88px]"
              placeholder="0"
            />
          </Form.Item>
        )}

        {items.map((item, index) => (
          <div className="ant-row" key={item.id}>
            <Form.Item
              name={`title-${item.id}`}
              className="flex ant-col ant-col-8 ml-[22.25%]"
              wrapperCol={{ offset: 3 }}
              label={
                <h4 className="text-default font-medium">項目名{index + 1}</h4>
              }
              rules={[
                {
                  required: true,
                  message: "この項目は必須です",
                },
              ]}
              required
            >
              <Input
                value={item.title}
                placeholder="成分点"
                onChange={(event) => {
                  const copyItems = [...items];
                  copyItems[index].title = event.target.value;
                  setItems(copyItems);
                }}
              />
            </Form.Item>
            <div className="ant-col ant-col-8 flex-nowrap relative">
              <Form.Item
                // name={`items[${index}].itemScore`}
                label={<h4 className="text-default font-medium">点数</h4>}
                key={item.id}
                name={`score-${item.id}`}
                rules={[
                  {
                    required: true,
                    message: "この項目は必須です",
                  },
                ]}
                required
              >
                <InputNumber
                  value={item.score || null}
                  placeholder="0"
                  min={0}
                  onChange={(value) => {
                    const copyItems = [...items];
                    copyItems[index].score = value;
                    setItems(copyItems);
                  }}
                />
              </Form.Item>
              <div
                className="absolute top-[6px]"
                style={{ left: "calc(138px + 33%) " }}
              >
                <Icon
                  className="cursor-pointer"
                  name="delete"
                  color="danger"
                  size={18}
                  onClick={() => handleDeleteItem(index)}
                />
              </div>
            </div>
          </div>
        ))}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button
            type="link"
            onClick={handleAddItem}
            className="text-lg font-bold text-primary"
          >
            +項目を追加する
          </Button>
        </Form.Item>

        <div className="ant-row gap-3">
          <div className="ant-col-offset-17"></div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <div className="flex items-center">
                <Icon name="plus-circle mr-1" color="white" size={16} />
                <span>保存</span>
              </div>
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CreateTest1;
