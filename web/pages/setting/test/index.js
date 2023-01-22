import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SettingLayout from "~/components/layout/SettingLayout";
import { Pagination, Input, Button } from "antd";
import TestCard from "~/components/E5-1/TestCard";
import Icon from "~/components/Icon";
import ky from "~/api/ky";
import PageHeader from "~/components/PageHeader";

function TestList() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteringTimeout = useRef(null);
  const itemNumber = 6;

  const deletedTest = (id) => {
    setTests((tests) => tests.filter((test) => test.id !== id));
    if (tests.length == 1) setCurrentPage(1);
    else if (tests.length - 1 <= itemNumber * (currentPage - 1))
      setCurrentPage(currentPage - 1);
    testData = tests.filter((item) => {
      return item.contest_name.toLowerCase().includes(query);
    });
  };

  const testData = tests.filter((item) => {
    return item.contest_name.toLowerCase().includes(query);
  });

  useEffect(() => {
    (async () => {
      const res = await ky.get(`/api/test`).json();
      console.log('data', res.data);
      setTests(
        res.data.sort((a, b) => {
          return b.id - a.id;
        })
      );
    })();
  }, []);
  return (
    <SettingLayout>
      <PageHeader 
        type="list"
        title="試験一覧"
        onAddBtnClick={() => router.push("/setting/test/create")}
      />
      <div className="flex justify-center pt-10">
        <div className="w-full">
          <div className="flex justify-center pb-10">
            <div className="w-1/2 justify-center">
              <Input
                className="my-4 mr-4 h-2/3
                          border-[1px]  border-input-default rounded-[2px]
                          focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                          placeholder-disabled"
                placeholder="検索"
                onChange={(event) => {
                  filteringTimeout.current = setTimeout(() => {
                    setSearchText(event.target.value);
                  }, 500);
                  if (event.target.value !== "") {
                    setQuery(event.target.value.toLowerCase());
                  }
                }}
              />
            </div>
          </div>
          {searchText != "" && (
            <>
              <div className="container justify-center">
                <div className="grid grid-cols-3 gap-24 px-24 pb-8 mt-12">
                  {testData.length > 0 &&
                    testData
                      .slice(
                        (currentPage - 1) * itemNumber,
                        currentPage * itemNumber
                      )
                      .map((test) => {
                        return (
                          <TestCard
                            key={test.id}
                            name={test.contest_name}
                            id={test.id}
                            imageUrl={test.image ? test.image.img_link : null}
                            deletedTest={(id) => {
                              deletedTest(id);
                            }}
                          />
                        );
                      })}
                </div>
                {testData.length > itemNumber && (
                  <div className="flex justify-center">
                    <Pagination
                      defaultCurrent={1}
                      total={testData.length}
                      pageSize={itemNumber}
                      onChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {searchText == "" && (
            <>
              <div className="container justify-center">
                <div className="grid grid-cols-3 gap-24 px-24 pb-8 mt-12">
                  {tests.length > 0 &&
                    tests
                      .slice(
                        (currentPage - 1) * itemNumber,
                        currentPage * itemNumber
                      )
                      .map((test) => {
                        return (
                          <TestCard
                            key={test.id}
                            name={test.contest_name}
                            id={test.id}
                            imageUrl={test.image ? test.image.img_link : null}
                            deletedTest={(id) => {
                              deletedTest(id);
                            }}
                          />
                        );
                      })}
                </div>
                {tests.length > itemNumber && (
                  <div className="flex justify-center">
                    <Pagination
                      defaultCurrent={1}
                      total={tests.length}
                      pageSize={itemNumber}
                      onChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </SettingLayout>
  );
}

export default TestList;
