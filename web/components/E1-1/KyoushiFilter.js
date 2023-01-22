import { Button, Form, Select } from "antd";
import { useState, useEffect, useContext } from "react";
import ky from "ky";
import { UserListContext } from "~/pages/setting/user/[userType]";

const { Option } = Select;

const KyoushiFilter = ({ handleVisibleChange }) => {
  const [universities, setUniversities] = useState([]);
  const { setUniversityId } = useContext(UserListContext);
  const [form] = Form.useForm();

  const handleCancel = () => {
    handleVisibleChange(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    setUniversityId(values.university);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await ky.get("/api/universities").json();
        if (res1.success) {
          setUniversities(res1.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Form
        name="basic"
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        initialValues={{
          university: "",
        }}
      >
        <div className="flex items-center mb-5">
          <span className="text-default mr-5">大学</span>
          <Form.Item className="mb-0" name="university">
            <Select
              className="text-default"
              style={{
                width: 200,
              }}
            >
              <Option className="text-default" value="">
                All
              </Option>
              {universities &&
                universities.length > 0 &&
                universities.map((university) => (
                  <Option
                    className="text-default"
                    value={university.id}
                    key={university.id}
                  >
                    {university.abbreviation}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex justify-end">
          <Button className="text-default mr-4" onClick={() => handleCancel()}>
            リセット
          </Button>
          <Form.Item className="mb-0 w-fit">
            <Button
              type="primary"
              onClick={() => handleVisibleChange(false)}
              htmlType="submit"
            >
              検索
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default KyoushiFilter;
