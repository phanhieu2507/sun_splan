import { Input, InputNumber, Select,DatePicker,DatePickerProps } from 'antd';
import Icon from "~/components/Icon";
import React, { useState } from 'react';
const { Option,OptGroup } = Select;
const C3AddFutureGoal = () => {
  const [Show,setShow] = useState(false)
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }
return (
        <div className="w-[600px] h-[600px] px-8 flex flex-col bg-white mb-2 overflow-y-auto  ">
        <div className=" flex items-center justify-center">
            <h2 className="text-primary mb-4" >目標</h2>
        </div>
        <div className="ml-4">
        <div className="flex justify-between mb-5">
        <h3>日本語</h3><br/>
        <Icon name="delete" color="danger" size={25} />
        </div>
        <div className="flex items-center mb-5 ml-5">
            <div className="w-32 text-left mr-5 text-default">
                <h4>受験日</h4>
            </div>
            <div>
            <DatePicker className="rounded-2xl"/>
            </div>
            
        </div>
        <div className="flex items-center mb-5">
            <div className="w-32 text-left mr-5 text-default ml-5">
              <span className="text-lg">試験</span>
            </div>
        <div>
              <Select
                placeholder={<span className="w-[100px] flex justify-center">JLPT N3</span>}
                onChange={handleChange}
              >
                <Option value="JLPT N1">
                  <div className="flex justify-center text-default">
                    <span>JLPT N1</span>
                  </div>
                </Option>
                <Option value="JLPT N2">
                  <div className="flex justify-center text-default">
                    <span>JLPT N2</span>
                  </div>
                </Option>
                <Option value="JLPT N3">
                  <div className="flex justify-center text-default">
                    <span>JLPT N3</span>
                  </div>
                </Option>
                <Option value="JLPT N4">
                  <div className="flex justify-center text-default">
                    <span>JLPT N4</span>
                  </div>
                </Option>
              </Select>
            </div>
          </div>
          <div className="flex items-center mb-5">
            <div className="w-32 text-left mr-5 text-default ml-5">
                <span className="text-lg">言語知識</span>
                <span className="text-danger text-lg">*</span>
            </div>
            <div>
            <InputNumber className="w-[100px] mr-2 text-default" placeholder="60" min={0} max={60} />
            </div>
          </div>
          <div className="flex items-center mb-5">
            <div className="w-32 text-left mr-5 text-default ml-5">
                <span className="text-lg">読解</span>
                <span className="text-danger text-lg">*</span>
            </div>
            <div>
                <InputNumber className="w-[100px] mr-2 text-default" placeholder="60" min={0} max={60} />
            </div>
          </div>
          <div className="flex items-center mb-5">
            <div className="w-32 text-left mr-5 text-default ml-5">
                <span className="text-lg">聴解</span>
                <span className="text-danger text-lg">*</span>
            </div>
            <div>
                <InputNumber className="w-[100px] mr-2 text-default" placeholder="60" min={0} max={60} />
            </div>
          </div>
          </div>
          <div className="ml-4 justify-self-start">
            <span className="text-xl">IT知識・技術</span>
            <span className="text-danger text-xl">*</span><br/>
            <div className="flex items-center justify-between mt-3 mb-5 ml-5">
            <Input className="w-[500px] mr-5 text-default"></Input>
            <Icon name="delete" color="danger" size={25} />
              
        </div>
          </div>
          <div className="ml-4 justify-self-start">
            <span className="text-xl">その他</span>
            <span className="text-danger text-xl">*</span><br/>
            <div className="flex items-center justify-between mt-3 mb-5 ml-5">
                <Input className="w-[500px] mr-5 text-default"></Input>
                <Icon name="delete" color="danger" size={25} />
            </div>
             <div className="flex items-center justify-between mt-3 mb-5 ml-5">
                <Input className="w-[500px] mr-5 text-default"></Input>
                <Icon name="delete" color="danger" size={25} /> 
            </div>
            
          </div>
          
        </div>
        
    );
};
export default C3AddFutureGoal;
