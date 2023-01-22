import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "~/assets/app-logo.svg";
import { Button } from "antd";

export default function PageNotFound () {
    const router = useRouter();
    return (
        <div className="flex justify-center items-center w-[100vw] h-[100vh]">
            <div className="grid grid-cols-2 justify-center items-center">
                <div className="flex justify-center items-center col-span-1">
                    <Image 
                        src={Logo}
                        alt="Logo"
                        className="opacity-50"
                        width={530}
                        height={300}
                    />
                    <div className="bg-default/50 h-[400px] w-[2px]"></div>
                </div>
                <div className="text-center font-bold col-span-1 cursor-default">
                    <h1 className="text-9xl text-default/50">404</h1>
                    <h3 className="text-3xl text-default/50 py-7">
                        ページが
                        <br/>
                        見つかりませんでした。
                    </h3>
                    <Button
                        size="large"
                        className="font-bold text-default/50"
                        onClick={() => {
                            router.push('/');
                        }}
                    >
                        ホームページ
                    </Button>
                </div>
            </div>
        </div>
    )
}