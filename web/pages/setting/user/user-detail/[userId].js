import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SettingLayout from "~/components/layout/SettingLayout"
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import BackButton from "~/components/BackButton";
import Icon from "~/components/Icon";
import { Spin, Modal } from 'antd';
import defaultAvt from "~/assets/images/default-avatar.png";
import EachInput from '~/components/E1-2/EachInput';
import { showNotification } from '~/components/Notification';
import client from '~/api/client';
import PageHeader from '~/components/PageHeader';

const UserDetail = () => {
	const router = useRouter();
	const { userId } = router.query;
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({});
	const [currentUser, setCurrentUser] = useState({});

	const handleDelete = () => {
		if((currentUser.role == "2" && userData.role != "2") || (currentUser.role == "0" && userData.role == "2")) {
			Modal.confirm({
				title: 'このユーザを削除してもよろしいですか?',
				centered: true,
				icon: <ExclamationCircleOutlined />,
				content: '削除後に復元できません。',
				okText: '削除',
				cancelText: 'キャンセル',

				async onOk() {
					try {
						await client.delete(`user/delete/${userId}`).json();
						showNotification({
							type: "warning",
							title: "ユーザが削除されました。",
						})
						router.back();
					} catch (error) {
						console.log('Delete failed: ', error);
					}
				},
			});
		} else {
			showNotification({
				type: "error",
				title: "アクセス拒否。",
			})
		}
	}

	const handleEdit = () => {
		if((currentUser.role == "2" && userData.role != "2") || (currentUser.role == "0" && userData.role == "2")) {
			router.push(`edit/${userId}`)
		} else {
			showNotification({
				type: "error",
				title: "アクセス拒否。",
			})
		}
	}

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const res = await client.get(`user/detail?userId=${userId}`).json();
				if(res.success) {
					setUserData(res.data);
					setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
				} else {
					router.push(`/404`);
				}
			} catch (error) {
				console.log('Fetching error: ', error);
			}
			setLoading(false);
		}

		fetchUserData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId])

	return (
		<SettingLayout>
			{loading ? 
				(<Spin size="large" />) 
				:
				(
					<>
						<PageHeader 
							type="detail"
							title="ユーザー詳細"
							onDeleteBtnClick={handleDelete}
							onEditBtnClick={handleEdit}
							onBackBtnClick={() => router.back()}
						/>
						<div className="flex flex-col justify-center items-center">
							<div className="flex justify-start items-start w-[1060px]">
								<div className="flex justify-center items-center rounded-full w-[150px] h-[150px]">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img 
											className="rounded-full object-cover w-[150px] h-[150px]" 
											alt="avatar" 
											src={
												userData?.avatar ? 
												(userData.avatar.startsWith('images/') ? "/" : "") + userData.avatar 
												: 
												defaultAvt.src
											} 
										/>
								</div>
								<div className="flex items-start grow">
									<div className="grid grid-cols-1 gap-y-6 grow">
										<EachInput 
											title="名前"
											detail={true}
											content={
												<div>
													{userData?.vietnamese_fullname}
												</div>
											}
										/>
										<EachInput 
											title="名前（カタカナ)"
										  detail={true}
											content={
												<div>
													{userData?.japanese_fullname}
												</div>
											}
										/>
										<EachInput 
											title="メールアドレス" 
										  detail={true}
											content={
												<div>
													{userData?.email}
												</div>
											}
										/>
										<EachInput 
											title="役割" 
										  detail={true}
											content={
												<div>
													{userData?.role == "1" && "内定者"}
													{userData?.role == "2" && "メンター"}
													{userData?.role == "3" && "教師"}
													{userData?.role == "4" && "企業担当者"}
												</div>
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
											  detail={true}
												content={
													<div className="w-96">
														{userData?.university_name}
													</div>
												}
											/>
										}
										{userData?.role == "1" &&
											<EachInput 
												title="年度コード" 
											  detail={true}
												content={
													<div className="w-36">
														{userData?.grade_code}
													</div>
												}
											/>
										}
										{(userData?.role == "4" || userData?.role == "1") &&
											<EachInput 
												title="企業" 
											  detail={true}
												content={
													<div className="w-96">
														{userData?.company_name}
													</div>
												}
											/>
										}
										{userData?.role == "1" &&
											<>
												<EachInput 
													title="内定取得日" 
												  detail={true}
													content={
														<div className="w-96">
															{moment(userData.receive_naitei_date).format("YYYY/MM/DD")}
														</div>
													}
												/>
												<EachInput 
													title="卒業予定日" 
												  detail={true}
													content={
														<div className="w-96">
															{moment(userData.graduation_date).format("YYYY/MM/DD")}
														</div>
													}
												/>
											</>
										}
									</div>
								</>
							}
						</div>
					</>
				)
			}
		</SettingLayout>
	)
}

export default UserDetail
