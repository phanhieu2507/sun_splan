import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, DatePicker } from 'antd';
import moment from 'moment';

import { getMilestoneById } from '~/utils/C3/plan';

const msg = {
    c3202: "255文字以下で入力してください。",
    c3203: "設定された最大点数の範囲で数字だけ入力してください",
}

class parseTargetDetails {
    constructor(obj){
        this.id = obj.id;
        this.target_id = obj.target_id;
        this.category = obj.category;
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
    }
}

const Achievement = ({edit=false, targetId, handleChange, handleCanSubmit, milestone}) => {

    const [targetDetails, setTargetDetails] = useState(null);

    useEffect(() => {
        const initTargetDetails = async () => {
            const {target} = await getMilestoneById(targetId);
            const {target_details} = target;
            const targetDetails = target_details.map((val) => new parseTargetDetails(val));
            setTargetDetails(targetDetails);
        }
        if(edit){
            initTargetDetails();
        }
    }, [targetId, edit]);

    const validate = (key, value, max_score ,error) => {
        if (error.type === 0){
            return {
                ...error,
                test_content: {
                    ...error.test_content,
                    score_eachs: error.test_content.score_eachs.map((val, idx) => idx === key ? {
                        ...val,
                        result: value.length === 0 ? null : parseInt(value),
                        error: (value >= 0 && value <= max_score && value.length > 0) ? null : msg.c3203,
                    } : val)
                }
            }
        } else if(error.type === 1){
            return {
                ...error,
                free_content: {
                    ...error.free_content,
                    result: value,
                    error: (value.length > 0 && value.length <= 255) ? null : msg.c3202,
                }
            }
        }
    }

    const checkNewState = (state, key ,value, max_score) => {        
        if (state.type === 0){
            return state.test_content.score_eachs.every((obj, i) => {
                if (i === key){
                    const tempScore = parseInt(value);
                    return tempScore && (tempScore >= 0 && tempScore <= max_score) && value.length
                } else {
                    return !obj.error;
                }
            })
        } else {
            return (value.length > 0 && value.length <= 255) ? true : false;
        }
    }

    const checkOldState = (state) => {        
        if (state.type === 0){
            return (state.test_content.score_eachs.every((obj) => !obj.error))
        }
        else return !state.free_content.error
    }
    
    if (edit === true){
        if (targetDetails){
            return (
                <div className='w-full h-[800px] flex flex-col bg-white pt-8'>
                    <div className="flex items-center justify-center">
                        <h2 className="text-primary mb-6 text-4xl" >実績</h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] ml-10">
                        { targetDetails.map((element, index, array) => {
                            if (element?.type === 0 ){
                                return (
                                    <div className="mb-10">
                                        <div className="flex justify-between mb-4">
                                            <h3>{element.category.name}</h3><br/>
                                        </div>
            
                                        <div className="flex items-center ml-20 h-12">
                                            <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                                                <span>受験日</span>
                                            </div>
                                            <div className='my-auto flex-shrink-0'>
                                                <DatePicker className='rounded-2xl w-[171px] h-fit' disabled={true} value={moment(element.test_content.date_of_contest)}></DatePicker>
                                            </div>
                                        </div>
            
                                        <div className="flex items-center ml-20 h-12">
                                            <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                                                <span>試験</span>
                                            </div>
                                            <div className='my-auto flex-shrink-0'>
                                                <Input className='w-[98px] h-fit' disabled={true} value={element.test_content.contest.contest_name}></Input>
                                            </div>
                                        </div>
                                        {
                                            element.test_content.score_eachs.map((part, idx, arr) => {
                                                return (
                                                    <>
                                                        <div className="flex items-center ml-20 h-12">
                                                            <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                                                                <span>{part.part_name}</span>
                                                                <span className="text-danger"> *</span>
                                                            </div>
                                                            <div className='my-auto flex-shrink-0'>
                                                                <Input className='w-[98px] h-fit' 
                                                                    value={part.result}
                                                                    onChange={({target}) => {
                                                                        setTargetDetails(prev => prev.map((obj, i) => i === index ? validate(idx, target.value, part.max_score, obj) : obj))
                                                                        handleChange(targetDetails.map((obj, i) => i === index ? validate(idx, target.value, part.max_score, obj) : obj))
                                                                        handleCanSubmit(targetDetails.every((obj, i) => i === index ? checkNewState(obj, idx, target.value, part.max_score) : checkOldState(obj)))
                                                                }}></Input>
                                                            </div>
                                                        </div> 
                                                        <div className='text-danger ml-40'>
                                                            <span className='text-xs'>{ part.error }</span>
                                                        </div>
                                                    </>         
                                                )
                                            })
                                        }
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="justify-self-start mb-5">
                                        <h3>{ element.category.name }<span className="text-danger"> *</span></h3>
                                        <div className="flex flex-col mt-3 mb-5 ml-10">
                                            <Input 
                                                id="it_skill"
                                                className='w-[410px]' 
                                                value={element.free_content.result}
                                                onChange={({target}) => {
                                                    setTargetDetails(prev => prev.map((obj, idx) => idx === index ? validate(null, target.value, null, obj) : obj))
                                                    handleChange(targetDetails.map((obj, i) => i === index ? validate(null, target.value, null, obj) : obj))
                                                    handleCanSubmit(targetDetails.every((obj, i) => i === index ? checkNewState(obj, null, target.value, ) : checkOldState(obj)))
                                                }}></Input>
                                            <div className='text-danger ml-4 text-xs'>
                                                <span className='text-xs'>{element.free_content.error}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <div className='w-full h-[800px] flex flex-col bg-white pt-8'>
                    <span className='text-xl ml-10'>読み込み中...</span>
                </div>
            );
        }
    } else {
        if (milestone?.target?.target_details){
            return (
                <div className='w-full h-[800px] flex flex-col bg-white pt-8'>
                    <div className="flex items-center justify-center">
                        <h2 className="text-primary mb-6 text-4xl" >実績</h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] ml-10">
                    {milestone.target.target_details.map((element, idx, arr) => {
                        if (element?.type === 0 && !element?.delete) {
                            return (
                                <div className="mb-10">
                                    <div className="flex justify-between mb-4">
                                        <h3>{ element.category?.name }</h3><br/>
                                    </div>

                                    <div className="flex items-center ml-20 h-12">
                                        <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                                            <span>受験日</span>
                                        </div>
                                        <div className='my-auto flex-shrink-0'>
                                            <span className='text-sm'>{moment(element.test_content.date_of_contest).format('YYYY/MM/DD')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center ml-20 h-12">
                                        <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                                            <span>試験</span>
                                        </div>
                                        <div className='my-auto flex-shrink-0'>
                                            <span className='text-sm'>{ element.test_content.contest.contest_name }</span>
                                        </div>
                                    </div>
                                    {
                                        element.test_content.score_eachs.map((part) => {
                                            return (
                                                <>
                                                    <div className="flex items-center ml-20 h-12">
                                                        <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                                                            <span>{ part.part_name }</span>
                                                        </div>
                                                        <div className='my-auto flex-shrink-0'>
                                                            <span className='text-sm'>{ part.result }</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            );
                        } else if (element?.type === 1 && !element?.delete) {
                            return (
                                <div className="justify-self-start mb-8">
                                    <h3>{ element.category?.name }</h3>
                                    <div className="flex flex-col mt-3 mb-5 ml-10">
                                        <h5>{ element.free_content.result }</h5> 
                                    </div>
                                </div>
                            )
                        }
                    })}

                    </div>
                </div>
            );
        }
        else {
            return (
                <div className='w-full h-[800px] flex flex-col bg-white pt-8'>
                    <span className='text-xl ml-10'>読み込み中...</span>
                </div>
            );
        }
    }
};

Achievement.propTypes = {
    edit: PropTypes.bool,
    onSubmit: PropTypes.func,
    targetId: PropTypes.number,
};

export default Achievement;