import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ConnectMetaMask from "@/components/ConnectMetaMask";
import UsingWeb3UiKit from "@/components/UsingWeb3UiKit";
import LotteryEntrance from "@/components/LotteryEntrance";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Header />
      <div>

        {/* <ConnectMetaMask /> */}

        {/* usingWeb3UiKit  */}

        <UsingWeb3UiKit />


        <LotteryEntrance />
        {/* <h1 className="text-2xl font-medium text-center">Hello</h1> */}
      </div>
    </>
  );
}
