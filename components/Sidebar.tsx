import { Dispatch, SetStateAction } from "react";

export const Sidebar = ({
  onClose,
  Accounts,
  setMain
}: {
  onClose: () => void;
  Accounts: { account: number; public_key: string; private_key: string }[];
  setMain: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-black shadow-lg z-50 transition-transform overflow-y-scroll">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <span className="font-bold text-white">Switch Accounts</span>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-white text-lg hover:text-red-500 focus:outline-none"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col items-center space-y-4 mt-4">
        {Accounts.map((acc) => (
          <div
            key={acc.public_key}
            className="m-1 h-10 w-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold"
            onClick={() => setMain(acc.account)}
          >
            {acc.account}
          </div>
        ))}
      </div>
    </div>
  );
};
