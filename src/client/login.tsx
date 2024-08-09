import React, { useEffect, useRef, useState } from "react";
import { loginProps } from "./types/login";
import {
  adminLogin,
  confirmInvest,
  getGoldPrice,
  investGold,
  sellGold,
  verifyotp,
} from "./query/login";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Loader, Preloader } from "../stuff";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useRazorpay from "react-razorpay";
import Link from "next/link";
import { getInvest, getInvestment } from "./query/investment";
import Layout from "./layout";
const Login = () => {
  return (
    <>
      <Content />
    </>
  );
};

type otpProp = {
  length: number;
  getotp: Function;
};
export const OTPInput = (props: otpProp) => {
  const length = props.length;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      props.getotp(newOtp.join(""));
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]!.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      props.getotp(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {otp.map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-10 h-10 text-center border border-gray-400 rounded-lg"
        />
      ))}
    </div>
  );
};

type loginProp = {
  close: Function;
};
export const LoginPage = (props: loginProp) => {
  const [phone, setphone] = useState<number>();
  const [verify, setverify] = useState<boolean>(false);
  const [fsubmit, setfsubmit] = useState<boolean>(false);
  const [formsubmit, setformsubmit] = useState<boolean>(false);
  const [showotp, setshowotp] = useState<boolean>(false);
  const [collectdata, setcollectdata] = useState<loginProps>({
    phone: null,
    rememberToken: "",
  });

  const changePhone = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setphone(Number(evt.value));
    if (evt.value.length === 10 && verify === true) {
      setfsubmit(true);
    }
  };

  const changeVerify = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setverify(Boolean(evt.value));
    if (evt.value && phone.toString().length === 10) {
      setfsubmit(true);
    }
  };

  const formSubmit = () => {
    setformsubmit(true);
    const colte = collectdata;
    colte.phone = phone;
    adminLogin(colte)
      .then((res) => {
        console.log(res);
        if (res.data.status === true) {
          setshowotp(true);
          setformsubmit(false);
          toast.success(res.data.message);
        } else {
          setformsubmit(false);
          toast.error(res.data.message);
        }
      })
      .catch(() => {
        setformsubmit(false);
        toast.error("Something went wrong!");
      });
  };

  const getOTP = (dd: any) => {
    setcollectdata({ ...collectdata, rememberToken: dd });
  };

  const verifyOTP = () => {
    if (collectdata.rememberToken === null) {
      toast.error("OTP not valid");
      setformsubmit(false);
      return;
    }
    verifyotp(collectdata)
      .then((res) => {
        console.log(res);
        if (res.data.status === true) {
          toast.success(res.data.message);
          localStorage.setItem("dkz_gold_customer_token", res.data.token);
          window.location.href = "/login";
        } else {
          setformsubmit(false);
          toast.error(res.data.message);
        }
      })
      .catch(() => {
        setformsubmit(false);
        toast.error("Something went wrong!");
      });
  };
  const closePopup = () => {
    props.close();
  };
  return (
    <>
      <div className="fixed bg-black/50 inset-0 z-20">
        <div className="grid grid-cols-12">
          <div className="col-start-10 col-span-4">
            <div className="bg-slate-800 h-screen">
              <div className="py-[10%] px-8">
                {!showotp ? (
                  <>
                    <div className="flex justify-end">
                      <XMarkIcon
                        className="w-6 stroke-white cursor-pointer"
                        onClick={closePopup}
                      />
                    </div>
                    <div className="py-10">
                      <div className="flex justify-center py-3">
                        <img src="/images/logo.png" className="w-[100px]" />
                      </div>
                      <h2 className="text-white text-center text-2xl text-bold">
                        Welcome to DKZ Gold
                      </h2>
                      <input
                        type="number"
                        onChange={changePhone}
                        className={`bg-white text-xl px-2 py-3 rounded-xl w-full mt-6 mb-4`}
                      />
                      <div className="flex gap-x-1 py-1">
                        <div className="">
                          <input
                            type="checkbox"
                            className=""
                            onClick={changeVerify}
                          />
                        </div>
                        <div className="text-slate-500 text-xs">
                          Allow DKZ to access your credit report from RBI
                          approved companies to give you the best loan offers.
                        </div>
                      </div>
                      <div className="py-3">
                        <button
                          className={`text-white block w-full text-bold rounded-lg py-3 ${
                            !fsubmit ? "cursor-not-allowed" : "cussor-pointer"
                          } ${
                            formsubmit
                              ? "bg-blue-700 text-gray-300"
                              : "bg-blue-500"
                          }`}
                          disabled={!fsubmit}
                          onClick={formSubmit}
                        >
                          {formsubmit ? "Sending OTP..." : "Next"}
                        </button>
                      </div>
                      <div className="py-3 text-slate-500 text-xs">
                        <span className="">
                          We'll text you to confirm your number. Standard
                          message and data rates apply.{" "}
                          <a target="_blank" className="underline" href="">
                            Terms
                          </a>{" "}
                          &amp;{" "}
                          <a target="_blank" className="underline" href="">
                            conditions
                          </a>{" "}
                          apply
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-start">
                      <ArrowLeftIcon
                        className="w-6 stroke-white cursor-pointer"
                        onClick={() => setshowotp(false)}
                      />
                    </div>
                    <div className="pt-28">
                      <h2 className="text-white text-center text-2xl text-bold">
                        Verification
                      </h2>
                      <div className="text-xs text-center pt-3 text-slate-500">
                        We have sent a verification code to your number
                      </div>
                      <div className="pt-5 flex justify-center">
                        <OTPInput length={6} getotp={getOTP} />
                      </div>
                      <div className="text-xs text-center pt-3 text-slate-500">
                        Didn't receive code?{" "}
                        <span className="text-white underline">Resend OTP</span>
                      </div>
                      <div className="py-3">
                        <button
                          className={`text-white block w-full text-bold rounded-lg py-3 ${
                            !fsubmit ? "cursor-not-allowed" : "cussor-pointer"
                          } ${
                            formsubmit
                              ? "bg-blue-700 text-gray-300"
                              : "bg-blue-500"
                          }`}
                          disabled={!fsubmit}
                          onClick={verifyOTP}
                        >
                          {formsubmit ? "Verifing OTP..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Content = () => {
  return (
    <>
      <Layout>
        <ToastContainer />
        <div className="min-h-screen bg-slate-800">
          <div className="py-[2%] mx-[5%] justify-center h-auto">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="relative z-10">
                <div className="md:p-10">
                  <div className="">
                    <div className="mb-4">
                      <h2 className="mb-1 text-bold text-white text-5xl leading-[55px]">
                        Save Money in
                        <br />
                        <span className="text-yellow-400">
                          digital gold
                        </span>{" "}
                        from ₹ 10<span className="text-yellow-400">.</span>
                      </h2>
                      <div className="text-gray-100/50 py-6 text-3xl">
                        Its automatic, Like magic
                      </div>
                    </div>
                    <div className="w-[80%]">
                      <div className="pb-3">
                        <button
                          className="px-16 text-center rounded-2xl font-bold py-4 text-lg bg-primary text-white tracking-wide"
                          type="button"
                        >
                          Start saving
                        </button>
                      </div>
                    </div>
                    <div className="flex py-6 items-center gap-x-3">
                      <div className="text-gray-400">Powered by</div>
                      <div className="">
                        <img
                          src="https://cdn.prod.website-files.com/641d54fdcc011e574a41c547/64391fcb1e195b1feffce5fe_UPi.svg"
                          className=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <GoldBS />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

const GoldBS = () => {
  const [active, setactive] = useState<boolean>(true);
  const [showlogin, setshowlogin] = useState<boolean>(false);
  const [showloading, setshowloading] = useState<boolean>(false);
  const [showcomplete, setshowcomplete] = useState<boolean>(false);
  const [sellprice, setsellprice] = useState<number>();
  const [buyprice, setbuyprice] = useState<number>();
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (
      localStorage.getItem("dkz_gold_customer_token") === undefined ||
      localStorage.getItem("dkz_gold_customer_token") === ""
    ) {
      // setshowlogin(true);
    }
    getGoldPrice().then(function (price) {
      // console.log(price.data.data.buy.goldPrice);
      setbuyprice(price.data.data.buy.goldPrice);
      setsellprice(price.data.data.sell.goldPrice);
      setloading(true);
    });
  }, []);

  const toogleLogin = () => {
    setshowlogin(!showlogin);
  };

  const makeActive = () => {
    setactive(true);
  };

  const makeInactive = () => {
    setactive(false);
  };

  const showLoading = () => {
    setshowloading(!showloading);
  };
  const showComplete = () => {
    setshowloading(false);
    setshowcomplete(true);
  };
  return (
    <>
      {showlogin ? <LoginPage close={toogleLogin} /> : ""}
      <div className="max-w-[500px] relative">
        {showloading ? <Loading /> : ""}
        {showcomplete ? <TransactionComplete /> : ""}
        <div className="bg-slate-900 p-4 rounded-xl">
          <div className="bg-slate-800 p-1 rounded-lg my-4">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="">
                <button
                  className={`${
                    active ? "bg-slate-700 " : "bg-slate-800"
                  } w-full block text-white py-2 rounded-lg text-bold`}
                  onClick={() => makeActive()}
                >
                  Buy
                </button>
              </div>
              <div className="">
                <button
                  className={`${
                    !active ? "bg-slate-700 " : "bg-slate-800"
                  } w-full block text-white py-2 rounded-lg text-bold`}
                  onClick={() => makeInactive()}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
          <div className="">
            {loading ? (
              active ? (
                <GoldBuy
                  showlogin={toogleLogin}
                  showloading={showLoading}
                  showcomplete={showComplete}
                  goldPrice={buyprice}
                />
              ) : (
                <>
                  {localStorage.getItem("dkz_gold_customer_token") ===
                    undefined ||
                  localStorage.getItem("dkz_gold_customer_token") === "" ? (
                    <GoldLogin />
                  ) : (
                    <GoldSell showlogin={toogleLogin} goldPrice={sellprice} />
                  )}
                </>
              )
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type GBSProp = {
  showlogin: Function;
  showloading?: Function;
  showcomplete?: Function;
  goldPrice?: number;
};
const GoldBuy = (props: GBSProp) => {
  const [active, setactive] = useState<boolean>(true);
  const [buyamt, setbuyamt] = useState<number>();
  const [gramvalue, setgramvalue] = useState<number>();
  const [goldprice, setgoldprice] = useState<number>(props.goldPrice);
  const [showconfirm, setshowconfirm] = useState<boolean>(false);

  useEffect(() => {
    setgoldprice(props.goldPrice);
  }, []);

  const [Razorpay] = useRazorpay();
  const makeActive = () => {
    setactive(true);
  };

  const makeInactive = () => {
    setactive(false);
  };

  const changeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setbuyamt(Number(evt.value));
    setgramvalue(((1 / goldprice) * Number(evt.value)).toFixed(4));
  };
  const changeAmountFreq = (amount: number) => {
    setbuyamt(amount);
    setgramvalue(((1 / goldprice) * amount).toFixed(4));
  };
  const changeGramFreq = (amount: number) => {
    setgramvalue(amount);
    const dd = (amount * goldprice).toFixed(2);
    setbuyamt(Number(dd));
  };

  const changeGram = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setgramvalue(Number(evt.value));
    const dd = (Number(evt.value) * goldprice).toFixed(2);
    setbuyamt(Number(dd));
  };

  const orderNow = () => {
    if (buyamt < 10) {
      return;
    }
    setshowconfirm(true);
  };

  const investNow = () => {
    console.log(localStorage.getItem("dkz_gold_customer_token"));
    if (
      localStorage.getItem("dkz_gold_customer_token") === null ||
      localStorage.getItem("dkz_gold_customer_token") === ""
    ) {
      props.showlogin();
      return;
    }
    const colte = {
      amount: buyamt,
      token: localStorage.getItem("dkz_gold_customer_token"),
    };
    props.showloading();
    investGold(colte)
      .then(function (res) {
        const options = {
          key: "rzp_test_s7rXzSSkEG43th",
          amount: "50000",
          currency: "INR",
          name: "DKZ Investment",
          description: "incoming order",
          image: "https://www.dikazo.com/assets/images/dikazo-logo-main.png",
          order_id: res.data.data.id,
          handler: function (response: any) {
            //   alert(response.razorpay_payment_id);
            //   alert(response.razorpay_order_id);
            //   alert(response.razorpay_signature);
            const dd = {
              token: localStorage.getItem("dkz_gold_customer_token"),
              amount: buyamt,
              goldPrice: goldprice,
              goldgrams: gramvalue,
              paymentId: res.data.data.id,
            };
            confirmInvest(dd)
              .then(function (res1) {
                if (res1.data.status === true) {
                  toast.success(res1.data.message);
                  props.showcomplete();
                } else {
                  props.showloading();
                  toast.error(res1.data.message);
                }
              })
              .catch((error) => {
                toast.error("Some error occured");
                props.showloading();
              });
          },
          prefill: {
            // name: res.data.detail.firstName + res.data.detail.lastName,
            // email: res.data.detail.email,
            contact: res.data.detail.phone,
          },
          notes: {
            address: "investment amount",
          },
          theme: {
            color: "#10A37F",
          },
        };
        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response: any) {
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
          props.showloading();
          toast.error(response.error.description);
        });

        rzp1.open();
      })
      .catch((error) => {
        toast.error("Some error occured");
        props.showloading();
      });
  };

  const amtArray = [50, 70, 100, 200, 500];
  const grmArray = [0.1, 0.5, 1, 1.5, 2];
  return (
    <>
      <div className="bg-slate-800 px-8 py-4 rounded-lg mb-4">
        <div className="">
          <h2
            className={`text-bold text-md py-3 hover:cursor-pointer ${
              showconfirm ? "text-gray-500" : "text-white"
            }`}
            onClick={() => setshowconfirm(false)}
          >
            Enter gold amount
          </h2>
          {!showconfirm ? (
            <>
              <div className="bg-slate-900 p-1 rounded-lg my-0">
                <div className="grid grid-cols-2 gap-x-3">
                  <div className="">
                    <button
                      className={`${
                        active ? "bg-slate-700 " : "bg-slate-900"
                      } w-full block text-white py-2 rounded-lg text-bold`}
                      onClick={() => makeActive()}
                    >
                      In Rupees
                    </button>
                  </div>
                  <div className="">
                    <button
                      className={`${
                        !active ? "bg-slate-700 " : "bg-slate-900"
                      } w-full block text-white py-2 rounded-lg text-bold`}
                      onClick={() => makeInactive()}
                    >
                      In Grams
                    </button>
                  </div>
                </div>
              </div>
              {active ? (
                <>
                  <div
                    className={`bg-slate-900 px-6 py-3 mt-3 mb-1 rounded-lg ${
                      buyamt < 10
                        ? "border border-red-500"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="text-white text-bold text-2xl">₹</div>
                      <div className="">
                        <input
                          type="number"
                          className={`appearance-none w-[70%] bg-slate-900 border-transparent outline-none focus:border-transparent focus:ring-0 text-white text-2xl text-bold`}
                          onChange={changeAmount}
                          value={buyamt}
                        />
                      </div>
                      <div className="text-gray-400 text-md">
                        {buyamt > 0
                          ? ((1 / goldprice) * buyamt).toFixed(4)
                          : goldprice}
                        &nbsp;gm
                      </div>
                    </div>
                  </div>
                  {buyamt < 10 ? (
                    <div className="text-red-500 text-sm">
                      Please enter the amount of at least ₹10
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm text-transparent">
                      Please enter the amount of at least ₹10
                    </div>
                  )}
                  <div className="py-6">
                    <div className="grid grid-cols-5 gap-x-4">
                      {amtArray.map((dd, k) => (
                        <button
                          className="bg-slate-700  text-white text-bold rounded-lg relative h-max cursor-pointer"
                          onClick={() => changeAmountFreq(dd)}
                        >
                          <div className="px-4 py-2 text-center">₹{dd}</div>
                          {k === 2 ? (
                            <div className="block bg-slate-500 text-center rounded-b-lg text-white text-bold px-2 py-1 text-xs">
                              Popular
                            </div>
                          ) : (
                            ""
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`bg-slate-900 px-6 py-3 mt-3 mb-1 rounded-lg ${
                      buyamt < 0.0
                        ? "border border-red-500"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-x-3">
                      <div className="">
                        <input
                          type="number"
                          className="appearance-none w-[70%] bg-slate-900 border-transparent outline-none focus:border-transparent focus:ring-0 text-white text-2xl text-bold"
                          value={gramvalue}
                          onChange={changeGram}
                        />
                      </div>
                      <div className="text-gray-400 text-md">
                        ₹{buyamt > 0 ? buyamt : goldprice}
                      </div>
                    </div>
                  </div>
                  {buyamt < 0.0 ? (
                    <div className="text-red-500 text-sm">
                      Please enter the amount of at least 0.1g
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm text-transparent">
                      Please enter the amount of at least 0.1g
                    </div>
                  )}
                  <div className="py-6 text-center">
                    <div className="grid grid-cols-5 gap-x-4">
                      {grmArray.map((dd, k) => (
                        <button
                          className="bg-slate-700  text-white text-bold rounded-lg relative h-max cursor-pointer"
                          onClick={() => changeGramFreq(dd)}
                        >
                          <div className="px-4 py-2 text-center">{dd}g</div>
                          {k === 2 ? (
                            <div className="block bg-slate-500 text-center rounded-b-lg text-white text-bold px-2 py-1 text-xs">
                              Popular
                            </div>
                          ) : (
                            ""
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="py-4">
                <Liverate goldrate={goldprice} />
              </div>
              <div className="py-6">
                <button
                  className="block w-full text-white text-bold py-4 bg-blue-500 rounded-lg text-xl"
                  onClick={orderNow}
                >
                  Confirm Order
                </button>
              </div>
            </>
          ) : (
            ""
          )}
          <h2
            className={` text-bold text-md py-3 hover:cursor-pointer ${
              showconfirm ? "text-white" : "text-gray-500"
            }`}
            // onClick={() => setshowconfirm(true)}
          >
            Order preview
          </h2>
          {showconfirm ? (
            <div className="py-6 px-4 bg-slate-700 rounded-xl">
              <div className="flex justify-between text-white pb-2 border-b border-gray-300 border-dashed">
                <div className="">View Price Breakdown</div>
                <div className="text-bold">₹{buyamt}</div>
              </div>
              <div className="flex justify-between text-white py-2">
                <div className="">Gold Quantity</div>
                <div className="text-bold">
                  {((1 / goldprice) * buyamt).toFixed(4)}gms
                </div>
              </div>
              <div className="flex justify-between text-white py-2">
                <div className="">Gold Value</div>
                <div className="text-bold">
                  ₹
                  {parseInt(buyamt.toFixed(2)) -
                    parseFloat(((buyamt / 100) * 3).toFixed(2))}
                </div>
              </div>
              <div className="flex justify-between text-white py-2 border-t border-gray-300 border-dashed">
                <div className="">GST(3.0%)</div>
                <div className="text-bold">
                  ₹{((buyamt / 100) * 3).toFixed(2)}
                </div>
              </div>
              <div className="py-6">
                <button
                  className="block w-full text-white text-bold py-4 bg-blue-500 rounded-lg text-xl"
                  onClick={investNow}
                >
                  Pay now
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

type liverateProp = {
  goldrate: number;
};
const Liverate = (props: liverateProp) => {
  const [time, setTime] = useState<number>(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          return 300;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };
  const formatSecond = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds;
    return secs;
  };
  function divideByNumber(currentValue: number, maxValue: number) {
    return (currentValue / maxValue) * 100;
  }
  return (
    <>
      <div className={`bg-slate-700 px-3 py-1 rounded-lg relative text-sm`}>
        <div
          className={`bg-green-500/50 px-3 py-1 z-0 absolute rounded-l-lg inset-0`}
          style={{
            width: `${divideByNumber(formatSecond(time), 300).toFixed(0)}%`,
          }}
        ></div>
        <div className="flex justify-between items-center z-10">
          <div className="bg-slate-800 rounded-lg px-1 z-10">
            <div className="text-red-500 text-bold p-1 rounded-lg">
              <div className="flex items-center gap-x-1 z-10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <div className="z-10">Live</div>
              </div>
            </div>
          </div>
          <div className="text-white text-bold pl-0 z-10">
            Price <span className="">₹{props.goldrate}/gm</span>
          </div>
          <div className="text-gray-200 relative">
            <div className="">Valid for {formatTime(time)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const GoldLogin = () => {
  return (
    <>
      <div className="">
        <div className="bg-Background-tertiary flex flex-col align-middle items-center  min-h-[550px] h-fit w-full border-0 justify-center rounded-[20px]">
          <div className="flex w-full h-full justify-center align-middle items-center opacity-80 sm:bg-transparent max-w-[1180px]">
            <div className="text-base flex flex-col justify-center items-center font-bold gap-4 h-full w-72 mt-10">
              <img
                alt="winning fallback"
                src="https://cdn.myjar.app/jar-pwa/savings/utils/doc_filled.svg"
                width="105"
                height="88"
                decoding="async"
                data-nimg="1"
                loading="lazy"
                style={{ color: "transparent;" }}
              />
              <div className="font-bold text-white text-2xl">
                Login to save in Gold
              </div>
              <div className="font-normal text-xs text-white">
                Keep saving with Jar
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const GoldSell = (props: GBSProp) => {
  const [active, setactive] = useState<boolean>(true);
  const [collectdata, setcollectdata] = useState<any>();
  const [sellamt, setsellamt] = useState<number>();
  const [gramvalue, setgramvalue] = useState<number>();
  const [goldprice, setgoldprice] = useState<number>(props.goldPrice);
  const [showconfirm, setshowconfirm] = useState<boolean>(false);
  const [confirmform, setconfirmform] = useState<boolean>(false);
  const [sellcomplete, setsellcomplete] = useState<boolean>(false);
  const [sellloading, setsellloading] = useState<boolean>(false);
  const [alert, setalert] = useState({ status: false, message: "" });

  useEffect(() => {
    if (
      localStorage.getItem("dkz_gold_customer_token") !== undefined ||
      localStorage.getItem("dkz_gold_customer_token") !== ""
    ) {
      getInvestment()
        .then((res) => {
          setcollectdata(res.data.data);
          console.log(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setgoldprice(props.goldPrice);
  }, []);

  const makeActive = () => {
    setactive(true);
  };

  const makeInactive = () => {
    setactive(false);
  };

  const changeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setsellamt(Number(evt.value));
    setgramvalue(((1 / goldprice) * Number(evt.value)).toFixed(4));
  };

  const changeGram = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setgramvalue(Number(evt.value));
    const dd = (Number(evt.value) * goldprice).toFixed(2);
    setsellamt(Number(dd));
  };

  const orderNow = () => {
    console.log(sellamt);
    if (
      sellamt <= 5 ||
      sellamt > collectdata.amount ||
      sellamt === undefined ||
      sellamt === null
    ) {
      if (sellamt <= 5) {
        setalert({
          status: true,
          message: "amount must be greater than or equal to 5",
        });
      } else if (sellamt > collectdata.amount) {
        setalert({
          status: true,
          message: "You don't have enough gold to sell",
        });
      } else if (sellamt === undefined || sellamt === null) {
        setalert({
          status: true,
          message: "Enter amount not valid!",
        });
      }
      return;
    }
    setshowconfirm(true);
    setalert({ status: false, message: "" });
  };

  const sellNow = () => {
    setconfirmform(true);
  };

  const getConfirm = (dd: string) => {
    if (dd === "no") {
      setconfirmform(false);
    } else if (dd === "yes") {
      setsellloading(true);
      const colte = {
        amount: sellamt,
        grams: Number(gramvalue),
        goldPrice: props.goldPrice,
        token: localStorage.getItem("dkz_gold_customer_token"),
      };
      sellGold(colte)
        .then((res) => {
          toast.success(res.data.message);
          setsellloading(false);
          setsellcomplete(true);
        })
        .catch((err) => {
          setsellloading(false);
          setshowconfirm(false);
          console.log(err);
          toast.error("Something went wrong");
        });
    }
  };
  return (
    <>
      <div className="bg-slate-800 px-8 py-4 rounded-lg mb-4">
        <div className="">
          <div className="flex items-center pb-4 justify-between">
            <div className="">
              <h2
                className="text-white text-bold text-md py-1 hover:cursor-pointer"
                onClick={() => setshowconfirm(false)}
              >
                Enter gold amount
              </h2>
            </div>
            <div className="">
              <h2 className="text-gray-200 text-bold text-md leading-3 py-2 float-right">
                Your gold balance
              </h2>
              <div className="text-yellow-600 text-xl text-bold">
                {collectdata?.grams !== undefined
                  ? collectdata?.grams
                  : "0.0000"}{" "}
                gm | ₹
                {collectdata?.amount !== undefined
                  ? collectdata?.amount
                  : "0.00"}{" "}
              </div>
            </div>
          </div>

          {!showconfirm ? (
            <>
              <div className="bg-slate-900 p-1 rounded-lg my-0">
                <div className="grid grid-cols-2 gap-x-3">
                  <div className="">
                    <button
                      className={`${
                        active ? "bg-slate-700 " : "bg-slate-900"
                      } w-full block text-white py-2 rounded-lg text-bold`}
                      onClick={() => makeActive()}
                    >
                      In Rupees
                    </button>
                  </div>
                  <div className="">
                    <button
                      className={`${
                        !active ? "bg-slate-700 " : "bg-slate-900"
                      } w-full block text-white py-2 rounded-lg text-bold`}
                      onClick={() => makeInactive()}
                    >
                      In Grams
                    </button>
                  </div>
                </div>
              </div>
              {active ? (
                <>
                  <div
                    className={`bg-slate-900 px-6 py-3 mt-3 rounded-lg ${
                      alert.status
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="text-white text-bold text-2xl">₹</div>
                      <div className="">
                        <input
                          type="number"
                          className="appearance-none w-[70%] bg-slate-900 border-transparent outline-none focus:border-transparent focus:ring-0 text-white text-2xl text-bold"
                          onChange={changeAmount}
                          value={sellamt}
                        />
                      </div>
                      <div className="text-gray-400 text-md">
                        {gramvalue}&nbsp;gm
                      </div>
                    </div>
                  </div>
                  <div className="text-red-500 text-sm">
                    {alert.status ? alert.message : ""}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`bg-slate-900 px-6 py-3 mt-3 rounded-lg ${
                      alert.status
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-x-3">
                      <div className="text-white text-bold text-2xl">gm</div>
                      <div className="">
                        <input
                          type="number"
                          className="appearance-none w-[70%] bg-slate-900 border-transparent outline-none focus:border-transparent focus:ring-0 text-white text-2xl text-bold"
                          onChange={changeGram}
                          value={gramvalue}
                        />
                      </div>
                      <div className="text-gray-400 text-md">₹{sellamt}</div>
                    </div>
                  </div>
                  <div className="text-red-500 text-sm">
                    {alert.status ? alert.message : ""}
                  </div>
                </>
              )}
              <div className="py-4">
                <LiveSellrate goldrate={props.goldPrice} />
              </div>
              <div className="py-6">
                <button
                  className="block w-full text-white text-bold py-4 bg-blue-500 rounded-lg text-xl"
                  onClick={orderNow}
                >
                  Confirm Order
                </button>
              </div>
            </>
          ) : (
            ""
          )}
          <h2
            className={` text-bold text-md py-3 hover:cursor-pointer ${
              showconfirm ? "text-white" : "text-gray-500"
            }`}
            // onClick={() => setshowconfirm(true)}
          >
            Order preview
          </h2>
          {showconfirm ? (
            <>
              <div className="py-6 px-4 bg-slate-700 rounded-xl">
                <div className="flex justify-between text-white py-2">
                  <div className="">Current Sell Price</div>
                  <div className="text-bold">{goldprice}gms</div>
                </div>
                <div className="flex justify-between text-white py-2">
                  <div className="">Gold Quantity</div>
                  <div className="text-bold">₹{gramvalue}</div>
                </div>
                <div className="flex justify-between text-white py-2 border-t border-gray-300 border-dashed">
                  <div className="">Amount to be credited</div>
                  <div className="text-bold">₹{sellamt}</div>
                </div>
              </div>
              <div className="text-white text-lg mt-4">Select you UPI</div>
              <div className="py-2 px-4 bg-slate-700 rounded-xl">
                <div className="flex justify-between text-white py-2">
                  <div className="">Wallet</div>
                  <div className="text-bold">
                    <input type="radio" />
                  </div>
                </div>
              </div>
              <div className="py-6">
                <button
                  className="block w-full text-white text-bold py-4 bg-blue-500 rounded-lg text-xl"
                  onClick={sellNow}
                >
                  Sell now
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {confirmform ? (
        <GoldSellConfirm amount={sellamt} response={getConfirm} />
      ) : (
        ""
      )}
      {sellcomplete ? (
        <SellTransactionComplete amount={sellamt} grams={gramvalue} />
      ) : (
        ""
      )}
      {sellloading ? <Loading /> : ""}
    </>
  );
};

type goldconfirmProp = {
  amount: number;
  response: Function;
};
const GoldSellConfirm = (props: goldconfirmProp) => {
  const confirmAction = (data: string) => {
    props.response(data);
  };
  return (
    <>
      <div className="absolute z-50 inset-0 rounded-xl m-auto flex items-center px-10 text-center justify-center w-full h-auto bg-slate-900">
        <div className="">
          <div className="flex justify-center">
            <ExclamationTriangleIcon className="w-28 stroke-yellow-500" />
          </div>

          <h2 className="my-2 text-white text-2xl text-bold">Are you sure?</h2>
          <div className="my-2 text-slate-400 text-md">
            You want to sell gold worth ₹{props.amount}
          </div>
          <button
            className="block mt-10 w-full bg-indigo-700 text-white py-2 rounded-lg text-md"
            onClick={() => confirmAction("no")}
          >
            No, I Changed My Mind
          </button>
          <button
            className="block mt-10 w-full border-2 border-indigo-700 text-white py-2 rounded-lg text-md"
            onClick={() => confirmAction("yes")}
          >
            Yes, Sell Anyway
          </button>
        </div>
      </div>
    </>
  );
};

type sellTransProp = {
  amount: number;
  grams: number;
};
const SellTransactionComplete = (props: sellTransProp) => {
  return (
    <>
      <div className="absolute z-50 inset-0 rounded-xl m-auto flex items-center px-10 text-center justify-center w-auto h-auto bg-slate-900">
        <div className="">
          <div className="flex justify-center">
            <CheckCircleIcon className="w-36 stroke-green-500 bg-slate-700 rounded-full p-6" />
          </div>

          <h2 className="my-4 text-white text-2xl">Gold sold successfully</h2>
          <div className="mt-4 text-yellow-500 text-md">24K Gold Sold</div>
          <div className="mb-4 text-white text-md">
            ₹{props.amount} | {props.grams}gm
          </div>
          <Link
            href="/transaction"
            className="block mt-10 w-full bg-indigo-700 text-white py-2 rounded-lg text-md"
          >
            Check my gold balance
          </Link>
        </div>
      </div>
    </>
  );
};

const LiveSellrate = (props: liverateProp) => {
  const [time, setTime] = useState<number>(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          return 300;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };
  const formatSecond = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds;
    return secs;
  };
  function divideByNumber(currentValue: number, maxValue: number) {
    return (currentValue / maxValue) * 100;
  }
  return (
    <>
      <div className={`bg-slate-700 px-3 py-1 rounded-lg relative text-sm`}>
        <div
          className={`bg-red-500/50 px-3 py-1 z-0 absolute rounded-l-lg inset-0`}
          style={{
            width: `${divideByNumber(formatSecond(time), 300).toFixed(0)}%`,
          }}
        ></div>
        <div className="flex justify-between items-center z-10">
          <div className="bg-slate-800 rounded-lg px-1 z-10">
            <div className="text-red-500 text-bold p-1 rounded-lg">
              <div className="flex items-center gap-x-1 z-10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <div className="z-10">Live</div>
              </div>
            </div>
          </div>
          <div className="text-white text-bold pl-0 z-10">
            Price <span className="">₹{props.goldrate}/gm</span>
          </div>
          <div className="text-gray-200 relative">
            <div className="">Valid for {formatTime(time)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <div className="absolute z-50 inset-0 rounded-xl m-auto flex items-center justify-center w-auto h-auto bg-slate-900">
        <div className="">
          <Loader />
        </div>
      </div>
    </>
  );
};

const TransactionComplete = () => {
  return (
    <>
      <div className="absolute z-50 inset-0 rounded-xl m-auto flex items-center px-10 text-center justify-center w-auto h-auto bg-slate-900">
        <div className="">
          <div className="flex justify-center">
            <CheckCircleIcon className="w-36 stroke-green-500 bg-slate-700 rounded-full p-6" />
          </div>

          <h2 className="my-4 text-white text-2xl">
            Thank you for investing with DKZ Gold
          </h2>
          <div className="my-4 text-slate-400 text-md">
            Your investment was successfully processed.
          </div>
          <Link
            href="/transaction"
            className="block mt-10 w-full bg-indigo-700 text-white py-2 rounded-lg text-md"
          >
            See Transactions
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
