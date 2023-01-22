import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Icon from '/components/Icon';
import PropTypes from 'prop-types';
import moment from 'moment';

const totalScore = (array) => array.reduce((previousValue, currentValue) => previousValue + currentValue.result, 0);
const totalMaxScore = (array) => array.reduce((previousValue, currentValue) => previousValue + currentValue.max_score, 0);

const C3Achievement = ({target_details, targetId}) => {

  const [targetDetailsCategories, setTargetDetailsCategories] = useState([]);

  useEffect(() => {
    const parseData = () => {
      try {
        const newObject = target_details.reduce((r,a) => {
          r[a.category_name] = [...r[a.category_name] || [], a];
          return r;
        }, {});
        setTargetDetailsCategories(newObject);
      } catch (err) {
        console.log(err);
        setTargetDetailsCategories([]);
      }
    }
    parseData();
  }, [target_details]);

  if (Object.keys(targetDetailsCategories).length){
    return (
      <div className="w-full px-8 flex flex-col items-center py-4 bg-white mb-2">
        <div className="flex mb-4 text-primary justify-end w-full">
          <Link href={`/naiteishaplan/edit-achievement/` + targetId } className="flex">
              <div className="cursor-pointer flex">
                <Icon name="pencil-squared" color="primary" size={20} />
              </div>
          </Link>
        </div>
        <div className="flex w-full flex-col gap-3 mt-2">
          { Object.keys(targetDetailsCategories).map((key) => {
            if (targetDetailsCategories[key][0].type === 0){
              return (
                <div key={key} className="flex w-full self-start mb-5">
                  <div>
                    <h3 className="mb-1">{key}</h3>
                    { targetDetailsCategories[key].map(element => (
                      <div key={ element?.id } className="ml-7 text-[#8E8E8E] text-xl mb-5">
                        <span>受験日：{ moment(element?.test_content?.date_of_contest ).format('YYYY年MM月DD日') }</span><br/>
                        <span>試験　：{ element?.test_content?.contest_name }</span><br/>
                        <span>総合得点({ totalMaxScore(element?.test_content?.score_eachs) })：{ totalScore(element?.test_content?.score_eachs) } (合格点: { element?.test_content?.pass_score })</span><br/>
                        <div className="ml-3">
                          <div>
                          { element?.test_content.score_eachs.map((part) => {
                            return (
                              <div key={part?.part_name}>
                                <span>・{ part?.part_name }({ part?.max_score })：{ part?.result }</span><br/>
                              </div>
                            );
                          })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )       
            } else {
              return (
                <div className="flex w-full self-start mb-10">
                  <div>
                    <h3 className="mb-1">{key}</h3>
                    { targetDetailsCategories[key].map(element => (
                      <div key={element?.id} className="ml-7 text-[#8E8E8E] text-xl mb-4">
                        <span>{element.free_content.result}</span>
                      </div>
                    ))}
                  </div>
                </div>        
              )
            }
          })}
        </div>
      </div>
    );
  } 
  else if (target_details.length === 0){
    return (
      <div className="w-full px-8 flex flex-col items-center py-4 bg-white mb-2">
        <div className='text-xl'>...</div>
      </div>
    );
  }
};

C3Achievement.propTypes = {
  target_details: PropTypes.array,
  targetId: PropTypes.number,
};


export default C3Achievement;