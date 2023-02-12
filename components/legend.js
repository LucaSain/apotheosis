export default function Legend({ current, epoque, updateOpen }) {
  return (
    <>
      <div className="p-2 absolute z-10 top-2 right-2 bg-base-300 rounded-full border-secondary border-2 hover:border-accent">
        <svg
          onClick={() => {
            updateOpen(true);
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="#bdbdbd"
          viewBox="0 0 30 30"
          width="40px"
          height="40px"
        >
          <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
        </svg>
      </div>
      <div className="absolute z-50 bottom-0 right-0 bg-base-300 flex flex-row w-64 sm:w-96 min-w-max px-2 border-primary border-2 justify-center items-center">
        <div
          className="basis-1/2 flex justify-center text-sm sm:text-base"
          onClick={() => {
            updateOpen(true);
          }}
        >
          {current.id}
        </div>
        <div className="basis-1/2 flex justify-center text-sm sm:text-base">
          {epoque}
        </div>
      </div>
    </>
  );
}
