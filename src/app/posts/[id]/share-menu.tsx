import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
} from "next-share";

interface ShareMenuProps {
  showShareMenu: boolean;
  shareUrl: string;
  copyToClipboard: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({
  showShareMenu,
  shareUrl,
  copyToClipboard,
}) => {
  if (!showShareMenu) return null;

  return (
    <div className='absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TelegramShareButton url={shareUrl}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>
        <button
          onClick={copyToClipboard}
          className='text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded'
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareMenu;
