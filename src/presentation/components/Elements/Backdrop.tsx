import { FC } from 'react';

interface BackdropProps {
  toggleSidebar: (isOpen: boolean) => void;
}

const Backdrop: FC<BackdropProps> = ({ toggleSidebar }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-40"
      onClick={() => toggleSidebar(false)}
    />
  );
};

export default Backdrop;