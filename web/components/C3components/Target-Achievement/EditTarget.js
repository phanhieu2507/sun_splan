import React, { useEffect, useState } from 'react';
import TestContent from './TestContent';
import FreeContent from './FreeContent';

class TargetDetails {
  constructor(obj){
    this.id = obj.id;
    this.target_id = obj.target_id;
    this.category = obj.category;
    this.category_id = obj.category_id;
    this.type = obj.type;
    this.test_content = (obj.type === 0) ? {
      ...obj.test_content,
      contest: obj.test_content.contest,
      pass_score: obj.test_content.contest.pass_score,
      score_eachs: obj.test_content.contest.contest_score_eachs.map((value, index, arr) => {
        for (let each of obj.test_content.score_eachs){
          if (each.part_name === value.name){
            return { ...each, max_score: value.max_score };
          }
        }
      })
    } : null;
    this.free_content = (obj.type === 1)? {
      ...obj.free_content,
      content: obj.free_content.content,
      result: obj.free_content.result
    } : null;
    if(obj?.delete) {
      this.delete = obj.delete;
    } else if (obj?.new) {
      this.new = obj.new;
    }
  }
}

const EditTargetShow = ({target, state, dispatch}) => {

  const [targetDetailsCategories, setTargetDetailsCategories] = useState();
    
  useEffect(() => {
    const parseData = () => {
      const newObject = target?.target_details.reduce((r,a) => {
        r[a.category.name] = [...r[a.category.name] || [], new TargetDetails(a)];
        return r;
      }, {});
      setTargetDetailsCategories(newObject);
    }
    parseData();
  }, [target])

  if(targetDetailsCategories){
    return (
      <div className='flex flex-row justify-center max-h-[696px] min-h-[400px] overflow-y-auto w-full mt-20'>
        <div className='flex flex-col w-full h-fit relative'>
          <div className="flex justify-center w-full sticky top-0 z-10 bg-white">
              <div className="w-full pt-8 flex justify-center">
                <h2 className="text-4xl mb-6">
                  <span className='text-primary'>
                    目標
                  </span>
                </h2>
              </div>
              </div>
          <div className='ml-10'>
          {
            Object.keys(targetDetailsCategories).map(key => {
              if (targetDetailsCategories[key][0].type === 0){
                return (
                  <TestContent 
                    key={key} 
                    targetDetails={targetDetailsCategories[key]} 
                    edit={true}
                    canDelete={true}
                    achievement={false}
                    state={state}
                    dispatch={dispatch}
                  /> )
              } else {
                return (
                  <FreeContent 
                    key={key} 
                    targetDetails={targetDetailsCategories[key]}
                    edit={true}
                    canDelete={true}
                    state={state}
                    dispatch={dispatch}
                  /> )
              }
            })
          }
          </div>
        </div>
        <div className='flex flex-col h-fit justify-center w-full border-solid border-l-[1px] border-x-0 border-y-0 relative'>
          <div className="flex justify-center w-full sticky top-0 z-10 bg-white">
            <div className="w-full pt-8 flex justify-center">
              <h2 className="text-4xl text-primary mb-6">
                <span className='text-primary'>
                  実績
                </span>
              </h2>
            </div>
          </div>
          <div className='ml-10'>
          {
            Object.keys(targetDetailsCategories).map(key => {
              if(targetDetailsCategories[key][0].type === 0){
                return (
                  <TestContent
                    key={key}
                    targetDetails={targetDetailsCategories[key]}
                    edit={false}
                    canDelete={false}
                    achievement={true}
                  /> )
              } else {
                return (
                  <FreeContent
                      key={key}
                  targetDetails={targetDetailsCategories[key]}
                  edit={false}
                  canDelete={false}
                  achievement={true}
                  /> )
              }
            })
          }
          </div>
        </div>
      </div>
    );
  } else {
        return (
            <div className='flex flex-row justify-center max-h-[600px] min-h-[400px] overflow-y-auto w-full'>
                Loading...
            </div>
        )
    }
}

export default EditTargetShow