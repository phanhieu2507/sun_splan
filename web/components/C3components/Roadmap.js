import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { getAllMilestoneByUserId } from "~/utils/C3/plan";
import Icon from '../Icon';
import whitePin from '~/assets/icons/roadmap-whitepin.svg';
import defaultPin from '~/assets/icons/roadmap-defaultpin.svg';
import walking from '~/assets/icons/roadmap-walking.svg';

const iconName = {
  walking: 'walking',
  flag: 'roadmap-flag',
};

const Roadmap = ({userId, handleChange, milestone}) => {

  const [allMilestone, setAllMilestone] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [thisMonthMilestone, setThisMonthMilestone] = useState(null);

  const checkMonthAndYear = (date_of_target, now = new Date) => {
    const dateOfTarget = new Date(date_of_target);
    if ((dateOfTarget.getMonth() === now.getMonth()) && (dateOfTarget.getFullYear() === now.getFullYear())){
      return true;
    }
    return false;
  }

  useEffect(() => {
    const getAllMilestones = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMilestoneByUserId(userId)
        if (!data.length){
          //Need to consider more
        } else {
          const thisMonth = data.findIndex(element => checkMonthAndYear(element?.date_of_target));
          data.sort((a,b) => new Date(a?.date_of_target) - new Date(b?.date_of_target));
          if (thisMonth !== -1){
            thisMonth = (data[thisMonth].is_completed === 2) || (data[thisMonth].is_completed === 1) ? thisMonth + 1 : thisMonth;
            setAllMilestone(data);
            setThisMonthMilestone(thisMonth);
          } else {
            thisMonth = 0;
            setThisMonthMilestone(thisMonth);
            handleChange(data[thisMonth].id);
            setAllMilestone(data);
          }
        }
      } catch (err) {
        console.error(err);
        setThisMonthMilestone(null);
        setAllMilestone([]);
      } finally {
        setIsLoading(false);
      }
    }

    getAllMilestones();
  }, [userId, milestone, handleChange]);

  if(allMilestone && thisMonthMilestone && milestone.target){
    return (
      <div className='w-full h-auto mx-auto mt-14 bg-roadmap pt-[36.8513%] relative overflow-y-auto'>
          <div className='grid grid-flow-col min-h-[64px] gap-0 w-fit mx-auto absolute bottom-[28%] left-0 right-0'>
          {
            allMilestone.map((val, index) => {
              if(index != (allMilestone.length - 1)){
                if (index === thisMonthMilestone){
                  return (
                    <div key={index} className='flex justify-center items-end min-w-[126px]'>
                      <div className='flex justify-center flex-col'>
                        {/* <Icon
                          name={iconName.walking}
                          color="white"
                          size={50}
                          className="mb-2"
                        /> */}
                        <Image
                          alt={""}
                          src={walking}
                          width={36}
                          height={57}
                        />
                        <a
                          className='flex justify-center w-[50px] h-[40px] items-end'
                          onClick={() => {
                            handleChange(val.id)
                          }}
                        >
                          <Image
                            alt={""}
                            src={val.is_completed === 2 ? whitePin : defaultPin}
                            width={val.id === milestone.target.id ? 32 : 24}
                            height={val.id === milestone.target.id ? 44 : 32}
                          />
                        </a>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className='flex justify-center items-end min-w-[126px]'>
                      <a className='w-[50px] h-[40px] flex items-end justify-center' 
                        onClick={() => {
                          handleChange(val.id)
                        }}
                      >
                        <Image
                          alt={""}
                          src={val.is_completed === 2 ? whitePin : defaultPin}
                          width={val.id === milestone.target.id ? 32 : 24}
                          height={val.id === milestone.target.id ? 44 : 32}
                        />
                      </a>
                    </div>
                  )
                }
              }
              else {
                return (
                  <div key={index} className='flex justify-center items-end min-w-[126px]'>
                    <a
                      onClick={() => {
                        handleChange(val.id);
                      }}
                    >
                      <Icon
                        name={iconName.flag}
                        color={val.is_completed === 2 ? "white" : "default"}
                        size={val.id === milestone.target.id ? 80 : 70}
                      />
                    </a>
                </div>
                )
              }
            })
          }
          </div>
      </div>
    )
  } else if (isLoading) {
    return (
      <div className='w-full h-auto mx-auto mt-14 overflow-y-auto pt-[36.8513%] relative bg-roadmap'>
        <h2 className='text-default mx-auto w-fit mt-3 absolute left-0 right-0 top-0'>読み込み中...</h2>
      </div>
    )
  } else if (allMilestone.length === 0){
    return (
      <div className='w-full h-auto mx-auto mt-14 overflow-y-auto pt-[36.8513%] relative bg-roadmap'>
        <h2 className='text-default mx-auto w-fit mt-3 absolute left-0 right-0 top-0'>目標なし...</h2>
      </div>
    )
  }
}

export default Roadmap