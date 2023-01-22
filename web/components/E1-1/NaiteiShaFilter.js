import { Button, DatePicker, Form, Select } from "antd";
import ky from "ky";
import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { UserListContext } from "~/pages/setting/user/[userType]";

const { Option } = Select;

const NaiteiShaFilter = ({ handleVisibleChange }) => {
  const {
    setUniversityId,
    setCompanyId,
    setGradeCode,
    setGraduationDate,
    setReceiveNaiteiDate,
  } = useContext(UserListContext);
  const [universities, setUniversities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [form] = Form.useForm();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleSelectUniversity = (value) => {
    setSelectedUniversity(value);
  };

  const handleCancel = () => {
    handleVisibleChange(false);
    form.resetFields();
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const onFinish = (values) => {
    setUniversityId(values.university);
    setCompanyId(values.company);
    setGradeCode(values.gradeCode);
    if (values.graduationDate) {
      setGraduationDate(moment(values.graduationDate._d).format("YYYY-MM-DD"));
    }
    if (values.receiveNaiteiDate) {
      setReceiveNaiteiDate(
        moment(values.receiveNaiteiDate._d).format("YYYY-MM-DD")
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ky.get("/api/companies").json();
        if (res.success) {
          setCompanies(res.data);
        }
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
          company: "",
          gradeCode: "",
        }}
      >
        <div className="flex gap-5">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-default mr-5">大学</span>
              <Form.Item className="mb-0" name="university">
                <Select
                  className="text-default"
                  style={{
                    width: 200,
                  }}
                  onChange={handleSelectUniversity}
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
            {selectedUniversity && (
              <div className="flex items-center mb-4">
                <span className="text-default mr-5">学年</span>
                <Form.Item className="mb-0" name="gradeCode">
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
                    {universities
                      .find(
                        (university) => university.id === selectedUniversity
                      )
                      .gradeCodes.map((gradeCode) => (
                        <Option
                          className="text-default"
                          value={gradeCode.code}
                          key={gradeCode.id}
                        >
                          {gradeCode.code}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className="flex items-center mb-4">
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
          </div>
          <div>
            <div className="flex items-center mb-4">
              <span className="text-default mr-5">内定取得日</span>
              <Form.Item className="mb-0" name="receiveNaiteiDate">
                <DatePicker
                  className="w-[200px]"
                  placeholder="年月日選択"
                  onChange={onChange}
                />
              </Form.Item>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-default mr-5">卒業予定日</span>
              <Form.Item className="mb-0" name="graduationDate">
                <DatePicker
                  className="w-[200px]"
                  placeholder="年月日選択"
                  onChange={onChange}
                />
              </Form.Item>
            </div>
          </div>
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

export default NaiteiShaFilter;
