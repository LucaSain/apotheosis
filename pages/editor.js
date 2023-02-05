import { useEffect, useRef, useState } from "react";
import md from "markdown-it";
import { data } from "./tree";
import redis from "../db/redis";

export default function Editor({ arr }) {
  const [data, setData] = useState(["", ""]);
  const textRef = useRef();
  const inputRef = useRef();
  const [completed, setCompleted] = useState(false);
  const [thing, setThing] = useState(-1);
  const submit = async () => {
    const requestData = JSON.stringify(data);
    await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestData,
    }).then((e) => {
      e.status === 200 ? setCompleted(true) : alert("something went wrong");
    });
  };

  useEffect(() => {
    textRef.current.value = thing !== -1 ? arr[thing].text : "";
    //textRef.current.value = thing !== -1 ? arr[thing].text : "";
  }, [thing]);

  const closeCompleted = () => {
    setCompleted(false);
  };

  return (
    <div className=" h-screen w-screen relative z-0">
      {completed ? (
        <div className="z-30 absolute">
          <Completed closeCompleted={closeCompleted} />
        </div>
      ) : (
        ""
      )}
      <div className="fixed bottom-4 right-10 w-20">
        <button
          onClick={async () => {
            await submit();
          }}
          className="btn btn-primary border-accent"
        >
          Upload!
        </button>
        <button
          onClick={() => {
            setThing(thing + 1);
          }}
          className="btn btn-primary border-accent"
        >
          INCR
        </button>
      </div>
      <div className="w-screen mt-2 flex items-center justify-center">
        <input
          type="text"
          placeholder="New Blog"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setData([e.target.value, data[1], data[2]]);
          }}
          ref={inputRef}
        />

        <label className="cursor-pointer label">
          <span className="label-text">Project</span>
          <input
            onChange={(e) => {
              setData([data[0], data[1], e.target.checked]);
            }}
            type="checkbox"
            className="checkbox checkbox-accent ml-1"
          />
        </label>
      </div>
      <div className="flex flex-row h-screen w-screen">
        <textarea
          className=" textarea textarea-accent bg-base-100 mx-auto min-h-full h-max mt-4 ml-4 mr-4 mb-4 rounded-xl basis-1/2"
          onChange={(e) => {
            setData([data[0], e.target.value, data[2]]);
          }}
          ref={textRef}
        ></textarea>
        <div className=" prose bg-base-100 mx-auto min-h-full h-max mt-4 ml-4 mr-4 mb-4 rounded-xl flex-1">
          <div dangerouslySetInnerHTML={{ __html: md().render(data[1]) }} />
        </div>
      </div>
    </div>
  );
}

const Completed = ({ closeCompleted }) => {
  return (
    <div className=" w-screen h-screen justify-center  items-center flex">
      <div className="card bg-base-300 w-96 h-96 flex justify-center items-center text-5xl border-2 border-neutral">
        Post succesful!
        <button
          onClick={() => {
            closeCompleted();
          }}
          className="btn btn-accent mt-10"
        >
          close
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  let arr = [];
  for (let i = 0; i < 99; i++) {
    arr.push({ id: data[i].id, text: await redis.get(data[i].id) });
  }
  return {
    props: {
      arr: arr,
    },
  };
}
