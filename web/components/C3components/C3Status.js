import { useEffect, useState } from 'react';
import { Col, Row, Select } from 'antd';
import ky from '~/api/ky';
import Icon from '../Icon';

const options = [
    {
        name: 'N/A',
        icon: 'rain'
    },
    {
        name: '未達成',
        icon: 'clowd'
    },
    {
        name: '達成済み',
        icon: 'fine'
    },
]

const { Option } = Select

export default function C3Status({ user, target, handleChange}) {
    const [updatedTime, setUpdatedTime] = useState(null);
    const [isShowSelect, setShowSelect] = useState(false)
    const [status, setStatus] = useState(target.is_completed)
    const [now] = useState(new Date())

    useEffect(() => {
        const updatedAt = new Date(target.updated_at).valueOf()

        const diffTime = (now - updatedAt) / 1000

        if (diffTime < 60) {
            setUpdatedTime("数秒")
        } else if (diffTime < 60 * 60) {
            setUpdatedTime(`${Math.floor(diffTime / 60)}分`)
        } else if (diffTime < 60 * 60 * 24) {
            setUpdatedTime(`${Math.floor(diffTime / 60 / 60)}時間`)
        } else if (diffTime < 60 * 60 * 24 * 30) {
            setUpdatedTime(`${Math.floor(diffTime / 60 / 60 / 24)}日`)
        } else if (diffTime < 60 * 60 * 24 * 365) {
            setUpdatedTime(`${Math.floor(diffTime / 60 / 60 / 24 / 30)}ヶ月`)
        } else {
            setUpdatedTime(`${Math.floor(diffTime / 60 / 60 / 24 / 365)}年`)
        }
    }, [target.updated_at, now])

    useEffect(() => {
        setStatus(target.is_completed)
    }, [target])

    const handleClickHere = () => {
        setShowSelect(true)
    }

    const handleSelect = async (value) => {
        setStatus(value)
        const newStatus = {
            id: target.id,
            is_completed: value,
        }

        const response = await ky.post('/api/target/update-status', {
            json: newStatus,
        }).json()

        if (response.success === true) {
            setShowSelect(false)
            handleChange(value)
        }
    }

    return (
        <Row
            className='h-[108px] font-extrabold right-0'
            gutter={[8, 0]}
        >
            <Col>
                {user.id === target.user_id ? (
                    <>
                        {!isShowSelect && (
                            <>
                                進捗状況を更新するには、
                                <span
                                    onClick={handleClickHere}
                                    className="text-primary cursor-pointer underline underline-offset-2"
                                >
                                    ここをクリックしてください
                                </span>
                            </>
                        )}
                    </>
                ) : (
                        <>
                            {updatedTime}前に、進捗状況が更新されました
                        </>    
                )}
            </Col>
            {isShowSelect && (
                <Col>
                    <Select
                        defaultValue={options[status].name}
                        onChange={handleSelect}
                        style={{
                            "width": 104,
                            "height": 36,
                        }}
                    >
                        {options.map((option, index) => {
                            return (
                                <Option
                                    key={index}
                                    value={index}
                                >
                                    {option.name}
                                </Option>
                            )
                        })}
                    </Select>
                </Col>
            )}
            <Col
                className="flex items-end"
            >
                <Icon name={options[status].icon} size={62} />
            </Col>
        </Row>
    )
}