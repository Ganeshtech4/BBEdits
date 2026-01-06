"use client";

import React from "react";
import { Modal, Box } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem?: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
};

const CustomModal: React.FC<Props> = ({ open, setOpen, setRoute, component: Component, refetch }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableAutoFocus
      className="backdrop-blur-sm"
    >
      <Box
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[500px] m-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 outline-none animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          aria-label="Close modal"
        >
          <IoCloseOutline 
            size={24} 
            className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" 
          />
        </button>

        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
