/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { Input, Select, Form, Row, Col, message, Upload, Image } from "antd";
import Button from "../Button";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "~/components/layout/Navbar";
import TextArea from "antd/lib/input/TextArea";
import BackButton from "../BackButton";
import { getAllCategories } from "~/utils/category";
import { getAllUnits } from "~/utils/unit";
import { createDoc, editDoc } from "~/utils/document";
import { getDocById } from "~/utils/document";
import { showNotification } from "~/components/Notification";
import Icon from "../Icon";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import PageHeader from "../PageHeader";

const D1Form = ({ editId }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [doc, setDoc] = useState({});
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [returnAble, setReturnAble] = useState(true);
  const router = useRouter();
  const [form] = Form.useForm();

  if (editId) {
    useEffect(() => {
      const getDoc = async () => {
        let res = await getDocById(editId);
        let images = res.data.images;
        let temptThumbnail = [];
        let temptImages = [];

        images.forEach((element) => {
          element.is_thumbnail == 1
            ? temptThumbnail.push({
                uid: element.id,
                name: element.img_link.substring(
                  element.img_link.lastIndexOf("/") + 1,
                  element.img_link.length
                ),
                url: element.img_link,
                state: "done",
                inDb: true,
              })
            : temptImages.push({
                uid: element.id,
                name: element.img_link.substring(
                  element.img_link.lastIndexOf("/") + 1,
                  element.img_link.length
                ),
                url: element.img_link,
                state: "done",
                inDb: true,
              });
        });
        form.setFieldsValue({
          doc_name: res.data.doc_name,
          limit: res.data.limit,
          doc_content: res.data.doc_content,
          url: res.data.url,
          unit_id: res.data.unit_id,
          category_id: res.data.category_id,
          thumbnail: temptThumbnail,
          images: temptImages,
        });
        setFileList(temptImages);
        setThumbnailURL(temptThumbnail);
        setDoc(res.data);
      };
      getDoc();
    }, [editId, form]);
  }
  const { Option } = Select;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedirect = () => {
    if (returnAble) {
      router.push("/documents");
    } else {
      Modal.confirm({
        title: (
          <div className="text-default font-bold text-base">
            {" "}
            変更内容が保存されません{" "}
          </div>
        ),
        icon: <ExclamationCircleOutlined />,
        content: <div className="">キャンセルしてもいいですか？</div>,
        okText: "はい",
        cancelText: "いいえ",
        onOk() {
          router.push("/documents");
        },
        onCancel() {
          console.log("cancel");
        },
        centered: true,
      });
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      router.push("/login");
    } else {
      setUserInfo(currentUser);
    }
  }, [router]);

  useEffect(() => {
    const getCategories = async () => {
      let tempt = await getAllCategories();
      setCategories(tempt.data);
    };
    const getUnits = async () => {
      let tempt = await getAllUnits();
      setUnits(tempt.data);
    };

    getUnits();
    getCategories();
  }, []);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const uploadImagesButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleCancel = () => setPreviewVisible(false);

  const handleRemove = (file) => {
    if (typeof file.uid === "number")
      setDeletedFiles((prev) => [...prev, file]);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleChangeThumbnail = ({ fileList: newFileList }) => {
    newFileList = newFileList.slice(-1);
    setThumbnailURL(newFileList);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    return isJpgOrPng;
  };

  const onFinish = () => {};

  const handleUpload = async () => {
    let data = new FormData();
    let tempt = form.getFieldsValue();
    if (!editId) {
      Object.keys(tempt).forEach((element) => {
        if (element !== "images" && element !== "thumbnail") {
          data.append(element, form.getFieldValue(element));
        }
      });
      data.append("user_id", userInfo.id);
      fileList.forEach((file) => {
        data.append("images[]", file.originFileObj);
      });
      thumbnailURL.forEach((file) => {
        data.append("thumbnail[]", file.originFileObj);
      });
      // const data = fileList.map(file => file.originFileObj)
      const res = await createDoc(data);
      if (res.success) {
        showNotification({
          type: "success",
          title: "教材が正常に作成されました",
        });
        form.resetFields();
        setFileList([]);
        setThumbnailURL([]);
        setReturnAble(true);
      } else {
        showNotification({ type: "error", title: "教材作成が失敗" });
      }
    } else {
      Object.keys(tempt).forEach((element) => {
        if (element !== "images" && element !== "thumbnail") {
          data.append(element, form.getFieldValue(element));
        }
      });
      data.append("id", editId);
      fileList.forEach((file) => {
        if (typeof file.uid !== "number") {
          data.append("images[]", file.originFileObj);
        }
      });
      thumbnailURL.forEach((file) => {
        if (typeof file.uid !== "number") {
          data.append("thumbnail[]", file.originFileObj);
        }
      });
      deletedFiles.forEach((file) => {
        data.append("delete[]", JSON.stringify(file));
      });
      // const data = fileList.map(file => file.originFileObj)
      const res = await editDoc(data);
      if (res.success) {
        showNotification({ type: "success", title: "教材が編集されました" });
        return router.push(`/documents/${res.data.id}`);
      } else {
        showNotification({ type: "error", title: "教材が編集が失敗" });
      }
    }
  };

  const handleBack = () => {
    handleRedirect();
  };

  const handleCancelForm = () => {
    Modal.confirm({
      title: (
        <div className="text-default font-bold text-base">
          {" "}
          変更内容が保存されません{" "}
        </div>
      ),
      icon: <ExclamationCircleOutlined />,
      content: <div className="">キャンセルしてもいいですか？</div>,
      okText: "はい",
      cancelText: "いいえ",
      onOk() {
        router.back();
      },
      onCancel() {
        console.log("cancel");
      },
    });
  };

  return (
    <div className="content-between text-default">
      <Navbar />
      <div className="mt-8 px-[190px]">
        {editId ? (
          <PageHeader
            type="edit"
            title="教材編集"
            onBackBtnClick={handleBack}
          />
        ) : (
          <PageHeader
            type="create"
            title="教材新規登録"
            onBackBtnClick={handleBack}
          />
        )}
      </div>
      <Row justify="center text-default">
        <Col>
          <Form
            style={{ width: "60vw" }}
            form={form}
            className="py-10 text-default"
            onFinish={onFinish}
            onFieldsChange={() => setReturnAble(false)}
          >
            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label htmlFor="doc_name" className="text-default font-bold">
                  <span className="text-xl">教材名</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>

              <Col span={18}>
                <Form.Item
                  name="doc_name"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <Input
                    className="text-default"
                    maxLength={64}
                    placeholder="教材名"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label htmlFor="url" className="text-default font-bold">
                  <span className="text-xl">URL</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>

              <Col span={18}>
                <Form.Item
                  name="url"
                  rules={[
                    {
                      pattern: new RegExp(
                        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                      ),
                      message: "URLフォーマット違う!",
                    },
                    { required: true, message: "この項目は必須です" },
                  ]}
                >
                  <Input className="text-default" placeholder="URL" />
                </Form.Item>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label htmlFor="limit" className="text-default font-bold">
                  <span className="text-xl">最大実施内容</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="limit"
                  rules={[
                    { required: true, message: "この項目は必須です" },
                    {
                      pattern: new RegExp(/^\+?(0|[1-9]\d*)$/g),
                      message: "Khong the go so am!",
                    },
                  ]}
                >
                  <Input
                    className="text-default"
                    type={"number"}
                    min={0}
                    placeholder="最大実施内容"
                  />
                </Form.Item>
              </Col>

              <Col span={1}></Col>
              <Col span={6}>
                <Form.Item
                  name="unit_id"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <Select
                    className="text-default"
                    placeholder="単位"
                    autoFocus={true}
                    style={{
                      width: 120,
                    }}
                  >
                    {units.map((unit) => (
                      <Option
                        className="text-default"
                        key={unit.id}
                        value={unit.id}
                      >
                        {unit.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label htmlFor="doc_content" className="text-default font-bold">
                  <span className="text-xl">内容</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>

              <Col span={18}>
                <Form.Item
                  name="doc_content"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <TextArea
                    className="text-default"
                    placeholder="内容"
                    maxLength={800}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label htmlFor="category_id" className="text-default font-bold">
                  <span className="text-xl">カテゴリ</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>

              <Col span={18}>
                <Form.Item
                  name="category_id"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <Select
                    className="text-default"
                    autoFocus={true}
                    style={{
                      width: 120,
                    }}
                    placeholder="カテゴリ"
                  >
                    {categories.map((category) => (
                      <Option
                        className="text-default"
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={6} className="text-right pr-9">
                <label className="text-default font-bold">
                  <span className="text-xl">サムネイル</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>
              <Col span={18}>
                <Form.Item
                  name="thumbnail"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={thumbnailURL}
                    onChange={handleChangeThumbnail}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
                    //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    //maxCount={1}
                    accept="image/png, image/jpg, image/jpeg"
                    showUploadList={{
                      removeIcon: (
                        <Icon
                          name="delete"
                          size={16}
                          color="white"
                          className="opacity-[.85] transition duration-150 hover:opacity-100 hover:bg-danger"
                        />
                      ),
                      showPreviewIcon: false,
                    }}
                  >
                    {thumbnailURL.length > 0 ? null : uploadImagesButton}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6} className="text-right pr-9">
                <label htmlFor="doc_name" className="text-default font-bold">
                  <span className="text-xl">画像</span>
                  <span className="text-red-500 text-xl px-1">*</span>
                  <span className="text-xl">:</span>
                </label>
              </Col>
              <Col span={18}>
                <Form.Item
                  name="images"
                  rules={[{ required: true, message: "この項目は必須です" }]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
                    showUploadList={{
                      removeIcon: (
                        <Icon
                          name="delete"
                          size={16}
                          color="white"
                          className="opacity-[.85] transition duration-150 hover:bg-danger"
                        />
                      ),
                      showPreviewIcon: false,
                    }}
                    //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept="image/png, image/jpg, image/jpeg"
                  >
                    {fileList.length >= 6 ? null : uploadImagesButton}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              {editId && (
                <div className="px-3">
                  <Button onClick={handleCancelForm}>キャンセル</Button>
                </div>
              )}
              <Button type="fill" onClick={handleUpload}>
                {editId ? "保存" : "作成"}
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default D1Form;
