import React from "react";
import {DeleteOutlined, PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Upload } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import BackButton from "~/components/BackButton";
import styles from "~/styles/E5.module.css";
import Icon from "../Icon";
import { showNotification } from "../Notification";
import client from "~/api/client";
import EachItem from "../E3-3/EachItem";
import PageHeader from "../PageHeader";

const CreateUniversity = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const ref = useRef(0);
  const [form] = Form.useForm();

  const handleAddItem = () => {
    const newItem = {
      id: ref.current++,
      gradeCode: "",
      entranceYear: "",
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleCreateUniversity = async (value) => {
    const data = new FormData();
    data.append("image", selectedImage);
    data.append("name", value.universityName);
    data.append("abbreviation", value.universityNameAbb);
    data.append("items", JSON.stringify(items));

    try {
      const res = await client
        .post("universities/create", { body: data })
        .json();
      if (res && res.success) {
        form.resetFields();
        handleDeleteImage();
        setItems([]);
        ref.current = 0;
        showNotification({
          type: "success",
          title: "新しい大学作成が成功しました",
        });
      }
      console.log("newUniversity: ", data);
    } catch (error) {
      showNotification({
        type: "error",
        title: "新しい大学作成が失敗しました",
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

  return (
    <div>
      <PageHeader
        type="create"
        title="大学新規登録"
        onBackBtnClick={() => router.back()}
      />
      <div className="mt-4 flex flex-col items-center font-semibold ">
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleCreateUniversity}
          autoComplete="off">
          <div className="flex flex-col mt-10 min-w-[860px]">
            <div className="flex mb-10">
              <div className="flex items-center justify-end min-w-[200px] mr-12 h-8">
                <span className="col-span-3 text-right text-xl font-bold text-default">
                  サムネイル:
                </span>
              </div>

              <div className="flex flex-col">
                <label className="inline-block w-fit z-10" htmlFor="imageInput">
                  <div
                    className={`group ${styles.upload_button_border} transition-all h-8 w-40 cursor-pointer flex justify-center items-center`}>
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
                {selectedImage && (
                  // <div>
                  //   <div className="flex items-center my-2">
                  //     <PaperClipOutlined className="mr-2" />
                  //     <span className="leading-none mr-4">
                  //       {selectedImage.name}
                  //     </span>
                  //     <div
                  //       className="cursor-pointer"
                  //       onClick={() => {
                  //         handleSelectImage(null);
                  //       }}
                  //     >
                  //       <Icon name="delete" color="danger" size={20} />
                  //     </div>
                  //   </div>
                  //   <Image
                  //     className="object-cover"
                  //     src={URL.createObjectURL(selectedImage)}
                  //     alt="test image"
                  //     width={160}
                  //     height={90}
                  //   />
                  // </div>
                  <div className="relative w-40 h-[90px] group my-2">
                    <div className="group-hover:bg-neutral-900/40 group-hover:flex hidden absolute top-0 left-0 bottom-0 right-0 z-10 items-center justify-center">
                      <div
                        className="cursor-pointer"
                        onClick={handleDeleteImage}>
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
                )}
              </div>
            </div>

            <div className="flex mb-10">
              <div className="flex items-center justify-end min-w-[190px] mr-12 h-8">
                <span className="text-lg text-xl text-default">
                  大学名 (略称)
                </span>
                <span className="text-danger text-xl">*</span>
                <span className="text-xl text-default">:</span>
              </div>
              <Form.Item
                className="m-0"
                name="universityNameAbb"
                rules={[
                  {
                    required: true,
                    message: "この項目は必須です",
                  },
                ]}>
                <Input
                  className="w-[400px] text-lg"
                  placeholder="大学名（略称）"
                />
              </Form.Item>
            </div>

            <div className="flex mb-10">
              <div className="flex items-center justify-end min-w-[190px] mr-12 h-8">
                <span className="text-lg text-xl text-default">大学名</span>
                <span className="text-danger text-xl">*</span>
                <span className="text-xl text-default">:</span>
              </div>
              <Form.Item
                className="m-0"
                name="universityName"
                rules={[
                  {
                    required: true,
                    message: "この項目は必須です",
                  },
                ]}>
                <Input className="w-[400px] text-lg" placeholder="大学名" />
              </Form.Item>
            </div>

            <div className="flex flex-col mb-8 flex-1">
              {items.map((item, index) => {
                return (
                  <div className="flex mb-8" key={item.id}>
                    <div className="flex  min-w-[50px] mr-12 h-8">
                      <span className="text-lg text-xl text-default">
                        年度コード:
                      </span>
                    </div>
                    <Form.Item
                      className="m-0"
                      name={`gradeCode-${item.id}`}
                      rules={[
                        {
                          required: true,
                          message: "この項目は必須です",
                        },
                      ]}>
                      <Input
                        value={item.gradeCode}
                        className="w-[150px] "
                        placeholder="年度コード"
                        onChange={(event) => {
                          const copyItems = [...items];
                          copyItems[index].gradeCode = event.target.value;
                          setItems(copyItems);
                        }}
                      />
                    </Form.Item>
                    <div className="flex">
                      <div className="flex items-center justify-end min-w-[200px] mr-12 h-8">
                        <span className="text-lg text-xl text-default">
                          入学年度{" "}
                        </span>
                        <span className="text-danger text-xl">*</span>
                        <span className="text-xl text-default">:</span>
                      </div>
                      <Form.Item
                        className="m-0"
                        name={`entranceYear-${item.id}`}
                        rules={[
                          {
                            required: true,
                            message: "この項目は必須です",
                          },
                        ]}>
                        <DatePicker
                          className="w-[150px] text-lg w-36"
                          placeholder="年"
                          picker="year"
                          value={item.entranceYear}
                          onChange={(date, dateString) => {
                            const copyItems = [...items];
                            copyItems[index].entranceYear = dateString;
                            setItems(copyItems);
                          }}
                        />
                      </Form.Item>
                      <span
                        className="cursor-pointer flex items-center h-8 ml-10"
                        onClick={() => handleDeleteItem(index)}>
                        <Icon color="danger" name="delete" size={25} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex mb-8 flex-1">
              <div className="flex items-center justify-end min-w-[200px] mr-12 h-8">
                <span
                  className="text-lg text-primary cursor-pointer"
                  onClick={handleAddItem}>
                  ＋年度を追加する
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Form.Item className="m-0">
                <Button
                  className="bg-primary hover:bg-[#40A9FF]"
                  type="primary"
                  htmlType="submit">
                  <div className="flex items-center">
                    <Icon name="plus-circle mr-1" color="white" size={16} />
                    <span className="leading-none h-4 ">作成</span>
                  </div>
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateUniversity;
