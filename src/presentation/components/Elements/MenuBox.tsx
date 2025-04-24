import { FC } from "react";

interface ProjectBoxProps {
  img: string;
  title: string;
  text: string;
  action?: () => void;
}

const ProjectBox: FC<ProjectBoxProps> = ({ img, title, text, action }) => {
  return (
    <div className="w-full mt-[30px]">
      <button 
        className="bg-transparent border-0 outline-none p-0 m-0 cursor-pointer"
        onClick={action ? () => action() : undefined}
      >
        <img 
          className="w-full h-auto my-[20px] rounded-lg hover:opacity-50 transition-opacity duration-300 p-0 outline-none m-0" 
          src={img} 
          alt="project"
        />
      </button>
      <h3 className="text-xl font-extrabold pb-[10px]">{title}</h3>
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default ProjectBox;