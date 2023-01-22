import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { Progress, Select, Modal, Input, InputNumber, Popover } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import client from '~/api/client';
import Item from './Item';
import Icon from '~/components/Icon';
import { searchDocs, getAllDocs } from '~/utils/document';
import { getAllCategories,  } from '~/utils/category';
import Button from "~/components/Button";
import DefaultThumbnail from "~/assets/images/default_test_avatar.gif";
import { showNotification } from '~/components/Notification';

const errorMessage = {
	emptyError: "この項目は必須です。",
};

export default function PlanProgress ( { type, editIcon, planData } ) {
	const router = useRouter();
	const { Option } = Select;
	const [changed, setChanged] = useState(false);
	const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
	const [open, setOpen] = useState(false);
	const [currentOpenDoc, setCurrentOpenDoc] = useState({});
	const [formData, setFormData] = useState(planData?.plan?.plan_details);
	const [showError, setShowError] = useState(null);
	const [addAmount, setAddAmount] = useState(undefined);
	const [searchData, setSearchData] = useState("");
    const [search, setSearch] = useState({
        type: '',
        id: '',
        searchValue: ''
    })
    const [docs, setDocs] = useState([]);
    const [categories, setCategories] = useState([]);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
		setAddAmount(null);
	};

	const handleCancel = () => {
		handleSelectField("");
		handleVisibleChange(false);
		setSearchData("");
	}

	const handleOpenModal = (doc) => {
			setCurrentOpenDoc({...doc});
			setOpen(true);
	}

	const handleBack = () => {
		if(changed) {
			Modal.confirm({
				title: '編集した内容が保存されていません。',
				centered: true,
				icon: <ExclamationCircleOutlined />,
				content: 'キャンセルしますか?',
				okText: 'はい',
				cancelText: 'いいえ',
	
				onOk() {
					router.back();
				},
			});
		} else {
			router.back();
		}
	}

	const handleAdd = () => {
		setFormData([...formData, {
			document: currentOpenDoc,
			doc_id: currentOpenDoc.id,
			expected_amount: currentOpenDoc.limit,
			real_amount: addAmount,
			plan_id: planData?.plan.id,
			new: true,
		}])
		setAddAmount(undefined);
		setOpen(false);
		setChanged(true);
	}

    const handleSearch = async (data) => {
        const req = {
            type: search.type,
            id: search.id,
            searchValue: data,
        }

        const res = await searchDocs(req);

        if (res.success) {
            console.log(res.data.data)
            setDocs(res.data.data)
            setSearch(req)
        } 
    }

    const handleSelectField = async (value) => {
        const req = {
                id: value,
                type: "category",
                searchValue: search.searchValue,
            }

		const res = await searchDocs(req);

		if (res.success) {
			setDocs(res.data.data);
			setSearch(req);
			handleVisibleChange(false);
		}
    }

	const handleSubmit = async () => {
		setShowError(null);
		const error = formData.find(each => each.real_amount === null);
		if(error) {
			setShowError(error.doc_id);
		} else {
			if(changed) {
				try {
					const res = await client.post("plan/edit", {
						json: {plan: {
							plan_details: formData,
						}}
					});
					if(res) {
						showNotification({
							type: "success",
							title: "保存完了しました。",
						});
						router.back();
					}
				} catch (error) {
					console.log("Edit error: ", error);
				}
			} else {
				router.back();
			}
		}
	}

    useEffect(() => {
        const getDocs = async () => {
            const res = await getAllDocs()

            if (res.success) {
                setDocs(res.data.data)
            }
        }
        const getAllFilterFields = async () => {
            const categoryRes = await getAllCategories();

            if (categoryRes.success) {
                setCategories([...categoryRes.data]);
            } 
        }

        getDocs()
        getAllFilterFields()
    }, [])


    useEffect(() => {
		const handleSetData= () => {
			let total = 0;
			planData?.plan_details?.map((data) => 
				total += Math.round((data.real_amount/data.expected_amount) * 100)
			)
			total = Math.round(total / planData?.plan_details?.length)
			setProgress(total);
			setFormData(planData?.plan?.plan_details)
		}
		
		handleSetData();
    }, [planData])

    return (
        <>
            {type === "edit" ? (
				<div className="flex flex-col justify-center items-center gap-16">
					{formData?.length !== 0 && 
						<div className="grid grid-cols-6 auto-rows-auto gap-y-4 font-bold w-full">
							<h3 className="col-span-3 text-2xl">教材名</h3>
							<h3 className="col-span-2 text-2xl">計画 
							<span className="text-danger"> *</span>
							</h3>
							<div className="row-start-2 col-span-full flex flex-col gap-3 max-h-[240px] overflow-y-scroll">
								{
									formData?.map((data, index) => (
										!data.delete &&
										<div key={index}>
											<Item
												type={type}
												planData={data}
												formData={formData}
												errorMessage={showError == data.doc_id && errorMessage.emptyError}
												setFormData={setFormData}
												setChanged={setChanged}
											/>
										</div>
									))
								}
							</div>
						</div>
					}
					<div className="flex items-center w-1/2">
						<Input
							className="my-4 mr-4
								border-[1px]  border-input-default rounded-[2px]
								focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input"
							placeholder="検索"
							onChange={(e) => handleSearch(e.target.value)}
						/>
						<Popover
							content={
								<>
									<div className="flex justify-between items-center my-4">
										<span className="text-default mr-5">カテゴリ</span>
										<Select
											className="text-default"
											style={{
												width: 200,
											}}
											defaultValue=""
											value={searchData}
											onChange={(value) => setSearchData(value)}
										>
											<Option className="text-default" value="">
												All
											</Option>
											{categories?.map((category, index) => (
												<Option
													className="text-default"
													value={category.id}
													key={index}
												>
													{category.name}
												</Option>
											))}
										</Select>
									</div>
									<div className="flex justify-end items-center gap-2">
										<Button 
											className="text-default" 
											onClick={() => handleCancel()}
										>
											リセット
										</Button>
										<Button
											type="fill"
											onClick={() => handleSelectField(searchData)}
											htmlType="submit"
										>
											検索
										</Button>
									</div>
								</>
							}
							title={(<h4>検索オプション</h4>)}
							trigger="click"
							visible={visible}
							placement="bottomRight"
							onVisibleChange={handleVisibleChange}
						>
							<div className="flex justify-center items-center">
								<Icon name="filter cursor-pointer" size={32}/>
							</div>
						</Popover>
					</div>
					<div className='grid grid-cols-6 auto-rows-auto gap-y-4 font-bold w-full'>
						<div className="col-span-full">
							<h3 className="text-2xl text-default">教材一覧</h3>
						</div>
						<div className='row-start-2 col-span-full grid grid-cols-6'>
							<h3 className='col-start-2 col-span-2 text-primary'>教材名・学習内容</h3>
							<h3 className='col-span-1 text-primary'>カテゴリ</h3>
							<h3 className='col-span-2 justify-self-center text-primary'>最大実施内容</h3>
						</div>
						<div className='row-start-3 col-span-full flex flex-col gap-4 h-[400px] overflow-y-scroll'>
							{
								docs.length !== 0 ?
								(docs?.map((doc, index) => {
									const thumbnail = doc.images?.find(image => image.is_thumbnail === 1)
									return (
										<div 
											key={index} 
											className="grid grid-cols-6 items-center cursor-pointer hover:bg-slate-100"
											onClick={() => handleOpenModal(doc)}
											style={{display: formData?.find(each => each.doc_id === doc.id) ? 'none' : ''}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img 
												alt='thumbnail'
												src={thumbnail?.img_link || DefaultThumbnail.src} 
												className='object-cover justify-self-center w-[80px] h-[80px]'
											/> 
											<h4 className='col-start-2 col-span-2'>
												{doc.doc_name}
											</h4>
											<h4 className='col-span-1'>
												{doc.category?.name}
											</h4>
											<h4 className='col-span-2 justify-self-center'>
												{doc.limit} {doc.unit?.name}
											</h4>
										</div>
									)
								})) : (
									<p className="text-xl text-center font-normal m-0">データがありません。</p>
								)
							}                  
						</div>
						<Modal
							centered
							width={400}
							visible={open}
							okText="追加"
							cancelText="キャンセル"
							onOk={handleAdd}
							onCancel={() => { 
								setOpen(false); 
								setAddAmount(null);
							}}
						>
							<div className="text-default text-center">
								<p className="text-3xl">
									{currentOpenDoc?.doc_name}
								</p>
								<div className="flex justify-center items-center gap-4 mt-4">
									<div className="flex flex-col justify-center items-center gap-2">
										<label className="text-2xl" htmlFor="plan">計画</label>
										<InputNumber
											id="plan"
											className="text-xl text-default w-[80px]"
											placeholder="0"
											defaultValue={undefined}
											value={addAmount}
											min={0}
											max={currentOpenDoc?.limit}
											onChange={(value) => setAddAmount(value)}
										/>
									</div>
									<div className="flex flex-col justify-center items-center gap-2">
										<label className="text-2xl" htmlFor="plan">最大</label>
										<p className="text-xl m-0 h-[37px] mt-1">
											/{currentOpenDoc?.limit}{currentOpenDoc?.unit?.name}
										</p>
									</div>
								</div>
							</div>
						</Modal>
					</div>
					<div className="flex justify-center items-center gap-2 self-end mt-8">
						<Button 
							onClick={ handleBack}
						>
							キャンセル
						</Button>
						<Button type="fill" htmlType="submit" onClick={() => handleSubmit()}>
							保存
						</Button>
					</div>
				</div>
            ) : (
                <div className="container relative">
                    {editIcon && 
						<div className="grid grid-cols-5">
							<div className="col-start-4">
								<Link href={`/naiteishaplan/edit-plan/${planData?.id}`}>
									<div className="cursor-pointer h-[20px] w-[20px] float-right">
										<Icon name="pencil-squared" color="primary" size={20} />
									</div>
								</Link>
							</div>
						</div>
                    }
                    <div className="grid grid-cols-5">
						<div className="col-start-2 col-span-1 justify-self-center self-center">
							<Progress 
								strokeLinecap="butt" 
								type="circle"           
								percent={progress} 
								trailColor="#CFD8DC" 
								strokeColor="#224656" 
								strokeWidth={10}
								width={160}
							/>
						</div>
                        <div className="col-span-2 overflow-auto max-h-[242px] overscroll-y-auto flex flex-col justify-center">
							{
								planData?.plan_details?.map((data, index) => (
									<Item 
										key={index} 
										planData={data}
										unit={data.document.unit.name}
								/>
								))
							}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}