import { FC, ReactNode } from "react";
// Assets
import RollerIcon from "../../../assets/svg/Services/RollerIcon.jsx";
import MonitorIcon from "../../../assets/svg/Services/MonitorIcon.jsx";
import BrowserIcon from "../../../assets/svg/Services/BrowserIcon.jsx";
import PrinterIcon from "../../../assets/svg/Services/PrinterIcon.jsx";

type IconType = "roller" | "monitor" | "browser" | "printer";

interface ServiceBoxProps {
  icon: IconType;
  title: string;
  subtitle: string;
}

const ServiceBox: FC<ServiceBoxProps> = ({ icon, title, subtitle }) => {
  let getIcon: ReactNode;

  switch (icon) {
    case "roller":
      getIcon = <RollerIcon />;
      break;
    case "monitor":
      getIcon = <MonitorIcon />;
      break;
    case "browser":
      getIcon = <BrowserIcon />;
      break;
    case "printer":
      getIcon = <PrinterIcon />;
      break;
    default:
      getIcon = <RollerIcon />;
      break;
  }

  return (
    <div className="flex flex-col w-full items-center md:items-start">
      <div className="flex justify-center md:justify-start">
        {getIcon}
      </div>
      <h2 className="w-full max-w-[300px] mx-auto md:mx-0 py-[40px] md:py-[20px] text-xl font-extrabold text-center md:text-left">
        {title}
      </h2>
      <p className="w-full max-w-[300px] mx-auto md:mx-0 text-sm text-center md:text-left">
        {subtitle}
      </p>
    </div>
  );
};

export default ServiceBox;