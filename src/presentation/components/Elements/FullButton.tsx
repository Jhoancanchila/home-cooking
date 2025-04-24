import { FC } from "react";

interface FullButtonProps {
  title: string;
  action?: () => void;
  border?: boolean;
}

const FullButton: FC<FullButtonProps> = ({ title, action, border = false }) => {
  return (
    <button
      className={`w-full p-[15px] rounded-2xl transition ease-in-out duration-300  cursor-pointer outline-none
       ${
        border 
          ? "border border-[#707070] bg-transparent text-[#707070] hover:border-[#7620ff] hover:text-[#7620ff]" 
          : "border border-[#7620ff] bg-[#7620ff] text-white hover:bg-[#580cd2]"
      }`}
      onClick={action}
    >
      {title}
    </button>
  );
};

export default FullButton;

