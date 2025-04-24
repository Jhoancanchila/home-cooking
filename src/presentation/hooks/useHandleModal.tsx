import { useState } from "react";

export const useHandleModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleOpenModal = ( mode: "login" | "signup" ) => {
    setMode(mode);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return { isOpen, handleOpenModal, handleCloseModal, mode, setMode };
};