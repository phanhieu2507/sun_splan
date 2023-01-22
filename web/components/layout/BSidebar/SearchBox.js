import { Button, Form, Input, Popover, Select } from "antd";
import ky from "ky";
import { useEffect, useState, useRef } from "react";
import Icon from "~/components/Icon";

const { Option } = Select;

const SearchBox = ({ setName, setGraduationYear, setCompanyId }) => {
  const [visible, setVisible] = useState(false);
  const [companies, setCompanies] = useState([]);
  const years = useRef([]);
  const [form] = Form.useForm();

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleSearch = (values) => {
    setGraduationYear(values.graduationYear);
    setCompanyId(values.companyId);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setGraduationYear("");
    setCompanyId("");
  };

  useEffect(() => {
    for (var i = 2015; i <= 2030; i++) {
      years.current.push(i);
    }
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
      <div className="">
        <div className="container rounded-2xl">
          <div className="grid justify-items-center">
            <div className="flex items-center">
              <Input
                className="my-4 mr-4
                border-[1px]  border-input-default rounded-[2px]
                focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                "
                placeholder="検索"
                onChange={(event) => setName(event.target.value)}
              />
              <Popover
                content={
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
                      companyId: "",
                      graduationYear: "",
                    }}
                    onFinish={handleSearch}
                    autoComplete="off"
                  >
                    <div className="pt-4">
                      <div className="flex items-center mb-5">
                        <span className="text-default mr-5 w-14">卒業年度</span>
                        <Form.Item className="mb-0" name="graduationYear">
                          <Select
                            className="text-default"
                            style={{
                              width: 80,
                            }}
                          >
                            <Option className="text-default" value="">
                              All
                            </Option>
                            {years.current &&
                              years.current.length > 0 &&
                              years.current.map((year) => (
                                <Option
                                  key={year}
                                  className="text-default"
                                  value={year}
                                >
                                  {year}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="flex items-center mb-5">
                        <span className="text-default mr-5 w-14">企業名</span>
                        <Form.Item className="mb-0" name="companyId">
                          <Select
                            className="text-default"
                            style={{
                              width: 160,
                            }}
                          >
                            <Option className="text-default" value="">
                              All
                            </Option>
                            {companies &&
                              companies.length > 0 &&
                              companies.map((company) => (
                                <Option
                                  key={company.id}
                                  className="text-default"
                                  value={company.id}
                                >
                                  {company.company_name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="justify-end flex">
                        <Button
                          className="text-default mr-4"
                          onClick={() => handleCancel()}
                        >
                          キャンセル
                        </Button>
                        <Form.Item className="m-0">
                          <Button
                            htmlType="submit"
                            type="primary"
                            onClick={() => handleVisibleChange(false)}
                          >
                            検索
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                }
                title={<h4>検索オプション</h4>}
                trigger="click"
                visible={visible}
                placement="bottomRight"
                onVisibleChange={handleVisibleChange}
              >
                <div className="flex justify-center items-center">
                  <Icon name="filter cursor-pointer" size={32}></Icon>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
