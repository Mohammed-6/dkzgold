import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { ArrowDownTrayIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getInvestment } from "./query/investment";
import { downloadInvoice } from "./query/login";
import { serverURL } from "../stuff";
import Layout from "./layout";
import Link from "next/link";

const Transaction = () => {
  return (
    <>
      <Content />
      {/* <Invoice /> */}
    </>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState<any>();
  const [activeid, setactiveid] = useState<number>(0);
  const [activedata, setactivedata] = useState<any>();

  useEffect(() => {
    getInvestment().then((res) => {
      setcollectdata(res.data.data);
      //   console.log(res);
      if (res.data.data.data !== undefined) {
        setactivedata(res.data.data.data[0]);
        // console.log(res.data.data.data[0]);
      }
    });
  }, []);
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return;
    }

    const options = { year: "2-digit", month: "short", day: "2-digit" };
    const formattedDate = date
      .toLocaleDateString("en-GB", options)
      .replace(",", "");
    const formattedTime = date
      .toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

    return `${formattedDate} | ${formattedTime}`;
    // return 0;
  };

  const invoiceDownload = (id: string) => {
    downloadInvoice(id).then((res) => {
      downloadPDF(
        serverURL + "/public/invoice/" + res.data.data,
        res.data.data
      );
    });
  };
  function downloadPDF(url: string, filename = "downloaded.pdf") {
    // Create a hidden anchor element
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    link.style.display = "none";

    // Append the anchor to the document body (optional)
    // document.body.appendChild(link); // Uncomment if needed

    // Simulate a click to initiate download
    link.click();

    // Remove the anchor element (optional)
    // document.body.removeChild(link); // Uncomment if needed
  }
  return (
    <>
      <Layout>
        <div className="bg-slate-800 min-h-screen">
          <div className="px-[10%] py-[1%]">
            <div className="flex flex-row justify-start items-center align-middle border-solid border-[#776E94] border-b-[0.1px] text-lg">
              <button className="px-14 cursor-default">
                <div
                  className="border-b-[2px] py-3.5 px-14 font-bold text-white"
                  style={{ margin: "0px" }}
                >
                  Gold
                </div>
              </button>
            </div>
            <div className="mt-2 lg:py-2 w-[100%]">
              <div className="gold-locker-card h-fit w-full  min-h-fit lg:hidden">
                <div className="flex justify-center items-center border-b border-gray-400 ">
                  <button className="font-Inter text-base px-4 w-[50%] py-3 border-b-2 pb-2.5">
                    Gold
                  </button>
                  <button className="font-Inter text-base px-4 w-[50%] py-3 false">
                    Winnings
                  </button>
                </div>
                <div className="flex flex-col p-4">
                  <div className="flex pt-4 pb-1">
                    <img
                      alt="locker"
                      src="https://cdn.myjar.app/jar-pwa/savings/utils/locker.svg"
                      width="21"
                      height="20"
                      data-nimg="1"
                    />
                    <span className="inline text-white font-bold pl-2">
                      Gold in locker
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="inline text-2xl font-bold">
                      {collectdata?.grams !== undefined
                        ? collectdata?.grams
                        : "0.0000"}
                      &nbsp;gm
                    </span>
                    <span className="rounded-lg py-1 px-[2px] bg-white bg-opacity-30 border border-opacity-50 flex justify-center items-center -rotate-90">
                      <button className="z-20 opacity-100">
                        <img
                          alt="chevron-up"
                          src="https://cdn.myjar.app/jar-pwa/savings/utils/chevron_white.svg"
                          width="24"
                          height="24"
                          className="ani-arrow rotate-180"
                        />
                      </button>
                    </span>
                  </div>
                  <button className="bg-[#2C235D] w-full rounded-[12px] py-3 px-5 mt-8 text-center text-white hover:bg-UI-80 false">
                    <span className="flex justify-center items-center">
                      <img
                        alt="invest"
                        src="https://cdn.myjar.app/jar-pwa/savings/transactions/gold_bar.svg"
                        width="24"
                        height="24"
                      />
                      <span className="pl-2 font-Inter">Invest Now</span>
                    </span>
                  </button>
                  <div className="flex justify-center items-center mt-[18px]">
                    <img
                      alt="shield"
                      src="https://cdn.myjar.app/jar-pwa/savings/utils/shield.svg"
                      width="20"
                      height="23"
                    />
                    <p className="font-Inter text-sm pl-3">
                      Bank level security by Jar
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex mx-4 flex-row justify-between lg:w-full lg:mx-auto lg:my-5 opacity-1">
                <div className="flex flex-col mx-auto align-middle lg:flex-row lg:justify-between bg-slate-900 bg-Background-light rounded-[20px] w-screen lg:w-[100%] p-5 justify-center lg:p-8 max-w-[1536px]">
                  <div className="flex justify-center py-5 lg:py-0">
                    <h3 className="font-normal my-auto align-middlen pr-8">
                      <div className="flex flex-row justify-between">
                        <BanknotesIcon className="w-8 h-8 align-middle text-white my-auto mr-3" />
                        <div className="flex flex-col">
                          <span className="inline text-white pb-2">
                            Gold in locker
                          </span>
                          <span className="inline text-base font-bold text-white">
                            {collectdata?.grams !== undefined
                              ? collectdata?.grams
                              : "0.0000"}
                            &nbsp;gm
                          </span>
                        </div>
                      </div>
                    </h3>
                    <div className="lg:flex hidden flex-row justify-between text-Text-200 border-l border-[#776E94] pl-10 ">
                      <h3 className="flex flex-col text-base pr-7 text-white">
                        Invested Value{" "}
                        <span className="text-base font-bold pt-2">
                          {" "}
                          ₹{" "}
                          {collectdata?.amount !== undefined
                            ? collectdata?.amount
                            : "0.00"}
                        </span>
                      </h3>
                      <h3 className="flex flex-col text-base pl-7 text-white">
                        Current Value
                        <span className="text-base font-bold pt-2">
                          {" "}
                          ₹ {collectdata?.presendGoldPrice}
                        </span>
                      </h3>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="bg-blue-500 text-white text-base font-semibold py-2 px-14 text-center lg:py-4 lg:px-20 rounded-[12px] justify-center hover:bg-UI-80 undefined undefined"
                  >
                    <span className="text-sm text-NewText-primary font-semibold font-Inter text-normal leading-[14px]">
                      Buy more gold
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="h-full lg:h-[66%]">
              <div className="flex bg-slate-700 rounded-[20px] h-[95%] pb-4 lg:pb-0 justify-start w-screen sm:mt-0 lg:flex-row lg:w-[100%] mx-auto lg:h-full">
                <div className="bg-slate-900 align-middle flex flex-col lg:block rounded-[20px] w-full h-full min-h-[430px] lg:h-full lg:min-w-[413px] lg:max-w-[413px] min-w-full lg:w-[40%]">
                  <div className="text-lg flex font-bold px-1.5 py-3 h-[15%]">
                    <div className="flex items-center justify-between px-2 py-3 sm:w-full">
                      <div className="flex w-full justify-between px-2">
                        <div className="flex">
                          <img
                            alt="history"
                            src="https://cdn.myjar.app/jar-pwa/savings/utils/history.svg"
                            width="25"
                            height="25"
                            className="lg:hidden mr-[6px]"
                          />
                          <h2 className="text-white">History</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-4 max-h-[330px] overflow-x-hidden overflow-y-scroll">
                    {collectdata?.data !== undefined
                      ? collectdata?.data.map((data: any, k: number) => (
                          <>
                            <div
                              className={`mx-2 rounded-lg p-4 px-6 my-3 cursor-pointer ${
                                activeid === k ? "bg-slate-700" : "bg-slate-800"
                              }`}
                              onClick={() => {
                                setactiveid(k);
                                setactivedata(data);
                              }}
                            >
                              <div className="flex gap-x-4 items-center">
                                <div>
                                  <BanknotesIcon className="w-10 text-yellow-600" />
                                </div>
                                <div className="flex justify-between w-full">
                                  <div className="text-white">
                                    <div className="">Manual Gold Purchase</div>
                                    <div className="text-slate-500 text-xs py-1">
                                      {data.grams}gms Gold
                                    </div>
                                    <div className="flex justify-between w-full">
                                      <div className="text-green-500 text-sm pb-1">
                                        Success
                                      </div>
                                      <div className="text-slate-500 text-xs py-1">
                                        {formatDate(data.created)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-white text-bold">
                                    ₹ {data.amount}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))
                      : ""}
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-col lg:overflow-y-auto w-full py-5 px-12 bg-slate-700 rounded-[20px] lg:h-[100%]">
                  <div className="my-3">
                    <div className="flex justify-normal text-base">
                      <div className="w-full flex text-white justify-between py-5 border-opacity-3 border-solid border-[#776E94] border-b-[0.2px]">
                        <div className="flex flex-col">
                          <span className="overflow-hidden truncate w-50 font-bold lg:w-full">
                            Manual Gold Purchase
                          </span>
                          <span className="overflow-hidden truncate w-40 lg:w-fit text-Text-600">
                            {activedata?.grams} gm
                          </span>
                        </div>
                        <div className="flex flex-col my-auto text-end font-bold">
                          <span>₹{activedata?.amount}</span>
                          <span className="text-Text-600 text-sm font-normal">
                            {formatDate(activedata?.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="mt-5 text-gray-300 text-lg py-4">
                        <span>Transaction Status</span>
                      </div>
                      <div className="">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div className="">
                              <CheckCircleIcon className="w-5 h-5 stroke-green-500 fill-green-500" />
                            </div>
                            <div className="text-white text-xs">
                              Payment Successfull
                            </div>
                          </div>
                          <div className="">
                            <span className="text-gray-400 text-sm font-normal">
                              {formatDate(activedata?.created)}
                            </span>
                          </div>
                        </div>
                        <div className="h-3 max-w-5 ml-2 w-[1px] bg-white"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div className="">
                              <CheckCircleIcon className="w-5 h-5 stroke-green-500 fill-green-500" />
                            </div>
                            <div className="text-white text-xs">
                              Gold order placed
                            </div>
                          </div>
                          <div className="">
                            <span className="text-gray-400 text-sm font-normal">
                              {formatDate(activedata?.created)}
                            </span>
                          </div>
                        </div>

                        <div className="h-3 max-w-5 ml-2 w-[1px] bg-white"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div className="">
                              <CheckCircleIcon className="w-5 h-5 stroke-green-500 fill-green-500" />
                            </div>
                            <div className="text-white text-xs">
                              Gold purchased
                            </div>
                          </div>
                          <div className="">
                            <span className="text-gray-400 text-sm font-normal">
                              {formatDate(activedata?.created)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="bg-blue-500 my-6 text-base font-semibold py-4 px-6 w-59 h-15 text-center rounded-lg justify-center"
                        onClick={() => invoiceDownload(activedata.id)}
                      >
                        <span className="text-sm text-NewText-primary font-semibold font-Inter text-normal leading-[14px]">
                          <div className="flex flex-row">
                            <ArrowDownTrayIcon className="w-4 h-4 stroke-white" />
                            &nbsp;
                            <span className="flex items-center text-white">
                              Download Invoice
                            </span>
                          </div>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

const Invoice = () => {
  return (
    <>
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-between py-3">
          <div className="">TAX INVOICE</div>
          <div className="">Original - Customer Copy</div>
        </div>
        <div className="py-3 text-indigo-500">
          Dikazo Solutions Private Limited
        </div>
        <div className="flex justify-between text-xs">
          <div className="">
            Third Floor, Samridhi Vasyam, D No 1, 98/9/3/23, Image Gardens Rd,
            above Axis bank
          </div>
          <div>PAN No : AAGCJ2412E</div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="">Madhapur,</div>
          <div>GSTIN : 29AAGCJ2412E1ZV</div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="">Telangana 500081</div>
          <div>CIN No : U47733KA2023PTC181719</div>
        </div>
        <div className="flex justify-between py-3 my-6 border-b-2 border-b-gray-700 border-t-2 border-t-gray-700">
          <div className="">
            <div className="text-sm text-indigo-700">Order No</div>
            <div className="text-sm text-black">01J21DZQSEGRWYNR1Z0ZJNYQFD</div>
          </div>
          <div className="">
            <div className="text-sm text-indigo-700">Date</div>
            <div className="text-sm text-black">05/07/2024</div>
          </div>
          <div className="">
            <div className="text-sm text-indigo-700">Customer ID</div>
            <div className="text-sm text-black">666447d01bc003398185806c</div>
          </div>
        </div>
        <div className="">
          <div className="text-sm text-indigo-700">Bill to</div>
          <div className="text-sm text-black">Name : Mohammed</div>
          <div className="text-sm text-black">Phone Number : +918686433748</div>
        </div>
        <div className="flex justify-between py-3 my-6 border-b-2 border-b-gray-700">
          <div className="">
            <div className="text-sm text-indigo-700">Description</div>
            <div className="text-sm text-black">
              Gold 24 Carat
              <br />
              HSN Code : 71081300
            </div>
          </div>
          <div className="">
            <div className="text-sm text-indigo-700">Grams*</div>
            <div className="text-sm text-black">0.0012</div>
          </div>
          <div className="">
            <div className="text-sm text-indigo-700">Rate Per Gram</div>
            <div className="text-sm text-black">₹ 7529.37</div>
          </div>
          <div className="">
            <div className="text-sm text-indigo-700">Total Amount</div>
            <div className="text-sm text-black">₹ 9.72</div>
          </div>
        </div>
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "50%" }}></div>
          <div style={{ width: "50%" }}>
            <div className="py-5 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm underline pb-6">Applied Tax</div>
                  <div className="">(1.5% SGST Tax+1.5% CGST Tax)</div>
                </div>
                <div className="">₹ 0.28</div>
              </div>
            </div>
            <div className="py-6 border-b-2 border-b-gray-700 border-t-2 border-t-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl text-indigo-500">
                    Total Invoice Value
                  </div>
                </div>
                <div className="">₹ 10.00</div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-3">
          <b>Declaration</b>
          <div className="">
            We declare that the above quantity of goods are kept by the seller
            in a safe vault on behalf of the buyer. It can be delivered in
            minted product as per the Terms & Conditions.
          </div>
        </div>
        <div className="py-3">
          <b>Declaration</b>
          <div className="">
            The gold grams you own are calculated by dividing the amount paid
            net of GST by the gold rate and rounded down to 4 decimal places.
            For example, .00054 grams will be rounded down to .0005 grams.
          </div>
        </div>
        <div className="py-3">
          <div className="">(E & O.E.)</div>
          <div className="">(Subject to Realization)</div>
        </div>
        <div className="flex justify-end text-center">
          <div className="">
            For Dikazo Solutions Private Limited
            <br />
            (Authorized Signatory)
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction;
