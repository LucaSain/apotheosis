import Link from "next/link";

export default function Main() {
  return (
    <div className="relative z-30 flex flex-col justify-center items-center h-screen w-screen ">
      <img className="h-1/2" src="/apotheosis.png" />
      <h1 className="text-6xl text-center bg-clip-text bg-gradient-to-l from-accent to-secondary text-transparent font-bold ">
        Apotheosis
      </h1>
      <div className="basis-1/12"></div>
      <Link href="/tree">
        <button className="btn bg-transparent text-secondary">Explore</button>
      </Link>
    </div>
  );
}
