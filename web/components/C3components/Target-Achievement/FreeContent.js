import { Input } from 'antd'
import React from 'react'
import Icon from '~/components/Icon'
import { handleOnDelete } from './DeleteModal'

const msg = {
  c3202: "255文字以下で入力してください。",
  c3213: "この項目は必須です",
}

function FreeContent({ edit=false, canDelete=false, state, dispatch, targetDetails, achievement=false }) {
  
  if(edit && targetDetails){
    return (
      <div className='justify-self-start mb-5'>
        { !targetDetails.every((targetDetails) => targetDetails?.delete) &&
          <h3>{ targetDetails[0]?.category?.name }{edit && <span className='text-danger'> *</span>}</h3>
        }
        <div className='flex flex-col mt-3 mb-5 ml-10'>
          {
            targetDetails.map((targetDetail) => !targetDetail?.delete ? (
              <div key={targetDetail?.id}>
                { canDelete && 
                  <a
                  className='float-right mr-6'
                  onClick={() => {
                    const funcOnDelete = () => {
                      dispatch({
                        type: 'deleteTargetDetail',
                        payload: targetDetail
                      });
                      dispatch({ type: 'check' })
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
                <Input
                  className='w-[410px] my-2'
                  value={achievement ? targetDetail?.free_content?.result : targetDetail?.free_content?.content}
                  status={ targetDetail?.free_content?.error ? "error" : "" }
                  onChange={({target}) => {
                    if(achievement){
                      dispatch({
                        type: 'editTargetDetail',
                        payload: {
                          ...targetDetail,
                          free_content: {
                            ...targetDetail.free_content,
                            result: target.value,
                            error: target.value.length === 0 ? msg.c3213 : (target.value.length >= 0 && target.value.length <= 255) ? null : msg.c3202,
                          }
                        }
                      });
                      dispatch({ type: 'check' })
                    } else {
                      dispatch({
                        type: 'editTargetDetail',
                        payload: {
                          ...targetDetail,
                          free_content: {
                            ...targetDetail.free_content,
                            content: target.value,
                            error: target.value.length === 0 ? msg.c3213 : (target.value.length >= 0 && target.value.length <= 255) ? null : msg.c3202,
                          }
                        }
                      })
                      dispatch({ type: 'check' });
                    }
                  }}
                />
                <div><span className='text-danger'>{ targetDetail?.free_content?.error }</span></div>
              </div>
            ) : null )
          }
        </div>
      </div>
    )
  } else if (edit === false && targetDetails) {
    return (
      <div className='justify-self-start mb-8'>
        { !targetDetails.every((targetDetail) => targetDetail?.delete) &&
          <h3>{ targetDetails[0]?.category?.name }</h3>
        }
        <div className='flex flex-col mt-3 mb-5 ml-10'>
            {
              targetDetails.map(targetDetail => !targetDetail?.delete ? (
                <h5
                  key={targetDetail.id}
                  className="my-2 w-[95%]"
                >
                  {achievement ? targetDetail?.free_content?.result : targetDetail?.free_content?.content}
                </h5>
              ) : null )
            }
        </div>
      </div>
    )
  }
}

export default FreeContent