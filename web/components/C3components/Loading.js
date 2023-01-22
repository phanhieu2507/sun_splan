import { Spin } from "antd";

function Loading () {
    return (
        <div className="loading flex flex-col gap-3 justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 z-[999] ">
            <style>
                {`
                    .loading .ant-spin-text {
                        color: #fff;
                    }
                    .loading .ant-spin-dot-item {
                        background-color: white;
                    }
                `}
            </style>
            <Spin
                size="large"
            />
            <div className="text-white text-lg"> 読み込んでいます... </div>
        </div>
    )
}

export default Loading;