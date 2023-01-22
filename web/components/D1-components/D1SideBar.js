import { Form, Input, Popover, Select } from "antd";
import Button from "../Button";
import ky from "ky";
import { useEffect, useState, useRef } from "react";
import Icon from "~/components/Icon";
import { getAllCategories } from "~/utils/category";
import { router } from "next/router";

const { Option } = Select;

export default function D1SideBar() {
  const [docsList, setDocsList] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    category_id: "",
  });
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const filteringTimeout = useRef(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await getAllCategories();

      if (res.success) {
        setCategories(res.data);
      } else {
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const getDocBySearch = async () => {
      try {
        const res = await ky
          .get(
            `/api/document/get-by-search?
							${search.name && `name=${search.name}`}&
							${search.category_id && `category_id=${search.category_id}`}
						`
          )
          .json();
        if (res.success) {
          setDocsList(res.data.data);
        }
      } catch (error) {
      }
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      getDocBySearch();
    }, 500);
  }, [search]);

  const handleFilter = async (values) => {
    setSearch({ ...search, category_id: values.category });
  };
  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  const handleCancel = () => {
    handleVisibleChange();
  };

  const handleClickDoc = (id) => {
    return router.push(`/documents/${id}`);
  };

  return (
    <div className="w-[224px] min-h-screen bg-white shadow-md py-4">
      <div className="flex items-center px-4">
        <Input
          placeholder="Search"
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <Popover
          content={
            <Form
              name="basic"
              form={form}
              initialValues={{
                category: "",
              }}
              onFinish={handleFilter}
              autoComplete="off"
            >
              <div className="pt-4">
                <div className="flex items-center mb-5">
                  <span className="text-default pr-5 w-20 text-right">
                    カテゴリ
                  </span>
                  <Form.Item className="mb-0" name="category">
                    <Select
                      className="text-default"
                      style={{
                        width: 148,
                      }}
                    >
                      <Option className="text-default" value="">
                        ALL
                      </Option>
                      {categories?.map((category) => {
                        return (
                          <Option
                            key={category.id}
                            value={category.id}
                            className="text-default"
                          >
                            {category.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className="justify-end flex gap-x-4">
                  <Button
                    className="text-default mr-4"
                    onClick={() => handleCancel()}
                  >
                    キャンセル
                  </Button>
                  <Button
                    htmlType="submit"
                    type="fill"
                    onClick={() => handleVisibleChange(false)}
                  >
                    検索
                  </Button>
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
          <div className="flex justify-center items-center ml-4">
            <Icon name="filter cursor-pointer" size={32}></Icon>
          </div>
        </Popover>
      </div>
      <div
        className="py-4 hover:overflow-y-auto px-4 hover:pr-0"
        style={{ height: "calc(100vh - 112px)" }}
      >
        {docsList?.map((doc) => {
          return (
            <div
              key={doc?.id}
              className="py-1 hover:cursor-pointer"
              onClick={() => handleClickDoc(doc?.id)}
            >
              <div className="text-[16px] font-bold">{doc?.doc_name}</div>
              <div className="text-[12px]">{doc?.category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
