import { Outlet } from "react-router-dom";

import { TopBar } from "./TopBar";
import { Overlay } from "./Overlay";
import { Sidebar } from "./sidebar/Sidebar";
import { DashboardProvider } from "./Provider";

const style = {
  container: "bg-gray-100 h-screen overflow-hidden relative",
  mainContainer:
    "flex flex-col h-screen pl-0 w-full lg:space-y-4 lg:w-[calc(100%-16rem)]",
  main: "h-screen overflow-auto pb-36 pt-8 px-2 md:pb-8 md:pt-4 md:px-8 lg:pt-0",
};

export function DashboardLayout() {
  return (
    <DashboardProvider>
      <div className={style.container}>
        <div className="flex items-start">
          <Overlay />
          <Sidebar mobileOrientation="start" />
          <div className={style.mainContainer}>
            <TopBar />
            <main className={style.main}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
