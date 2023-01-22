import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, DatePicker } from 'antd';
import moment from 'moment';
import Icon from '../Icon';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, notification } from 'antd';

import { getMilestoneById } from '~/utils/C3/plan';
import SelectTargetType from './SelectTargetType';

const { confirm } = Modal;

const openNotification = (props) => {
    const key = `open${Date.now()}`;
    notification.open({
        type: props.type,
        message: props.title,
        description: props.description,
        key,
        duration: 2,
    });
};

const msg = {
    c3202: "255文字以下で入力してください。",
    c3203: "設定された最大点数の範囲で数字だけ入力してください",
    c3204: "削除してもよろしいですか？",
    c3206: "将来の年月を入力してください",
    c3210: "目標を正常に削除しました",
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
            expected_score: obj.free_content.expected_score
        } : null;
    }
}

const C3ViewGoal = ( {edit=false, targetId, handleChange, handleCanSubmit, milestone} ) => {

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
                        expected_score: value.length === 0 ? null : parseInt(value),
                        error: (value >= 0 && value <= max_score && value.length > 0) ? null : msg.c3203,
                    } : val)
                }
            }
        } else if(error.type === 1){
            return {
                ...error,
                free_content: {
                    ...error.free_content,
                    content: value,
                    error: (value.length > 0 && value.length <= 255) ? null : msg.c3202,
                }
            }
        }
    }

    const validateDatePicker = (state, date) => {
        return {
            ...state,
            test_content: {
                ...state.test_content,
                date_of_contest: date,
                dateError: new Date(date) < new Date() ? msg.c3206 : null,
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
            return (value.length > 0 && value.length <= 255)
        }
    }

    const checkNewDate = (date) => {
        return (new Date(date) > new Date())
    }

    const checkOldState = (state) => {        
        if (state.type === 0){
            return (state.test_content.score_eachs.every((obj) => !obj.error))
        }
        else return !state.free_content.error
    }

    const handleOnDelete = (handleOnOk) => {
        confirm({
            title: msg.c3204,
            style: { top: 300 },
            icon: <ExclamationCircleOutlined/>,
            content: '',
            okText: 'はい',
            cancelText: 'いいえ',
            onOk(){
                openNotification({
                    type: 'success',
                    title: '削除成功',
                    description: msg.c3210,
                })
                handleOnOk();
            },

            onCancel(){
                return;
            }
        })
    }

    const deleteTargetDetail = (state) => {
        const newState = {
            ...state,
            delete: true
        }
        if(newState.new){
            return null;
        }
        return newState
    }

    const handleAddJapaneseContestTarget = (contestName) => {
        const newTargetDetail = {
            type: 0,
            category_id: 1,
            category: {
                name: "日本語",
            },
            test_content: {
                contest_id: 1,
                contest: {
                    contest_name: contestName,
                },
                date_of_contest: moment().format('YYYY-MM-DD'),
                score_eachs: [
                    {
                        part_name: "言語知識",
                        expected_score: '',
                        result: '',
                        max_score: 60,
                    },
                    {
                        part_name: "読解",
                        expected_score: '',
                        result: '',
                        max_score: 60,
                    },
                    {
                        part_name: '聴解',
                        expected_score: '',
                        result: '',
                        max_score: 60,
                    }
                ],
            },
            new: true,
        }
        setTargetDetails(prev => [...prev, newTargetDetail]);
    }

    const handleAddFreeContentTarget = (category) => {
        const newTargetDetail = {
            type: 1,
            category_id: category === 'IT知識・技術' ? 3 : 4,
            category: {
                name: category,
            },
            free_content: {
                content: "",
            },
            new: true,
        }
        setTargetDetails(prev => [...prev, newTargetDetail])
    }
    
    if (edit === true){
        if (targetDetails){
            return (
                <div className='w-full h-[800px] flex flex-col bg-white pt-8'>
                    <div className="flex items-center justify-center">
                        <h2 className="text-primary mb-6 text-4xl" >目標</h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] ml-10 min-h-[100px]">  
                        { 
                            targetDetails.every(element => element?.delete) && 
                                <h2>目標なし...</h2>
                        }
                        { targetDetails.map((element, index, array) => {
                            if (element?.type === 0 && !element?.delete ){
                                return (
                                    <div className="mb-10">
                                        <div className="flex justify-between mb-4 mr-6">
                                            <h3>{element.category.name}</h3><br/>
                                            <a
                                                onClick={() => {
                                                    const funcOnDelete = () => {
                                                        const newTargetDetails = targetDetails.map((obj, idx) => idx === index ? deleteTargetDetail(obj) : obj)
                                                        newTargetDetails = newTargetDetails.filter((element) => element != null)
                                                        setTargetDetails(newTargetDetails)
                                                        handleChange(newTargetDetails)
                                                    }
                                                    handleOnDelete(funcOnDelete)
                                                }}
                                            >
                                                <Icon 
                                                    name="delete" 
                                                    color="disable" 
                                                    size={30} 
                                                    className="cursor-pointer h-max hover:bg-danger"
                                                />
                                            </a>
                                        </div>
            
                                        <div className="flex items-center ml-20 h-12">
                                            <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                                                <span>受験日</span>
                                            </div>
                                            <div className='my-auto flex-shrink-0'>
                                                <DatePicker 
                                                    className='rounded-2xl w-[171px] h-fit'  
                                                    value={ moment(element.test_content.date_of_contest) }
                                                    onChange={ (e) => {
                                                        const newValue = moment(e).format('YYYY-MM-DD');
                                                        setTargetDetails(prev => prev.map((obj, i) => i === index ? validateDatePicker(obj, newValue) : obj))
                                                        handleChange(targetDetails.map((obj, i) => i === index ? validateDatePicker(obj, newValue) : obj))
                                                        handleCanSubmit(targetDetails.every((obj, i) => i === index ? checkNewDate(newValue) : checkOldState(obj)))
                                                    } }
                                                ></DatePicker>
                                            </div>
                                        </div>
                                        <div className='text-danger ml-64'> 
                                            <span className='text-xs'>{ element.test_content.dateError }</span>
                                        </div>
                                        <div className="flex items-center ml-20 h-12">
                                            <div className="w-44 text-left my-auto text-default text-xl flex-shrink-0">
                                                <span>試験</span>
                                            </div>
                                            <div className='my-auto flex-shrink-0'>
                                                <Input className='w-[98px] h-fit' value={element.test_content.contest.contest_name}></Input>
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
                                                                    value={part.expected_score}
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
                            } else if (element?.type === 1 && !element?.delete) {
                                return (
                                    <div className="justify-self-start mb-5">
                                    <div className="flex justify-between mb-4 mr-6">
                                        <h3>{ element.category.name }<span className="text-danger"> *</span></h3>
                                        <a
                                            onClick={() => {
                                                const funcOnDelete = () => {
                                                    const newTargetDetails = targetDetails.map((obj, idx) => idx === index ? deleteTargetDetail(obj) : obj)
                                                    newTargetDetails = newTargetDetails.filter((element) => element != null)
                                                    setTargetDetails(newTargetDetails)
                                                    handleChange(newTargetDetails)
                                                }
                                                handleOnDelete(funcOnDelete)
                                            }}
                                        >
                                            <Icon 
                                                name="delete" 
                                                color="disable" 
                                                size={30} 
                                                className="cursor-pointer h-max hover:bg-danger"
                                            />
                                        </a>                                  
                                    </div>
                                        <div className="flex flex-col mt-3 mb-5 ml-10">
                                            <Input 
                                                id="it_skill"
                                                className='w-[410px]' 
                                                value={element.free_content.content}
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
                        <div className='flex justify-center'>
                            <SelectTargetType
                                handleAddJapaneseContestTarget={handleAddJapaneseContestTarget}
                                handleAddFreeContentTarget={handleAddFreeContentTarget}
                            />
                        </div>
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
                        <h2 className="text-primary mb-6 text-4xl" >目標</h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] ml-10">
                    { milestone.target.target_details.map((element, idx, arr) => {
                        if (element.type === 0) {
                            return (
                                <div className="mb-10">
                                    <div className="flex justify-between mb-4">
                                        <h3>{ element.category.name }</h3><br/>
                                    </div>

                                    <div className="flex items-center ml-20 h-12">
                                        <div className="w-48 text-left my-auto text-default text-xl flex-shrink-0">
                                            <span>受験日</span>
                                        </div>
                                        <div className='my-auto flex-shrink-0'>
                                            <span className='text-sm'>{ moment(element.test_content.date_of_contest).format('YYYY/MM/DD') }</span>
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
                                                            <span className='text-sm'>{ part.expected_score }</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            );
                        } else {
                            return (
                                <div className="justify-self-start mb-8">
                                    <h3>{ element.category.name }</h3>
                                    <div className="flex flex-col mt-3 mb-5 ml-10">
                                        <h5>{ element.free_content.content }</h5> 
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

C3ViewGoal.propTypes = {
    edit: PropTypes.bool,
    onSubmit: PropTypes.func,
    targetId: PropTypes.number,
};

export default C3ViewGoal;