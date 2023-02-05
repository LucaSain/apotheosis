import md from "markdown-it";
import Navbar from "../components/navbar";
import redis from "../db/redis";
import { order } from "./tree";

export default function Filozof({ data, ctx }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="flex-initial pb-16">
        <Navbar />
      </div>
      <div className="w-screen flex-1 ">
        <div className="flex w-full justify-center ">
          <img
            className="h-32 mt-5 rounded-full border-2 border-secondary mask"
            src={"/philosopher/" + ctx.replace(/ /g, "").toLowerCase() + ".png"}
          />
        </div>
        <div className="prose mx-auto mt-4 p-3">
          <div dangerouslySetInnerHTML={{ __html: md().render(data) }} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: order.map((x) => {
      return { params: { id: x } };
    }),
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const id = context.params.id;
  const data = await redis.get(id);
  return { props: { data: data, ctx: id } };
}
