import Image from "next/image";
import Logo from "./assests/codecollab_logo.png";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col p-8 bg-slate-800 space-y-3">
          <div>
            <Image
              className="mix-blend-lighten"
              src={Logo}
              width={150}
              height={100}
              alt="logo"
            />
          </div>
          <hr className="h-[1px] bg-slate-700 border-none !mb-3"/>
          <text>Paste invitation ROOM ID</text>
          <input
            className="rounded-lg p-2 focus:outline-none"
            placeholder="ROOM ID"
          />
          <input
            className="rounded-lg p-2 focus:outline-none"
            placeholder="USERNAME"
          />
          <button className="bg-purple-500 hover:bg-purple-600 rounded-lg p-2 w-20 ml-auto">
            Join
          </button>
          <div>
            <text className="text-sm">
              If you don't have an invitation then create{" "}
              <text className="text-purple-500 cursor-pointer hover:text-purple-600 transition underline">
                new room
              </text>
            </text>
          </div>
        </div>
      </div>
      <h3 className="fixed bottom-1 text-center w-full">
        Built with ❤️ by{" "}
        <a
          href="https://github.com/sunilkm2610"
          target="_blank"
          className="text-purple-400 cursor-pointer hover:text-purple-500 transition underline"
        >
          Sunil Kumar
        </a>
      </h3>
    </div>
  );
}
