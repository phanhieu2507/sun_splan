import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SettingLayout from "~/components/layout/SettingLayout"
import BackButton from "~/components/BackButton";
import Button from "~/components/Button";
import { Spin, Input, Select, DatePicker, Modal } from 'antd';
import EachInput from '~/components/E1-2/EachInput';
import UploadImage from '~/components/E1-2/UploadImage';
import { showNotification } from '~/components/Notification';
import client from '~/api/client';
import PageHeader from '~/components/PageHeader';

const errorMessage = {
	emptyError: 'この項目は必須です。',
    invaildEmail: '有効なメールアドレスを入力してください。',
    takenEmail: 'メールはすでに使用されています。',
};

const Edit = () => {
	const router = useRouter();
	const { userId } = router.query;
	const { Option } = Select;
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [defaultData, setDefaultData] = useState({});
	const [universityData, setUniversityData] = useState([]);
	const [companyData, setCompanyData] = useState([]);
	const [changed, setChanged] = useState(false);

	const { 
		register, 
		handleSubmit, 
		setValue, 
		formState: { errors }, 
	} = useForm({
		defaultValues: {...userData},
	});

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

	const onSubmit = async (data) => {
		setLoading(true);
		if(changed) {
			try {
				data.avatar = userData.avatar;
				data.role = userData.role;
				const submitData = new FormData();
				if(userData.role == "1") {
					if(typeof(data.graduation_date) !== typeof('')) {
						data.graduation_date = data.graduation_date.format('YYYY-MM-DD');
					} 
					if(typeof(data.receive_naitei_date) !== typeof('')) {
						data.receive_naitei_date = data.receive_naitei_date.format('YYYY-MM-DD');
					}
					submitData.append("userId", userId);
					submitData.append("vietnamese_fullname", data.vietnamese_fullname);
					submitData.append("japanese_fullname", data.japanese_fullname);
					submitData.append("email", data.email);
					submitData.append("avatar", data.avatar);
					submitData.append("role", data.role);
					submitData.append("university_id", data.university_id);
					submitData.append("grade_code", data.grade_code);
					submitData.append("company_id", data.company_id);
					submitData.append("graduation_date", data.graduation_date);
					submitData.append("receive_naitei_date", data.receive_naitei_date);
					await client.post(`user/detail/${userId}`, {
						body: submitData,
					}).json();
				}
				if(userData.role == "3") {
					submitData.append("vietnamese_fullname", data.vietnamese_fullname);
					submitData.append("japanese_fullname", data.japanese_fullname);
					submitData.append("email", data.email);
					submitData.append("avatar", userData.avatar);
					submitData.append("role", data.role);
					submitData.append("university_id", data.university_id);
					await client.post(`user/detail/${userId}`, {
						body: submitData,
					}).json();
				}
				if(userData.role == "4") {
					submitData.append("vietnamese_fullname", data.vietnamese_fullname);
					submitData.append("japanese_fullname", data.japanese_fullname);
					submitData.append("email", data.email);
					submitData.append("avatar", data.avatar);
					submitData.append("role", data.role);
					submitData.append("company_id", data.company_id);
					await client.post(`user/detail/${userId}`, {
						body: submitData,
					}).json();
				}
				if(userData.role == "2") {
					submitData.append("vietnamese_fullname", data.vietnamese_fullname);
					submitData.append("japanese_fullname", data.japanese_fullname);
					submitData.append("email", data.email);
					submitData.append("avatar", data.avatar);
					submitData.append("role", data.role);
					await client.post(`user/detail/${userId}`, {
						body: submitData,
					}).json();
				}
				showNotification({
					type: "success",
					title: "ユーザが編集されました。",
				});
				router.back();
			} catch (error) {
				console.log('Submit failed: ', error);
			}
		} else {
			router.back();
		}
		setLoading(false);
	}

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const res = await client.get(`user/detail?userId=${userId}`).json();
				const res2 = await client.get('user/get-inf').json();
				if(res.success)
				{
					setValue("avatar", res.data.avatar);
					setUserData(res.data);
					setDefaultData(res.data);
					setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
				} else {
					router.push(`/404`);
				}
				if(res2.success)
				{
					setUniversityData(res2.universities);
					setCompanyData(res2.companies);
				} 
			} catch (error) {
				console.log('Fetching error: ', error);
			}
			setLoading(false);
		}

		fetchUserData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId])

	useEffect(() => {
		const handleCheck = () => {
			if(
				userData?.vietnamese_fullname !== defaultData?.vietnamese_fullname ||
				userData?.japanese_fullname !== defaultData?.japanese_fullname ||
				userData?.email !== defaultData?.email ||
				userData?.avatar !== defaultData?.avatar ||
				userData?.university_id !== defaultData?.university_id ||
				userData?.grade_code !== defaultData?.grade_code ||
				userData?.company_id !== defaultData?.company_id ||
				userData?.graduation_date !== defaultData?.graduation_date ||
				userData?.receive_naitei_date !== defaultData?.receive_naitei_date
			) {
				setChanged(true);
			} else {
				setChanged(false);
			}
		}

		handleCheck();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData])

	return (
		<SettingLayout>
			{loading ? 
				(<Spin size="large" />) 
				:
				(
					<>
						<PageHeader
							type='edit'
							title='ユーザー編集'
							onBackBtnClick={handleBack}
						/>
						<form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
							<div className="flex justify-start items-start w-[1060px]">
								<div className="flex justify-center items-center rounded-full w-[150px] h-[150px]">
									<UploadImage 
										formData={userData} 
										setFormData={setUserData} 
									/>
								</div>
								<div className="flex items-start grow">
									<div className="grid grid-cols-1 gap-y-6 grow">
										<EachInput 
											title="名前"
											errorMessage={
												errors.vietnamese_fullname?.type === "required" && errorMessage.emptyError
											}
											content={
												<Input
													id="vietnamese_fullname"
													size="large"
													className="mr-4 font-normal text-xl text-default "
													placeholder="名前"
													defaultValue={setValue("vietnamese_fullname", userData.vietnamese_fullname)}
													value={userData.vietnamese_fullname}
													maxLength={64}
													status={errors.vietnamese_fullname && "error"}
													{...register("vietnamese_fullname", {
														required: true,
													})}
													onChange={(event) => {
														setValue("vietnamese_fullname", event.target.value);
														setUserData({...userData, vietnamese_fullname: event.target.value});
													}}
												/>
											}
										/>
										<EachInput 
											title="名前（カタカナ)"
											errorMessage={
												errors.japanese_fullname?.type === "required" && errorMessage.emptyError
											}
											content={
												<Input
													id="japanese_fullname"
													size="large"
													className="mr-4 font-normal text-xl text-default "
													placeholder="名前"
													defaultValue={setValue("japanese_fullname", userData.japanese_fullname)}
													value={userData.japanese_fullname}
													maxLength={64}
													status={errors.japanese_fullname && "error"}
													{...register("japanese_fullname", {
														required: true,
													})}
													onChange={(event) => {
														setValue("japanese_fullname", event.target.value);
														setUserData({...userData, japanese_fullname: event.target.value});
													}}
												/>
											}
										/>
										<EachInput 
											title="メールアドレス" 
											errorMessage={
												( errors.email?.type === "required" && errorMessage.emptyError )
												||
												( errors.email?.type === "pattern" && errorMessage.invaildEmail )
											}
											content={
												<Input
													id="email"
													size="large"
													className="mr-4 font-normal text-xl text-default "
													placeholder="名前"
													defaultValue={setValue("email", userData.email)}
													value={userData.email}
													maxLength={64}
													status={errors.email && "error"}
													{...register("email", {
														required: true,
														pattern: /^[a-z][a-z0-9_\.]{5,32}@[\S]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
													})}
													onChange={(event) => {
														setValue("email", event.target.value);
														setUserData({...userData, email: event.target.value});
													}}
												/>
											}
										/>
										<EachInput
											title="役割"
											id="role"
											content={
												<>
													{currentUser?.role == "2" &&
														<Select
															id="role"
															size="large"
															className="font-normal text-xl text-default w-36"
															defaultValue={setValue("role", userData.role)}
															value={userData.role}
															{...register("role")}
															onChange={(value) => {
																setValue("role", value);
																setUserData({...userData, role: value});
															}}
														>
															<Option value={1} className="text-default">内定者</Option>
															<Option value={3} className="text-default">教師</Option>
															<Option value={4} className="text-default">企業担当者</Option>
														</Select>
													}
													{currentUser?.role == "0" && 
														<Select
															id="role"
															size="large"
															className="font-normal text-xl text-default w-36"
															defaultValue={setValue("role", userData.role)}
															value={userData.role}
															disabled={true}
														>
															<Option value={2} className="text-default">メンター</Option>
														</Select>
													}
												</>
											}
										/>
									</div>
									<div className="w-28"></div>
								</div>
							</div>
							{userData?.role != "2" && 
								<>
									<div className="text-center text-3xl font-medium py-12">詳細</div>
									<div className="grid grid-cols-1 gap-y-6">
										{(userData?.role == "3" || userData?.role == "1") &&
											<EachInput 
												title="大学"
												errorMessage={
													errors.university_id?.type === "required" && errorMessage.emptyError
												}
												content={
													<Select
														id="university_id"
														size="large"
														className="w-96 text-xl text-default font-normal"
														placeholder="大学"
														defaultValue={setValue("university_id", userData.university_id)}
														value={userData.university_id}
														status={errors.university_id && "error"}
														{...register("university_id", {
															required: true,
														})}
														onChange={(value) => {
															setValue("university_id", value);
															setUserData({...userData, university_id: value});
														}}
													>
														{universityData?.map((each, index) => (
															<Option 
																key={index} 
																value={each.id} 
																className="text-default"
															>
																{each.abbreviation}
															</Option>
														))}
													</Select>
												}
											/>
										}
										{userData?.role == "1" &&
											<EachInput 
												title="年度コード" 
												errorMessage={
													errors.grade_code?.type === "required" && errorMessage.emptyError
												}
												content={
													<Select
														id="grade_code"
														size="large"
														className="w-36 text-xl font-normal text-default"
														placeholder="年度コード"
														defaultValue={setValue("grade_code", userData.grade_code)}
														value={userData.grade_code ? userData.grade_code : undefined}
														status={errors.grade_code && "error"}
														{...register("grade_code", {
															required: true,
														})}
														onChange={(value) => {
															setValue("grade_code", value);
															setUserData({...userData, grade_code: value});
														}}
														disabled={!userData.university_id}
													>
														{universityData?.find((each) => each.id == userData.university_id)?.code?.map((each, index) => (
															<Option 
																key={index}
																value={each.code} 
																className="text-default"
															>
																{each.code}
															</Option> 
														))}
													</Select>
												}
											/>
										}
										{(userData?.role == "4" || userData?.role == "1") &&
											<EachInput 
												title="企業" 
												errorMessage={
													errors.company_id?.type === "required" && errorMessage.emptyError
												}
												content={
													<Select
														id="company_id"
														size="large"
														className="w-96 text-xl text-default font-normal"
														placeholder="企業"
														defaultValue={setValue("company_id", userData.company_id)}
														value={userData.company_id ? userData.company_id : undefined}
														status={errors.company_id && "error"}
														{...register("company_id", {
															// required: true,
														})}
														onChange={(value) => {
															setValue("company_id", value);
															setUserData({...userData, company_id: value});
														}}
													>
														{companyData?.map((each, index) => (
															<Option 
																key={index} 
																value={each.id} 
																className="text-default"
															>
																{each.company_name}
															</Option>
														))}
													</Select>
												}
											/>
										}
										{userData?.role == "1" &&
											<>
												<EachInput 
													title="内定取得日" 
													errorMessage={
														errors.receive_naitei_date?.type === "required" && errorMessage.emptyError
													}
													content={
														<DatePicker
															id="receive_naitei_date"
															format="YYYY/MM/DD"
															size="large"
															className="w-96 text-xl text-default font-normal"
															placeholder="年月日選択"
															defaultValue={setValue("receive_naitei_date", moment(userData.receive_naitei_date))}
															value={moment(userData.receive_naitei_date ? userData.receive_naitei_date : undefined)}
															status={errors.receive_naitei_date && "error"}
															disabledDate={(date) => date > new Date()}
															{...register("receive_naitei_date", {
																// required: true,
															})}
															onChange={(value) => {
																setValue("receive_naitei_date", value);
																setUserData({...userData, receive_naitei_date: value});
															}}
														/>
													}
												/>
												<EachInput 
													title="卒業予定日" 
													errorMessage={
														errors.graduation_date?.type === "required" && errorMessage.emptyError
													}
													content={
														<DatePicker
															id="graduation_date"
															format="YYYY/MM/DD"
															size="large"
															className="w-96 text-xl text-default font-normal"
															placeholder="年月日選択"
															defaultValue={setValue("graduation_date", userData.graduation_date)}
															value={moment(userData.graduation_date ? userData.graduation_date : undefined)}
															status={errors.graduation_date && "error"}
															disabledDate={(date) => date < new Date()}
															{...register("graduation_date", {
																// required: true,
															})}
															onChange={(value) => {
																setValue("graduation_date", value);
																setUserData({...userData, graduation_date: value});
															}}
														/>
													}
												/>
											</>
										}
									</div>
								</>
							}
							<div className="flex justify-center items-center gap-2 self-end my-8">
								<Button 
									disabled={loading}
									htmlType="button"
									onClick={handleBack}
								>
									<span className="text-xl">キャンセル</span>
								</Button>
								<Button 
									type="fill"
									disabled={loading}
									htmlType="submit"
								>
									<span className="text-xl">保存</span>
								</Button>
							</div>
						</form>
					</>
				)
			}
		</SettingLayout>
	)
}

export default Edit
