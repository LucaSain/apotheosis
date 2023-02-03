import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-300 fixed top-0 w-screen z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <Link href="/timeline">
              <h1>Timeline</h1>
            </Link>

            <Link href="/tree">
              <h1>Mindmap</h1>
            </Link>
          </ul>
        </div>
        <Link href="/">
          <div className="btn btn-ghost normal-case">
            <img className="w-16" src="/apotheosis.png"></img>
            Apotheosis
          </div>
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/timeline">
              <h1>Timeline</h1>
            </Link>
          </li>

          <li>
            <Link href="/tree">
              <h1>Mindmap</h1>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
