import { Button, Form, Select } from "antd";
import ky from "ky";
import React, { useState, useEffect, useContext } from "react";
import { UserListContext } from "~/pages/setting/user/[userType]";

const { Option } = Select;

const KigyoutantoushaFilter = ({ handleVisibleChange }) => {
  const [companies, setCompanies] = useState([]);
  const { setCompanyId } = useContext(UserListContext);
  const [form] = Form.useForm();

  const handleCancel = () => {
    handleVisibleChange(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    setCompanyId(values.company);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ky.get("/api/companies").json();
        if (res.success) {
          setCompanies(res.data);
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
          company: "",
        }}
      >
        <div>
          <div className="flex items-center mb-5">
            <span className="text-default mr-5">企業</span>
            <Form.Item className="mb-0" name="company">
              <Select
                className="text-default"
                style={{
                  width: 200,
                }}
                onChange={handleChange}
              >
                <Option className="text-default" value="">
                  All
                </Option>
                {companies &&
                  companies.length > 0 &&
                  companies.map((company) => (
                    <Option
                      className="text-default"
                      value={company.id}
                      key={company.id}
                    >
                      {company.company_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <div className="flex justify-end">
            <Button
              className="text-default mr-4"
              onClick={() => handleCancel()}
            >
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
        </div>
      </Form>
    </div>
  );
};

export default KigyoutantoushaFilter;
