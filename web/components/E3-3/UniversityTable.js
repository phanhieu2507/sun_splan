import React from "react";
import { Table } from "antd";

export default function UniversityTable({ data }) {
  const column = [
    {
      title: "",
      align: "center",
      dataIndex: "id",
      key: "index",
    },
    {
      title: "年度コード",
      align: "center",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "入学年度",
      align: "center",
      dataIndex: "year",
      key: "year",
    },
  ];

  return (
    <>
      <style>
        {`  .ant-table-thead .ant-table-cell {
                    background-color: white;
                    font-size: large;
                    font-weight: bold;
                    color: #094067;
                }
                .ant-table {
                    border-top: 1px solid #094067 !important;
                    border-left: 1px solid #094067 !important;
                    font-weight: bold;
                    color: #094067;
                }
                .ant-table .ant-table-cell {
                    border-left-color: #094067 !important;
                    border-right-color: #094067 !important;
                    border-bottom-color: #094067 !important;
                    border-top-color: #094067 !important;
                    padding: 20px;
                  }
                `}
      </style>
      <div className="text-default">
        <Table
          columns={column}
          dataSource={data}
          bordered="true"
          className="mt-8"
          size="large"
          pagination={false}
        />
      </div>
    </>
  );
}
