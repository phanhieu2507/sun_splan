import { useEffect, useState } from "react";
import styles from "~/styles/Login.module.css";
import { Input } from 'antd';
import Link from "next/link";
import Image from "next/image";
import LoginImg from "~/assets/login-image.svg";
import Logo from "~/assets/app-logo.svg";
import SubmitButton from "~/components/SubmitButton";
import Icon from "~/components/Icon";
import { showNotification } from "~/components/Notification";
import { useRouter } from "next/router";
import { auth } from "~/api/client";
import { setCookie } from 'nookies';

const EMAIL_REGEX = /^[a-z][a-z0-9_\.]{4,32}@[\S]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

const errorMessage = {
	invaildEmail: '有効なメールアドレスを入力してください。',
	emptyEmail: 'メールアドレスを入力してください。',
	emptyPwd: 'パスワードを入力してください。',
	invaildResponse: 'メールアドレスまたはパスワードが正しくありません。',
	successLogin: 'ログインが成功しました。',
};

export default function Login() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [validEmail, setValidEmail] = useState('');
	const [showEmailError, setShowEmailError] = useState(false);

	const [validPwd, setValidPwd] = useState('');
	const [showPwdError, setShowPwdError] = useState(false);

	//Submit Form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);	
		
		try {
			if(!validEmail && !validPwd && formData.email && formData.password)
			{
				const response = await auth.post('auth/login', {
					json: formData,
				}).json();
				const responseData = response.data;
				if(responseData)
				{
					localStorage.setItem('currentUser', JSON.stringify(responseData.user));
					
					router.push(`/`);
					showNotification({
						type: 'success',
						title: errorMessage.successLogin,
					});
				}
			}
		} catch (error) {
			showNotification({
				type: 'error',
				title: errorMessage.invaildResponse,
			});
		}
		setLoading(false);
		setShowEmailError(true);
		setShowPwdError(true);
	}


	// Check email
	useEffect(() => {
		formData.email ? 
			EMAIL_REGEX.test(formData.email) ? 
				setValidEmail('')
				:
				setValidEmail(errorMessage.invaildEmail)
			:
			setValidEmail(errorMessage.emptyEmail)
	}, [formData.email])

	// Check empty password
	useEffect(() => {
		formData.password ? 
			setValidPwd('')
			:
			setValidPwd(errorMessage.emptyPwd)
	}, [formData.password])


	return (
		<div className="h-screen bg-default">
			<div className="text-white text-center pt-10 pb-10">
						<Image src={Logo} alt="SPLAN" height={85} width={155} objectFit="cover"/>
					<div className="text-base font-normal tracking-[0em]">
						ログイン画面 
					</div>
			</div>
			<div className="flex justify-center items-center">
				<div className="w-[850px] flex">
					<div className={`${styles.left}
						w-[350px] bg-[#B2DEFF] px-10 pt-10 grid grid-cols-1 gap-y-5
						shadow-[0_4px_10px_0px_rgba(0,0,0,0.5)] z-10`}     
					>
						<Image src={LoginImg} alt="" width={36} height={36} />
						<div className="text-center">
							<span className="font-bold text-3xl text-center">
								SPLAN
							</span>
							<br/>
							<span className="block text-base text-center font-normal py-2">
								小さいことを重ねることが
								<br/>
								とんでもないところに行く
								<br/>
								ただひとつの道
							</span>
						</div>
					</div>
					<div className="py-3 w-[500px]">
							<div className={`${styles.right} py-10 pl-[65px] pr-[80px] bg-white`}>
								<h2 className="font-black text-text-default py-5">ようこそ、</h2>
								<form className="">
									<div>
										<label className="block mb-2.5 font-extrabold text-sm cursor-pointer" htmlFor="email">
											メールアドレス
											<span className="text-red-400 mx-1">*</span>
											:
										</label>
										<Input size="default" type="text" id="email" 
											placeholder="メールアドレスを入力してください"
											prefix={<Icon name="envelope" size={16} />}
											required
											aria-describedby='email-error'
											onChange={(e) => {
												setFormData({...formData, email: e.target.value});
											}}
											onFocus={() => setShowEmailError(false)}
										/>
										<span 
											id="email-error"
											className="text-red-600 text-xs block h-3 mt-1"
										>
											{showEmailError && validEmail}
										</span>
									</div>
									<div className="block mt-5">
										<label className="block mb-2.5 font-extrabold text-sm cursor-pointer" htmlFor="password">
											パスワード 
											<span className="text-red-400 mx-1">*</span>
											:
										</label>
										<Input size="default" type="password" id="password" 
											placeholder="パスワードを入力してください"
											prefix={<Icon name="lock" size={16} />}
											autoComplete="off"
											required
											aria-describedby="password-error"
											onChange={(e) => {
												setFormData({...formData, password: e.target.value});
											}}
											onFocus={() => setShowPwdError(false)}
										/>
										<span 
											id="password-error"
											className="text-red-600 text-xs block h-3 mt-1"
										>
											{showPwdError && validPwd}
										</span>
									</div>
									<Link href="#" >
										<a className="block mt-8 w-full text-right text-xs font-medium underline hover:underline">
											パスワードをお忘れですか？
										</a>
									</Link> 
									<SubmitButton  loading={loading} onClick={(e) => handleSubmit(e)}>ログイン</SubmitButton>
								</form>
							</div>
					</div>
				</div>
			</div>
		</div>
	)
}