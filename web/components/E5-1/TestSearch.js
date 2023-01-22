import { Input, Popover } from "antd";
import React from "react";
import { useState } from "react";

const TestSearch = ({ role }) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  return (
        <div className="container w-1/2 justify-center">
            <Input
              className="   h-3/4 my-4 mr-4
                            border-[1px]  border-input-default rounded-[2px]
                            focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                            placeholder-primary"
              placeholder="検索"
            />
        </div>
  );
};

export default TestSearch;
