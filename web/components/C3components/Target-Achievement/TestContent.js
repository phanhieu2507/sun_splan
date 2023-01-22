import { DatePicker, InputNumber, Input } from 'antd'
import moment from 'moment'
import React from 'react'
import Icon from '~/components/Icon'
import { handleOnDelete } from './DeleteModal'

const msg = {
  c3203: "設定された最大点数の範囲で数字だけ入力してください",
  c3213: "この項目は必須です",
}

function TestContent({ edit=false, canDelete=false, state, dispatch, targetDetails, achievement=false}) {

  if (edit && targetDetails){
    return (
      <div className='mb-10'>
        { !targetDetails.every((targetDetail) => targetDetail?.delete) &&
          <div className='flex justify-between mb-4'>
            <h3>{ targetDetails[0]?.category?.name }</h3><br/>
          </div>
        }
        { targetDetails.map((targetDetail) => !targetDetail?.delete ? (
          <div key={targetDetail?.id} className='mb-5'>
          { canDelete &&
            <a
              className='float-right mr-6'
              onClick={() => {
                const funcOnDelete = () => {
                  dispatch({ type: 'deleteTargetDetail', payload: targetDetail });
                  dispatch({ type: 'check' });
                }
                handleOnDelete(funcOnDelete);
              }}
            >
              <Icon
                name="delete"
                color="disable"
                size={30}
                className="cursor-pointer h-max hover:bg-danger"
              />
            </a>
          }
          <div className='flex items-center ml-20 h-12'>
            <div className='w-44 text-left my-auto text-default text-xl flex-shrink-0'>
              <span>受験日</span>
            </div>
            <div className='my-auto flex-shrink-0'>
              <DatePicker
                className='rounded-2xl w-[171px] h-fit'
                disabled={achievement}
                disabledDate={(current) => {
                  return (current && current < moment().subtract(1, "days"))
                }}
                value={ moment(targetDetail?.test_content?.date_of_contest) }
                onChange={(e) => {
                  const newValue = moment(e).format('YYYY-MM-DD');
                  dispatch({
                    type: "editTargetDetail",
                    payload: {
                      ...targetDetail,
                      test_content: {
                        ...targetDetail.test_content,
                        date_of_contest: newValue
                      } 
                    } 
                  });
                }}
              />
            </div>
          </div>
            <div className="flex items-center ml-20 min-h-[48px]">
              <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                <span>試験</span>
              </div>
              <div className='my-auto flex-shrink-0'>
                <Input
                  className='w-[98px] h-fit'
                  disabled={achievement}
                  value={targetDetail?.test_content?.contest?.contest_name}
                  onChange={({target}) => {}}
                />
              </div>
            </div>
            {
              targetDetail?.test_content?.score_eachs.map((part) => (
                <div key={part?.id} className="min-h-[48px] flex justify-center flex-col">
                  <div className="flex items-center ml-20">
                    <div className="w-44 text-left text-default text-xl flex-shrink-0">
                      <span>{part?.part_name}</span>
                      <span className="text-danger"> *</span>
                    </div>
                    <div className='flex-shrink-0'>
                      <InputNumber
                        min={0}
                        className='w-[98px] h-fit'
                        value={achievement ? part?.result : part?.expected_score}
                        status={ part?.error ? "error" : "" } 
                        onChange={(value) => {
                          if(achievement){
                            dispatch({
                              type: 'editTargetDetail',
                              payload: {
                                ...targetDetail,
                                test_content: {
                                  ...targetDetail.test_content,
                                  score_eachs: targetDetail.test_content.score_eachs.map(
                                    (val) => val.id === part.id ?
                                    { 
                                      ...val,
                                      result: value,
                                      error: value === null ? msg.c3213 : (value >= 0 && value <= part?.max_score) ? null : msg.c3203,
                                    } : val
                                  )
                                }
                              },
                            })
                              dispatch({ type: 'check' });
                          } else {
                            dispatch({
                              type: 'editTargetDetail',
                              payload: {
                                ...targetDetail,
                                test_content: {
                                  ...targetDetail.test_content,
                                  score_eachs: targetDetail.test_content.score_eachs.map(
                                    (val) => val.id === part.id ?
                                    { 
                                      ...val,
                                      expected_score: value,
                                      error: value === null ? msg.c3213 : (value >= 0 && value <= part?.max_score) ? null : msg.c3203,
                                    } : val
                                  )
                                }
                              }
                            })
                            dispatch({ type: 'check' })
                          }
                        }}
                      />
                    </div>
                  </div>
                  { part?.error && 
                    <div className='ml-20'>
                      <span className='text-danger'>{ part?.error }</span>
                    </div>
                  }
                </div>
                )
              )
            }
          </div>) : null )
        }
      </div>
    )
  } else if (edit === false && targetDetails) {
    return (
      <div className='mb-10'>
        { !targetDetails.every((targetDetails) => targetDetails?.delete) &&
          <div className='flex justify-between mb-4'>
            <h3>{ targetDetails[0]?.category?.name }</h3><br/>
          </div>
        }
        
        { targetDetails.map(targetDetail => !targetDetail?.delete ? (
          <div key={targetDetail.id} className='mb-5'>
            <div className='flex items-center ml-20 h-12'>
              <div className='w-48 text-left my-auto text-default text-xl flex-shrink-0'>
                <span>受験日</span>
              </div>
              <div className='my-auto flex-shrink-0'>
                <span className='text-sm'>{ moment(targetDetail?.test_content?.date_of_contest).format('YYYY/MM/DD') }</span>
              </div>
            </div>
            <div className="flex items-center ml-20 h-12">
              <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                <span>試験</span>
              </div>
              <div className='my-auto flex-shrink-0'>
                <span className='text-sm'>{targetDetail?.test_content?.contest?.contest_name}</span>
              </div>
            </div>
            { targetDetail?.test_content?.score_eachs.map((part) => (
                <div key={part.id} className="flex items-center ml-20 h-12">
                  <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                    <span>{part.part_name}</span>
                  </div>
                  <div className='my-auto flex-shrink-0'>
                    <span className='text-sm'>{achievement ? part.result : part.expected_score}</span>
                  </div>
                </div>
              ))
            }
          </div>
        ) : null )
        }
      </div>
    )
  } else {
      
  }
}

export default TestContent