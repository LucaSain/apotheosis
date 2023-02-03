import Main from "../components/main";
import dynamic from "next/dynamic";
import Navbar from "../components/navbar";

const TwoWrapper = dynamic(() => import("../components/two/twowrapper"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="w-screen h-screen flex flex-col justify-center items-center relative z-10">
        <Main />

        <div className="z-10 absolute">
          <TwoWrapper />
        </div>
      </div>
    </>
  );
}
