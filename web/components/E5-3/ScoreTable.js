import React from "react";
import { Table } from "antd";

export default function ScoreTable({ test }) {
  const cols = [
    {
      title: "",
      dataIndex: "id",
      key: "index",
      align: "center",
      width: "100px",
    },
    {
      title: "項目名",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "点数",
      dataIndex: "maxScore",
      key: "maxScore",
      width: "40%",
      align: "center",
      render(maxScore) {
        return <span className="font-medium">{maxScore}</span>;
      },
    },
  ];

  return (
    <>
      <div className="test-score text-default mt-8">
        {
          (test.contestScoreEachs.length > 0)
          && (
            <Table
              pagination={false}
              bordered
              size="large"
              rowKey={(record) => record.id}
              columns={cols}
              dataSource={test.contestScoreEachs}
            />
          )
        }
        <table className="w-full -translate-y-[1px]">
          <colgroup>
            <col />
            <col style={{ width: "39.95% " }} />
          </colgroup>
          <tbody className="w-full" >
            <tr>
              <td
                style={{ border: "1px solid black" }}
                className="p-5 text-center text-[18px] font-medium bg-[#FAFBFD]"
              >
                総合得点
              </td>
              <td
                className=" text-center text-[30px] leading-[1.5715] p-5 font-medium bg-[#FAFBFD]"
                style={{ border: "1px solid black" }}
              >
                {test.totalScore}
              </td>
            </tr>
            <tr>
              <td
                style={{ border: "1px solid black" }}
                className="p-5 text-center text-[18px] text-primary font-medium bg-[#FAFBFD]"
              >
                合格点{" "}
              </td>
              <td
                className="text-center text-[30px] leading-[1.5715] p-5 text-primary font-medium bg-[#FAFBFD]"
                style={{ border: "1px solid black" }}
              >
                {test.passScore}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
