import { DatePicker, Form, Input, InputNumber } from "antd";
import moment from "moment";
import React from "react";
import Icon from "~/components/Icon";

const JapanesesContest = ({
  japaneseContest,
  handleDeleteTarget,
  handleEditTarget,
  dateOfTarget,
}) => {
  const handleSelectExamDate = (date, dateString) => {
    const newJapaneseContest = { ...japaneseContest };
    newJapaneseContest.exam_date = dateString;
    handleEditTarget(newJapaneseContest.id, newJapaneseContest);
  };

  const handleEditScore = (partName, score) => {
    const newJapaneseContest = { ...japaneseContest };
    const index = newJapaneseContest.score_eaches.indexOf(
      newJapaneseContest.score_eaches.find(
        (score) => score.part_name === partName
      )
    );
    newJapaneseContest.score_eaches[index] = {
      part_name: partName,
      expected_score: score,
    };
    handleEditTarget(newJapaneseContest.id, newJapaneseContest);
  };

  return (
    <div
      className="flex p-4 w-full"
      style={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex-1">
        <h3>日本語</h3>
        <Form.Item
          label={<h4 className="text-default font-medium">受験日</h4>}
          name={`examDate${japaneseContest.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <DatePicker
            className="w-60"
            disabledDate={(current) => {
              return current && current < Date.parse(dateOfTarget);
            }}
            labelAlign="right"
            placeholder="受験日"
            onChange={handleSelectExamDate}
          />
        </Form.Item>
        <Form.Item
          label={<h4 className="text-default font-medium">試験</h4>}
          name={`contestName${japaneseContest.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
          initialValue={japaneseContest.contest_name}
        >
          <Input disabled className="w-60 text-default" />
        </Form.Item>
        <Form.Item
          label={<h4 className="text-default font-medium">言語知識</h4>}
          name={`goi${japaneseContest.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <InputNumber
            className="text-default"
            min={1}
            max={60}
            onChange={(value) => handleEditScore("言語知識", value)}
          />
        </Form.Item>
        <Form.Item
          label={<h4 className="text-default font-medium">読解</h4>}
          name={`dokkai${japaneseContest.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <InputNumber
            className="text-default"
            min={1}
            max={60}
            onChange={(value) => handleEditScore("読解", value)}
          />
        </Form.Item>
        <Form.Item
          label={<h4 className="text-default font-medium">聴解</h4>}
          name={`choukai${japaneseContest.id}`}
          wrapperCol={{ span: 10, offset: 1 }}
          rules={[
            {
              required: true,
              message: "この項目は必須です",
            },
          ]}
        >
          <InputNumber
            className="text-default"
            min={1}
            max={60}
            onChange={(value) => handleEditScore("聴解", value)}
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
          onClick={() => handleDeleteTarget(japaneseContest.id)}
        />
      </div>
    </div>
  );
};

export default JapanesesContest;
