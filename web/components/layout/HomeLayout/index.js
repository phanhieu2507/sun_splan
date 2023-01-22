import React from "react";
import BHeader from "~/components/layout/BHeader";
import BSidebar from "~/components/layout/BSidebar";
import Navbar from "~/components/layout/Navbar";

export default function HomeLayout({ children, userInfo, active }) {
  return (
    <div>
      <div className="navbar-container w-full fixed left-0 z-10">
        <Navbar />
      </div>
      <div className="flex w-full">
        <div className="b-sidebar-container fixed left-0 top-0 mt-16 z-20">
          <BSidebar />
        </div>
        <div className="ml-[224px] mt-16 w-full ">
          <div>
            <BHeader userInfo={userInfo} active={active} />
          </div>
          <div
            className="bg-[#E5E5E5] w-full flex px-2 gap-2 overflow-y-hidden"
            style={{ height: "calc(100vh - 246px)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}