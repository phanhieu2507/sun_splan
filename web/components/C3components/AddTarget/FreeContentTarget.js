import { Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import Icon from "~/components/Icon";

const FreeContentTarget = ({
  freeContentTarget,
  handleDeleteTarget,
  handleEditTarget,
}) => {
  const handleEditFreeContent = (content) => {
    const newFreeContentTarget = { ...freeContentTarget };
    newFreeContentTarget.content = content;
    handleEditTarget(newFreeContentTarget.id, newFreeContentTarget);
  };

  return (
    <div
      className="flex p-4 w-full"
      style={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex-1">
        <h3>{freeContentTarget.category}</h3>
        <Form.Item
          label={<h4 className="text-default font-medium">内容</h4>}
          name={`content${freeContentTarget.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <TextArea
            className="text-default"
            onChange={(e) => handleEditFreeContent(e.target.value)}
            placeholder="内容"
            maxLength={250}
            autoSize={{ minRows: 1, maxRows: 8 }}
          />
        </Form.Item>
      </div>
      <div className="justify-end items-center flex ">
        {" "}
        <Icon
          className="cursor-pointer"
          name="delete"
          color="danger"
          size={18}
          onClick={() => handleDeleteTarget(freeContentTarget.id)}
        />
      </div>
    </div>
  );
};

export default FreeContentTarget;
