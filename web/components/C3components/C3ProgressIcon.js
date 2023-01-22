import Link from "next/link";
import {Select } from 'antd';
import Icon from "~/components/Icon";
import React, { useState } from 'react';

const C3ProgressIcon = () => {
    const { Option} = Select;
    const [Opticon,useOpticon]=useState(0);
    const Change = (index)=>{
    useOpticon(index);
}
  return (
<div className=" flex flex-row items-center py-4  mb-2">
    <div className="flex flex-row">
      <span>進捗状況を更新するには、</span>
      <Link href="/" className="flex"><span className="text-primary underline underline-offset-1 cursor-pointer flex" >ここをクリックしてください</span>
      </Link>
    </div>
    <div className="flex ml-10 mr-5">
    <Select
                placeholder={<span className="w-[120px] flex justify-center">N/A</span>}
              >
                <Option value="達成済み">
                  <div className="flex justify-center text-default">
                    <span onClick={()=>Change(1)}>達成済み</span>
                  </div>
                </Option>
                <Option value="未達成" >
                  <div className="flex justify-center text-default">
                    <span onClick={()=>Change(0)}>未達成</span>
                  </div>
                </Option>
              </Select>
    </div>
    <div className="mt-5">
    <Icon name={$`{Opticon===0?"fine":"cloud-rain"}`} size={60}></Icon>
    </div>

</div>
  );
};

export default C3ProgressIcon;