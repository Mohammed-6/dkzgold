import {
  ArrowLeftIcon,
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ListBulletIcon,
  PaperClipIcon,
  PhoneIcon,
  QueueListIcon,
  TrashIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { Preloader, formatIndianRupee, serverURL } from "../stuff";
import {
  addMoneyToWallet,
  changePhoneOTP,
  changePhoneVerifyOTP,
  confirmWalletOrder,
  getProfile,
  profileUpdate,
  submitFeedbackSupport,
  updateProfile,
  updateProfileSIP,
  uploadSingle,
} from "./query/profile";
import { ContactSupportProp, profileProps } from "./types/profile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLogin, investGold, verifyotp } from "./query/login";
import { loginProps } from "./types/login";
import { OTPInput } from "./login";
import useRazorpay from "react-razorpay";
import Layout from "./layout";

const Content = () => {
  const [activemenu, setmenuactive] = useState<string>();
  const menu = [
    {
      name: "Account",
      list: [
        {
          name: "Profile",
          icon: <UserIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
        {
          name: "Wallet",
          icon: <WalletIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
      ],
    },
    {
      name: "Privacy and permissions",
      list: [
        {
          name: "Terms and Conditions",
          icon: <ListBulletIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
        {
          name: "Privacy Policy",
          icon: <QueueListIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
      ],
    },
    {
      name: "Help and support",
      list: [
        {
          name: "Contact Support",
          icon: <PhoneIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
      ],
    },
    {
      name: "More",
      list: [
        {
          name: "Delete Account",
          icon: <ExclamationTriangleIcon className="h-6 w-6 stroke-white" />,
          url: "",
        },
        {
          name: "Logout",
          icon: (
            <ArrowRightStartOnRectangleIcon className="h-6 w-6 stroke-white" />
          ),
          url: "",
        },
      ],
    },
  ];
  const [collectdata, setcollectdata] = useState<any>();
  const [loading, setloading] = useState<boolean>(false);

  const changeMenuactive = (i: number, x: number) => {
    console.log(i, x);
    const dd = i.toString() + x.toString();
    setmenuactive(dd);
  };

  useEffect(() => {
    getProfile()
      .then((res) => {
        // toast.success("Profile retrieved");
        setcollectdata(res.data.data);
        setloading(true);
      })
      .catch((err) => {
        toast.error("Error retriving profile");
      });
  }, []);
  return (
    <>
      <Layout>
        <ToastContainer />
        <div className="bg-slate-800 px-[10%] py-[5%] min-h-screen">
          <div className="grid grid-cols-12 bg-slate-700 rounded-xl">
            <div className="col-span-4 bg-slate-900 rounded-xl p-4">
              {menu.map((data, i) => (
                <div className="py-2">
                  <div className="text-sm text-slate-700">{data.name}</div>
                  {data.list.map((dd, x) => (
                    <div
                      className={`px-5 py-5 cursor-pointer ${
                        activemenu === i + "" + x
                          ? "bg-slate-700"
                          : "bg-slate-900"
                      } rounded-lg my-2`}
                      onClick={() => changeMenuactive(i, x)}
                    >
                      <div className="flex gap-x-2">
                        <div className="">{dd.icon}</div>
                        <div className="text-white text-md">{dd.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="col-span-8">
              <div className="p-6">
                {loading && activemenu === "00" ? (
                  <Profile data={collectdata} />
                ) : loading && activemenu === "01" ? (
                  <Wallet data={collectdata} />
                ) : activemenu === "20" ? (
                  <ContactSupport />
                ) : activemenu === "10" ? (
                  <Terms />
                ) : activemenu === "11" ? (
                  <Privacy />
                ) : activemenu === "30" ? (
                  <DeleteAccount />
                ) : activemenu === "31" ? (
                  <Logout />
                ) : loading ? (
                  <Profile data={collectdata} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

type profileWalletProp = {
  data: any;
};
const Profile = (props: profileWalletProp) => {
  const [collectdata, setcollectdata] = useState<profileProps>({
    profilePicture: "",
    name: "",
    phone: 0,
    age: 0,
    gender: "",
    email: "",
  });
  const [popbar, setpopbar] = useState<boolean>(false);
  const [phone, setphone] = useState<number>();
  const [verify, setverify] = useState<boolean>(false);
  const [fsubmit, setfsubmit] = useState<boolean>(false);
  const [formsubmit, setformsubmit] = useState<boolean>(false);
  const [showotp, setshowotp] = useState<boolean>(false);
  const [pcollectdata, setpcollectdata] = useState<loginProps>({
    phone: null,
    rememberToken: "",
  });

  useEffect(() => {
    setcollectdata(props.data);
  }, []);

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

  const formSubmitt = () => {
    setformsubmit(true);
    const colte = pcollectdata;
    colte.phone = phone;
    changePhoneOTP(colte)
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
    setpcollectdata({ ...pcollectdata, rememberToken: dd });
  };

  const verifyOTP = () => {
    if (pcollectdata.rememberToken === null) {
      toast.error("OTP not valid");
      setformsubmit(false);
      return;
    }
    changePhoneVerifyOTP(pcollectdata)
      .then((res) => {
        console.log(res);
        if (res.data.status === true) {
          toast.success(res.data.message);
          closepopbar();
          setformsubmit(false);
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

  const fileInputRef = useRef(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    const evt = e.currentTarget;
    if (file && file.length > 0) {
      const files = Array.from(file);
      updateProfile(files as any)
        .then((res) => {
          setcollectdata({ ...collectdata, profilePicture: res.data.data });
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const changeForm = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };
  const changeForm1 = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const formSubmit = () => {
    profileUpdate(collectdata)
      .then((res) => {
        toast.success("Profile updated successfully");
      })
      .catch((err) => {
        toast.error("Error updating profile");
      });
  };
  const closepopbar = () => {
    setpopbar(false);
  };
  return (
    <>
      <div className="">
        <h2 className="text-xl text-bold py-2 text-white">Profile</h2>
        <div className="">
          <div className="flex gap-x-5 items-center text-white">
            <div className="">
              <img
                src={
                  serverURL + "/" + collectdata.profilePicture === ""
                    ? "/public/images/no-image.webp"
                    : serverURL + "/" + collectdata.profilePicture
                }
                className="h-28 w-28 rounded-full object-cover object-center"
              />
            </div>
            <div className="cursor-pointer" onClick={handleClick}>
              Change Image
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-10 py-4">
            <div className="">
              <label className="text-white">Name</label>
              <input
                type="text"
                className="border border-slate-400 px-5 py-4 rounded-lg w-full bg-slate-700 focus:border-slate-400 focus:outline-none text-white"
                value={collectdata.name}
                onChange={changeForm}
                name="name"
              />
            </div>
            <div className="relative">
              <label className="text-white">Phone</label>
              <div className="absolute text-bold text-white left-4 bottom-4 text-md">
                +91
              </div>
              <input
                type="number"
                className="border border-slate-400 px-2 py-4 rounded-lg w-full text-bold bg-slate-700 pl-12 focus:border-slate-400 focus:outline-none text-white"
                value={collectdata.phone}
                onChange={changeForm}
                name="phone"
              />

              <div
                className="absolute text-bold text-white right-4 bottom-4 text-md uppercase hover:cursor-pointer"
                onClick={() => setpopbar(true)}
              >
                Change
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-10 py-4">
            <div className="">
              <label className="text-white">Age</label>
              <input
                type="text"
                className="border border-slate-400 px-5 py-4 rounded-lg w-full bg-slate-700 focus:border-slate-400 focus:outline-none text-white"
                value={collectdata.age}
                onChange={changeForm}
                name="age"
              />
            </div>
            <div className="relative">
              <label className="text-white">Gender</label>
              <select
                className="border border-slate-400 px-5 py-4 rounded-lg w-full bg-slate-700 focus:border-slate-400 focus:outline-none text-white"
                aria-placeholder="Gender"
                name="gender"
                value={collectdata.gender}
                onChange={changeForm1}
              >
                <option value="" className="hidden">
                  SELECT GENDER
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHERS">Others</option>
                <option value="NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-10 py-4">
            <div className="">
              <label className="text-white">Email (Optional)</label>
              <input
                type="text"
                className="border border-slate-400 px-5 py-4 rounded-lg w-full bg-slate-700 focus:border-slate-400 focus:outline-none text-white"
                value={collectdata.email}
                onChange={changeForm}
                name="email"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-10 py-4">
            <div className="">
              <button
                className="w-full block bg-blue-500 text-bold text-white px-4 text-center py-4 rounded-lg"
                onClick={formSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {popbar ? (
        <SidebarSkin close={closepopbar}>
          {!showotp ? (
            <div>
              <div className="text-md text-slate-500 text-center">
                Edit Phone Number
              </div>
              <div className="text-md text-slate-500 text-center">
                We'll send "OTP" for authentication
              </div>

              <input
                type="number"
                onChange={changePhone}
                className={`bg-white text-xl px-2 py-3 rounded-xl w-full mt-6 mb-4`}
              />
              <div className="flex items-center gap-x-1 py-1">
                <div className="">
                  <input type="checkbox" className="" onClick={changeVerify} />
                </div>
                <div className="text-slate-500 text-xs">
                  Consent for experian data
                </div>
              </div>
              <div className="py-3">
                <button
                  className={`text-white block w-full text-bold rounded-lg py-3 ${
                    !fsubmit ? "cursor-not-allowed" : "cussor-pointer"
                  } ${
                    formsubmit ? "bg-blue-700 text-gray-300" : "bg-blue-500"
                  }`}
                  disabled={!fsubmit}
                  onClick={formSubmitt}
                >
                  {formsubmit ? "Sending OTP..." : "Next"}
                </button>
              </div>
              <div className="py-3 text-slate-500 text-xs">
                <span className="">
                  We'll text you to confirm your number. Standard message and
                  data rates apply.{" "}
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
                      formsubmit ? "bg-blue-700 text-gray-300" : "bg-blue-500"
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
        </SidebarSkin>
      ) : (
        ""
      )}
    </>
  );
};

const Wallet = (props: profileWalletProp) => {
  const [amount, setamount] = useState<number>();
  const [showadd, setshowadd] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [Razorpay] = useRazorpay();

  const [collectdata, setcollectdata] = useState<any>({
    sipEnable: false,
    sipAmount: 0,
    sipFrequency: 0,
    walletBalance: 0,
  });

  useEffect(() => {
    setcollectdata(props.data);
  }, []);

  const changeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setamount(Number(evt.value));
  };

  const investNow = () => {
    setloading(true);
    console.log(localStorage.getItem("dkz_gold_customer_token"));
    if (
      localStorage.getItem("dkz_gold_customer_token") === null ||
      localStorage.getItem("dkz_gold_customer_token") === ""
    ) {
      return;
    }
    const colte = {
      amount: amount,
      token: localStorage.getItem("dkz_gold_customer_token"),
    };
    addMoneyToWallet(colte)
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
              amount: amount,
              paymentId: res.data.data.id,
            };
            confirmWalletOrder(dd)
              .then(function (res1) {
                if (res1.data.status === true) {
                  toast.success(res1.data.message);
                  setshowadd(false);
                  setloading(false);
                  setcollectdata({
                    ...collectdata,
                    walletBalance: collectdata.walletBalance + amount,
                  });
                } else {
                  toast.error(res1.data.message);
                }
              })
              .catch((error) => {
                toast.error("Some error occured");
                setshowadd(false);
                setloading(false);
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
          toast.error(response.error.description);
        });

        rzp1.open();
      })
      .catch((error) => {
        toast.error("Some error occured");
        setshowadd(false);
        setloading(false);
      });
  };

  const changeSipToogle = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, sipEnable: evt.checked });
  };

  const changeForm = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const formSubmit = () => {
    if (collectdata.sipAmount < 9) {
      toast.error("Amount must be greater than 9");
      return;
    } else if (collectdata.sipFrequency === 0) {
      toast.error("Frequency must be at least 1 day");
      return;
    }

    updateProfileSIP(collectdata)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch(() => {
        toast.error("Error updating profile!");
      });
  };
  return (
    <>
      {loading ? <Preloader /> : ""}
      {showadd ? (
        <>
          <div className="fixed inset-0 bg-black/50 z-10">
            <div className="max-w-lg mx-auto">
              <div className="card">
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <div className="">Add Balance</div>
                    <div className="">
                      <XMarkIcon
                        className="w-5 h-5 stroke-slate-500 cursor-pointer"
                        onClick={() => setshowadd(false)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="">
                    <label className="text-bold">Amount</label>
                    <input
                      type="number"
                      className="w-full rounded-lg px-3 border py-3"
                      placeholder="Enter your balance"
                      onChange={changeAmount}
                      value={amount}
                    />
                  </div>
                  <button
                    className="text-white rounded-lg px-6 my-3 text-bold py-2 bg-blue-500"
                    onClick={investNow}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="">
        <h2 className="text-xl text-white my-2 text-bold border-b border-slate-400">
          Wallet
        </h2>
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-white text-lg">
              Balance: {formatIndianRupee(collectdata.walletBalance)}
            </div>
          </div>
          <div className="">
            <button
              className="text-white bg-blue-500 px-8 py-3 rounded-lg text-bold"
              onClick={() => setshowadd(true)}
            >
              Add Balance
            </button>
          </div>
        </div>
        <div className="py-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={collectdata.sipEnable}
              onChange={changeSipToogle}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all z-0 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-white text-bold">
              Enable SIP
            </span>
          </label>
        </div>
        <div className={`py-3`}>
          <div
            className={`grid grid-cols-2 gap-x-10 ${
              collectdata.sipEnable ? "block" : "hidden"
            }`}
          >
            <div className="">
              <label className="text-white text-bold">SIP Amount</label>
              <input
                type="number"
                value={collectdata.sipAmount}
                name="sipAmount"
                onChange={changeForm}
                className="w-full rounded-lg p-3 border border-slate-500 bg-slate-800 text-white"
              />
            </div>
            <div className="">
              <label className="text-white text-bold">
                SIP Frequency(days)
              </label>
              <input
                type="number"
                value={collectdata.sipFrequency}
                name="sipFrequency"
                onChange={changeForm}
                className="w-full rounded-lg p-3 border border-slate-500 bg-slate-800 text-white"
              />
            </div>
          </div>
          <div className="">
            <button
              className="bg-blue-500 rounded-lg px-5 py-2 text-white text-bold my-3"
              onClick={formSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ContactSupport = () => {
  const [collectdata, setcollectdata] = useState<ContactSupportProp>({
    phone: "",
    email: "",
    issue: "",
    reason: "",
    attachment: "",
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    const evt = e.currentTarget;
    if (file && file.length > 0) {
      const files = Array.from(file);
      uploadSingle(files as any)
        .then((res) => {
          setcollectdata({ ...collectdata, attachment: res.data.data });
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const changeForm = (evt: React.FormEvent<HTMLInputElement>) => {
    const e = evt.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [e.name]: e.value });
  };

  const changeSelectForm = (evt: React.FormEvent<HTMLSelectElement>) => {
    const e = evt.target as HTMLSelectElement;
    setcollectdata({ ...collectdata, [e.name]: e.value });
  };

  const changeTextareaForm = (evt: React.FormEvent<HTMLTextAreaElement>) => {
    const e = evt.target as HTMLTextAreaElement;
    setcollectdata({ ...collectdata, [e.name]: e.value });
  };

  const formSubmit = () => {
    if (
      collectdata.phone === "" ||
      collectdata.email === "" ||
      collectdata.issue === "" ||
      collectdata.reason === ""
    ) {
      toast.error("*Some fields are required");
      return;
    }

    submitFeedbackSupport(collectdata)
      .then((res) => {
        toast.success(res.data.message);
        setcollectdata({
          ...collectdata,
          phone: "",
          email: "",
          issue: "",
          reason: "",
          attachment: "",
        });
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };
  return (
    <>
      <div className="">
        <h2 className="text-lg text-bold text-white border-b border-slate-400 uppercase tracking-wider">
          Contact Support
        </h2>
        <div className="py-6 text-white text-2xl tracking-wider text-bold">
          Please tell us about the issue
        </div>
        <div className="pb-3">
          <label className="text-white">Phone</label>
          <input
            type="text"
            name="phone"
            onChange={changeForm}
            value={collectdata.phone}
            className="px-4 py-3 rounded-lg text-white w-full bg-transparent border focus:ring-0 focus:outline-none border-slate-400"
          />
        </div>
        <div className="py-3">
          <label className="text-white">Email</label>
          <input
            type="text"
            name="email"
            onChange={changeForm}
            value={collectdata.email}
            className="px-4 py-3 rounded-lg text-white w-full bg-transparent border focus:ring-0 focus:outline-none border-slate-400"
          />
        </div>
        <div className="py-3">
          <label className="text-white">Select your Issue</label>
          <select
            name="issue"
            onChange={changeSelectForm}
            value={collectdata.issue}
            className="px-4 py-3 rounded-lg w-full bg-transparent border focus:ring-0 focus:outline-none border-slate-400"
          >
            <option value="none" disabled={true} hidden={false}>
              Select an Option
            </option>
            <option className="flex items-center justify-between p-1">
              Withdrawals
            </option>
            <option className="flex items-center justify-between p-1">
              Payment
            </option>
            <option className="flex items-center justify-between p-1">
              AutoPay
            </option>
            <option className="flex items-center justify-between p-1">
              Spare Change RoundUps
            </option>
            <option className="flex items-center justify-between p-1">
              Daily Savings
            </option>
            <option className="flex items-center justify-between p-1">
              Spin the Wheel
            </option>
            <option className="flex items-center justify-between p-1">
              Promocode
            </option>
            <option className="flex items-center justify-between p-1">
              Refer and Earn
            </option>
            <option className="flex items-center justify-between p-1">
              Gold Delivery
            </option>
            <option className="flex items-center justify-between p-1">
              Gold Gifting
            </option>
            <option className="flex items-center justify-between p-1">
              KYC
            </option>
            <option className="flex items-center justify-between p-1">
              Digital Gold
            </option>
            <option className="flex items-center justify-between p-1">
              Others
            </option>
          </select>
        </div>
        <div className="py-3">
          <label className="text-white">Please specify your reason</label>
          <textarea
            rows={4}
            placeholder="Describe your reason"
            name="reason"
            onChange={changeTextareaForm}
            value={collectdata.reason}
            className="px-4 py-3 rounded-lg text-white w-full bg-transparent border focus:ring-0 focus:outline-none border-slate-400"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-white">Attached file</div>
          <div className="">
            <div className="flex items-center gap-x-2" onClick={handleClick}>
              <div className="">
                <PaperClipIcon className="w-5 h-5 stroke-white" />
              </div>
              <div className="text-white">Upload</div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="py-3">
          <button
            className="text-center text-white rounded-lg block bg-blue-500 w-full px-3 py-3 text-bold"
            onClick={formSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

const Terms = () => {
  return (
    <>
      <div className="">
        <h2 className="text-4xl py-3 text-bold tracking-wider text-white">
          Terms and conditions
        </h2>
      </div>
    </>
  );
};

const Privacy = () => {
  return (
    <>
      <div className="">
        <h2 className="text-4xl py-3 text-bold tracking-wider text-white">
          Privacy policy
        </h2>
      </div>
    </>
  );
};

const DeleteAccount = () => {
  const [popupbar, setpopupbar] = useState<boolean>(true);

  const closepopbar = () => {
    setpopupbar(false);
  };
  return (
    <>
      {popupbar ? (
        <SidebarSkin close={closepopbar}>
          <div>
            <div className="flex justify-center">
              <ExclamationTriangleIcon className="stroke-yellow-500 h-32 w-32" />
            </div>
            <div className="text-lg text-bold text-white text-center">
              Are you sure you want to delete your account?
            </div>
            <div className="text-md text-slate-500 text-center">
              Once account is deleted, you will lose all access to DKZ app.
            </div>

            <div className="py-3 text-slate-500 mt-10">
              <button className="text-white mb-3 text-bold block w-full border border-blue-500 bg-transparent rounded-lg py-2 text-md">
                Delete Account
              </button>
              <button
                onClick={() => {
                  setpopupbar(false);
                }}
                className="text-white mb-3 text-bold block w-full border border-blue-500 bg-blue-500 rounded-lg py-2 text-md"
              >
                No, Don't Delete
              </button>
            </div>
          </div>
        </SidebarSkin>
      ) : (
        ""
      )}
    </>
  );
};

const Logout = () => {
  const [popupbar, setpopupbar] = useState<boolean>(true);

  const closepopbar = () => {
    setpopupbar(false);
  };
  return (
    <>
      {popupbar ? (
        <SidebarSkin close={closepopbar}>
          <div>
            <div className="flex justify-center">
              <ExclamationCircleIcon className="stroke-yellow-500 h-32 w-32" />
            </div>
            <div className="text-lg text-bold text-white text-center">
              Are you sure you want to logout
            </div>

            <div className="py-3 text-slate-500 mt-10">
              <button className="text-white mb-3 text-bold block w-full border border-blue-500 bg-blue-500 rounded-lg py-2 text-md">
                Yes
              </button>
              <button
                onClick={() => {
                  setpopupbar(false);
                }}
                className="text-white mb-3 text-bold block w-full border border-blue-500 bg-transparent rounded-lg py-2 text-md"
              >
                No
              </button>
            </div>
          </div>
        </SidebarSkin>
      ) : (
        ""
      )}
    </>
  );
};

type skinProp = {
  children: React.ReactNode;
  close: Function;
};
const SidebarSkin = (props: skinProp) => {
  const closePopup = () => {
    props.close();
  };
  return (
    <>
      <div className="fixed bg-black/50 inset-0 z-20">
        <div className="grid grid-cols-12">
          <div className="col-start-10 col-span-4">
            <div className="bg-slate-800 h-screen">
              <div className="py-28 px-8">
                <div className="flex justify-end py-8">
                  <XMarkIcon
                    className="w-6 stroke-white cursor-pointer"
                    onClick={closePopup}
                  />
                </div>
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
