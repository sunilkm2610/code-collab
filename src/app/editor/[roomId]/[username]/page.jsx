"use client";
// export const metadata = {
//   title: "CodeCollab - Editor",
//   description: "Live code editor for multiple users",
// };

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "../../../assests/codecollab_logo.png";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { json } from "@codemirror/lang-json";
import { lezer } from "@codemirror/lang-lezer";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { sass } from "@codemirror/lang-sass";
import { csharp } from "@replit/codemirror-lang-csharp";
import {
  dracula,
  copilot,
  githubDark,
  androidstudio,
  aura,
  basicDark,
  eclipse,
  kimbie,
} from "@uiw/codemirror-themes-all";
import { initSocket } from "../../../socket";

const themes = [
  { name: "Dracula", theme: dracula },
  { name: "Copilot", theme: copilot },
  { name: "GitHub Dark", theme: githubDark },
  { name: "Android Studio", theme: androidstudio },
  { name: "Aura", theme: aura },
  { name: "Basic Dark", theme: basicDark },
  { name: "Eclipse", theme: eclipse },
  { name: "Kimbie", theme: kimbie },
];

const fontSizes = [
  {
    size: "sm",
    name: "Small",
  },
  {
    size: "lg",
    name: "Medium",
  },
  {
    size: "xl",
    name: "Large",
  },
  {
    size: "2xl",
    name: "Extra large",
  },
];

const languageOptions = [
  { name: "JavaScript", mode: javascript },
  { name: "C++", mode: cpp },
  { name: "HTML", mode: html },
  { name: "Java", mode: java },
  { name: "JSON", mode: json },
  { name: "Lezer", mode: lezer },
  { name: "Markdown", mode: markdown },
  { name: "PHP", mode: php },
  { name: "Python", mode: python },
  { name: "Rust", mode: rust },
  { name: "SQL", mode: sql },
  { name: "XML", mode: xml },
  { name: "Sass", mode: sass },
  { name: "C#", mode: csharp },
];

const Editor = ({ params }) => {
  const socketRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions[0].mode
  );
  const [currentTheme, setCurrentTheme] = useState(themes[0].theme);
  const [currentFontSize, setCurrentFontSize] = useState(fontSizes[0].size);
  const [code, setCode] = useState("");

  const [users, setusers] = useState([
    { socketId: 1, username: "Sunil Kumar Marwal Rakesh" },
    { socketId: 2, username: "Diksha" },
    { socketId: 3, username: "Ravi" },
    { socketId: 11, username: "Sunil Kumar M" },
    { socketId: 12, username: "Diksha" },
    { socketId: 13, username: "Ravi" },
    { socketId: 12, username: "Sunil Kumar M" },
    { socketId: 22, username: "Diksha" },
    { socketId: 32, username: "Ravi" },
    { socketId: 32, username: "Sunil Kumar M" },
    { socketId: 32, username: "Diksha" },
    { socketId: 33, username: "Ravi" },
  ]);

  const handleCopyRoomIdClick = () => {
    navigator.clipboard.writeText(params.roomId);
    toast.success("Room ID has been copied to your clipboard");
  };

  const handleThemeChange = (event) => {
    const selectedThemeName = event.target.value;
    const theme = themes.find((t) => t.name === selectedThemeName)?.theme;

    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguageName = event.target.value;
    const selectedMode = languageOptions.find(
      (lang) => lang.name === selectedLanguageName
    )?.mode;

    if (selectedMode) {
      setSelectedLanguage(selectedMode);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("JOINED");
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        // reactNavigator('/');
      }

      socketRef.current.emit("join", {
        roomId: params.roomId,
        username: params.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== params.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setusers(clients);
        console.log("sync-code", code);
        // socketRef.current.emit("sync-code", {
        //   newCode: code,
        //   socketId,
        // });
      });
      // socketRef.current.on("code-change", ({ newCode }) => {
      //   // if (newCode !== null) {
      //   // setCode(newCode);
      //   console.log("coderrrrrrrrrrrrrr", newCode);
      //   // }
      // });
    };
    init();
    return () => {
      // socketRef.current.disconnect();
      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ newCode }) => {
        if (newCode !== null) {
          setCode(newCode);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-change");
      }
    };
  }, [socketRef.current]);

  const handleChangeCode = (val) => {
    // setCode(val);
    socketRef.current.emit("code-change", {
      roomId: params.roomId,
      newCode: val,
    });
  };

  // useEffect(()=>{
  //   handleChangeCode()
  // },[])
  return (
    <div className="h-screen flex">
      <div className="w-64 bg-slate-600 h-full p-2 flex flex-col">
        <div>
          <Image
            className="mix-blend-lighten"
            src={Logo}
            width={200}
            height={70}
            alt="logo"
          />
          <hr className="h-[1px] bg-slate-700 border-none !mb-3" />
        </div>
        <div className="overflow-y-auto overflow-x-hidden scrollbar-hide">
          {users.map((user) => {
            return (
              <div className="mb-1 overflow-hidden w-max" key={user.username}>
                <Avatar
                  name={user.username}
                  color={"#000"}
                  round={"10px"}
                  size="40"
                  maxInitials={2}
                />
                <text className="ml-3 overflow-hidden">{user.username}</text>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col mt-auto">
          <button
            onClick={handleCopyRoomIdClick}
            className="bg-slate-400 hover:bg-slate-500 rounded-lg p-1 mb-2"
          >
            Copy room Id
          </button>
          <button
            // onClick={handleJoinClick}
            className="bg-purple-500 hover:bg-purple-600 rounded-lg p-1"
          >
            Leave
          </button>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="flex p-2">
          {/* <div className="flex flex-col"> */}
          {/* <label>Select Language: </label> */}
          <select
            onChange={handleLanguageChange}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {languageOptions.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
          {/* </div> */}

          <select
            onChange={handleThemeChange}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {themes.map((theme) => {
              return (
                <option key={theme.name} value={theme.name}>
                  {theme.name}
                </option>
              );
            })}
          </select>
          <select
            onChange={(e) => setCurrentFontSize(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {fontSizes.map((fontSize) => {
              return (
                <option key={fontSize.name} value={fontSize.size}>
                  {fontSize.name}
                </option>
              );
            })}
          </select>
        </div>
        <CodeMirror
          style={{ height: "calc(100vh - 3.5rem)" }}
          className={`overflow-auto text-${currentFontSize}`}
          value={code}
          height="100%"
          extensions={selectedLanguage}
          theme={currentTheme}
          onChange={handleChangeCode}
        />
      </div>
    </div>
  );
};

export default Editor;
