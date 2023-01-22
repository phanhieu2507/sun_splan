import { LoadingOutlined } from '@ant-design/icons';

const SubmitButton = ({ children, onClick, loading }) => {
	const styles="w-full  mt-2.5 px-6 py-3 bg-primary text-white font-bold rounded-md border border-[#1890FF] hover:bg-[#228BDD] transition-all"

	return (
		<button className={styles} onClick={onClick}>
			{loading ? <LoadingOutlined /> : children}
		</button>
	);
};

export default SubmitButton;