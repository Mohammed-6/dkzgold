import Link from "next/link";
import { serverURL } from "../stuff";
import { useEffect, useState } from "react";
import { LoginPage } from "./login";

const Header = () => {
  const [showlogin, setshowlogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only in the browser
    const storedToken = localStorage.getItem("dkz_login_token");
    setToken(storedToken);
  }, []);

  const closeLogin = () => {
    setshowlogin(false);
  };

  const shwLogin = () => {
    setshowlogin(true);
  };
  return (
    <>
      {showlogin ? <LoginPage close={closeLogin} /> : ""}
      <div className="bg-slate-900 px-10">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex items-center">
              <div>
                <img src="/images/logo.png" className="h-20 w-auto" />
              </div>
              <div className="text-yellow-500 text-4xl pt-2">GOLD</div>
            </div>
          </div>
          <div className="">
            <ul className="flex text-white">
              <li className="px-4 py-2 border-b-2 border-transparent hover:border-white duration-300 cursor-pointer mx-1">
                <Link href="/login">Home</Link>
              </li>
              <li className="px-4 py-2 border-b-2 border-transparent hover:border-white duration-300 cursor-pointer mx-1">
                <Link href="/login">Buy</Link>
              </li>
              <li className="px-4 py-2 border-b-2 border-transparent hover:border-white duration-300 cursor-pointer mx-1">
                <Link href="/login">Sell</Link>
              </li>
              <li className="px-4 py-2 border-b-2 border-transparent hover:border-white duration-300 cursor-pointer mx-1">
                {token ? (
                  <Link href="/transaction">Transaction</Link>
                ) : (
                  <a onClick={shwLogin}>Transaction</a>
                )}
              </li>
            </ul>
          </div>
          <div className="">
            {token ? (
              <Link href="/profile">
                <img
                  src={serverURL + "/public/images/no-image.webp"}
                  className="h-16 w-16 rounded-full object-cover object-center"
                />
              </Link>
            ) : (
              <a onClick={shwLogin}>
                <img
                  src={serverURL + "/public/images/no-image.webp"}
                  className="h-16 w-16 rounded-full object-cover object-center"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => {
  return <></>;
};

type layoutProp = {
  children: React.ReactNode;
};
const Layout = (props: layoutProp) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
