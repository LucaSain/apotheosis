import Navbar from "../components/navbar";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const TwoTimeLine = dynamic(() => import("../components/two/twotimeline"), {
  ssr: false,
});

export default function Timeline() {
  const router = useRouter();
  const { pos } = router.query;

  return (
    <>
      <Navbar />
      {pos ? <TwoTimeLine pos={pos} /> : <TwoTimeLine />}
    </>
  );
}
