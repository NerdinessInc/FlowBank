"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import bg from "@/assets/images/1661.jpg";
import appstore from "@/assets/images/appstore.png";
import playstore from "@/assets/images/playstore.png";
import { Globe, Phone, Mail, Smartphone } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const bgImage =
    "https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
     <main
      className="flex flex-col h-full sm:h-screen justify-center p-[32px] sm:px-[52px] sm:py-[32px]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* <Image
        src={bg} // or src="/images/1661.jpg" if in public
        alt="Background"
        fill
        className="object-cover"
        priority // optional: load early since it's hero bg
        quality={85} // optional
      /> */}
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col h-full sm:h-screen ">
        <div className="flex justify-between items-center sm: mb-[32px]">
          {" "}
          {/* only for small screen, add mb-32px and make it flex-col */}
          <div className=" flex items-center gap-[8px] text-[18px] font-bold p-2 rounded-md">
            <Image src={logo} alt="logo" width={80} />
          </div>
          <div className="text-[20px] text-white pb-1 border-b-4 border-[#9F1FEF]">
            {" "}
            <span className="text-[#9F1FEF] font-bold text-[32px] ">
              24
            </span>{" "}
            Hours, Everyday!
          </div>
        </div>
        <div className="flex-grow">{children}</div>

        <footer
          className="flex flex-col 
  gap-[12px] 
  justify-center 
  items-center 
  sm:mt-[42px] 
  sm:flex-row 
  sm:gap-[20px] 

  md:gap-[42px]"
        >
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl  py-3 px-6 text-white shadow-xl w-[320px] mt-[38px] sm:mt-[0]">
            <p className="text-[13px] opacity-90 mb-2">
              Bank anytime, anywhere. Available on both Android and iOS.
            </p>
            <div className="flex gap-4">
              <a href="#" className="">
                <Image src={appstore} width={"100%"} alt="appstore" />
              </a>
              <a href="#" className="">
                <Image src={playstore} width={"100%"} alt="playstore" />
              </a>
            </div>
          </div>
          {/* <div className="bg-white/10 w-1 rounded-sm h-[80px]"></div>
        <div className="p-[18px] bg-[#9f1fefa6] w-[250px] h-[100px] rounded-lg border-2 text-white text-[14px]"></div> */}
          <div
            className="bg-white/10 w-1 rounded-sm h-[80px]
          hidden
          sm:block
          "
          ></div>
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl py-3 px-6 text-white shadow-xl flex flex-col gap-[12px] w-[320px]">
            <div className="flex items-center gap-[12px] text-[14px]">
              <Phone size={14} /> Give us a call on 08068965846
            </div>
            <div className="flex items-center gap-[12px] text-[14px]">
              <Mail size={14} /> info@nomasebank.com
            </div>
            <div className="flex items-center gap-[12px] text-[14px]">
              <Globe size={14} />{" "}
              <a href="https://nomasebank.com" target="_blank">
                nomasebank.com
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
