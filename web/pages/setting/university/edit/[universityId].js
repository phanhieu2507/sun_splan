import { Button, DatePicker, Input, Upload, Form, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import client from "~/api/client";
import SettingLayout from "~/components/layout/SettingLayout";
import PageHeader from "~/components/PageHeader";
import Icon from "~/components/Icon";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
import { showNotification } from "~/components/Notification";

const UniversityDetailEdit = () => {
  const router = useRouter();
  const { universityId } = router.query;
  const [items, setItems] = useState([]);
  const [universityInfo, setUniversityInfo] = useState({
    id: universityId,
    name: "",
    abbreviation: "",
    gradeCodes: [],
    image: "https://via.placeholder.com/480x270",
  });

  const [changed, setChanged] = useState(false);
  const [image, setImage] = useState(null);
  const itemCount = useRef(0);
  const [form] = Form.useForm();

  const handleDeleteItems = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setChanged(true);
    itemCount--;
  };

  const handleAddItem = () => {
    const newItem = {
      id: moment(Date.now()),
      code: "",
      year: "",
    };
    setItems([...items, newItem]);
    setChanged(true);
    itemCount++;
  };
  const handleChangeImage = ({ file, fileList }) => {
    if (fileList.length === 0) {
      setImage(universityInfo.image);
      return;
    }
    setChanged(true);
    setImage(file.originFileObj);
  };

  const handleModalAction = (action) => {
    if (!changed) {
      router.push(`/setting/university/${universityId}`);
      return;
    }
    let content;
    if (action === "cancel") {
      content = "キャンセルですか？";
    }
    if (action === "back") {
      content = "よろしいですか。";
    }
    confirm({
      centered: true,
      title: "編集した内容が保存されていません。",
      destroyOnClose: true,
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: "はい",
      cancelText: "いいえ",
      onOk() {
        router.push(`/setting/university/${universityId}`);
      },
      onCancel() {
        return;
      },
    });
  };

  const handleEditUniversity = async (values) => {
    console.log(values);
    let newUniversityInfo = new FormData();
    newUniversityInfo.append("abbreviation", values.abbreviation);
    newUniversityInfo.append("name", values.name);
    if (items.length !== 0) {
      newUniversityInfo.append("items", JSON.stringify(items));
    }
    image ? newUniversityInfo.append("image", image) : null;

    try {
      const res = await client
        .post(`universities/edit/${universityId}`, { body: newUniversityInfo })
        .json();
      router.push(`/setting/university/${universityId}`);
      showNotification({
        type: "success",
        title: "試験が編集されました。",
      });
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get(`universities/${universityId}`).json();

      if (data === undefined) return;
      setUniversityInfo(data);
      form.setFieldsValue(data);

      if (data.gradeCodes.length > 0) {
        data.gradeCodes.map((item, index) => {
          form.setFieldsValue({
            [`itemCode-${index}`]: item.code,
            [`itemYear-${index}`]: moment(item.year),
          });
        });
        setItems(
          data.gradeCodes.map((item) => ({
            id: item.id,
            code: item.code,
            year: item.year,
          }))
        );
      }
      itemCount.current = data.gradeCodes[0];
      setImage(data.image);
    };

    fetchData();
  }, [form, universityId]);

  return (
    <SettingLayout>
      <PageHeader
        type="edit"
        title="大学編集"
        onBackBtnClick={() => handleModalAction("back")}
      />
      <div className="pt-10">
        <Form
          name="basic"
          form={form}
          onFinish={handleEditUniversity}
          onValuesChange={() => setChanged(true)}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <div className="grid grid-cols-12">
            <div className="col-span-4 text-right">
              <span className="text-xl font-bold text-default">
                サムネイル:
              </span>
            </div>
            <div className="col-span-8 px-9">
              <Upload
                accept="image/*"
                onChange={handleChangeImage}
                maxCount={1}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
            <div className="col-span-8 col-start-5 px-9 mt-1 mb-6">
              {image ? (
                <div className="mt-1 transition-all relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      typeof image === "object"
                        ? URL.createObjectURL(image)
                        : (universityInfo.image.startsWith("images/")
                            ? `/`
                            : "") + universityInfo.image
                    }
                    width={160}
                    height={90}
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                  <div
                    className="w-40 h-[90px] bg-black bg-opacity-70 flex opacity-0 
                    hover:opacity-100 transition-all justify-center items-center absolute 
                    left-0 top-0 cursor-pointer"
                    onClick={() => setImage(null)}
                  >
                    <Icon name="delete" color="danger" size={18} />
                  </div>
                </div>
              ) : (
                <div className="mt-1 transition-all relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://via.placeholder.com/480x270/?text=No+Image"
                    width={160}
                    height={90}
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="col-span-4 text-right text-xl font-bold h-8 leading-8 self-start">
              <span className=" text-default">大学名 (略称)</span>
              <span className="text-red-500 ">*</span>
              <span>:</span>
            </div>
            <div className="col-span-8 px-9 mb-3">
              <Form.Item
                name="abbreviation"
                rules={[
                  {
                    required: true,
                    message: "この項目は必須です",
                  },
                ]}
              >
                <Input
                  placeholder="大学名（略称)"
                  className="w-[400px] text-lg text-default"
                />
              </Form.Item>
            </div>
            <div className="col-span-4 text-right text-xl font-bold h-8 leading-8 self-start">
              <span className=" text-default">大学名</span>
              <span className="text-red-500 ">*</span>
              <span>:</span>
            </div>
            <div className="col-span-8 px-9 mb-3">
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "この項目は必須です",
                  },
                ]}
              >
                <Input
                  placeholder="大学名（略称)"
                  className="w-[400px] text-lg text-default"
                />
              </Form.Item>
            </div>
            {items.map((_, index) => (
              <div key={index} className="col-span-12 grid grid-cols-12 mb-3">
                <div className="col-span-6">
                  <div className="flex flex-row">
                    <div className="basis-1/2 text-xl text-right font-semibold text-default">
                      年度コード:
                    </div>
                    <div className="basis-1/2 px-9">
                      <Form.Item
                        name={`itemCode-${index}`}
                        rules={[
                          {
                            required: true,
                            message: "この項目は必須です",
                          },
                        ]}
                      >
                        <Input
                          placeholder="年度コード"
                          className="w-[150px]"
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].code = e.target.value;
                            setItems(newItems);
                            setChanged(true);
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex flex-row">
                    <div className="text-xl font-semibold text-default text-right">
                      <span>入学年度</span>
                      <span className="text-red-500">*</span>
                      <span>:</span>
                    </div>
                    <div className="pl-9 w-[240px]">
                      <Form.Item
                        name={`itemYear-${index}`}
                        rules={[
                          {
                            required: true,
                            message: "この項目は必須です",
                          },
                        ]}
                      >
                        <DatePicker
                          placeholder="年"
                          picker="year"
                          className="w-[150px]"
                          onChange={(date) => {
                            const newItems = [...items];
                            newItems[index].year = new Date(date._d)
                              .getFullYear()
                              .toString();
                            setItems(newItems);
                            setChanged(true);
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div
                      className="col-span-2 h-8 flex items-center cursor-pointer"
                      onClick={() => handleDeleteItems(index)}
                    >
                      <Icon name="delete" color="danger" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="col-span-4 text-right text-primary text-lg font-semibold cursor-pointer my-8"
              onClick={handleAddItem}
            >
              +年度を追加する
            </div>

            <div className="col-span-10 flex justify-end">
              <Form.Item>
                <div className="mr-3">
                  <Button
                    className="text-default"
                    onClick={() => handleModalAction("cancel")}
                  >
                    キャンセル　
                  </Button>
                </div>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </SettingLayout>
  );
};

export default UniversityDetailEdit;
