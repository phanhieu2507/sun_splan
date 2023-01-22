import Image from "next/image";
import defaultAvatar from "~/assets/images/default-avatar.png";

const UserItem = ({ avatar, userName, graduationYear }) => {
  return (
    <div className="flex items-center hover:bg-gray-100 p-2 cursor-pointer">
      <div className="w-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          className="rounded-full object-cover w-[48px] h-[48px]" 
          alt="avatar" 
          src={
            avatar ? 
            (avatar.startsWith('images/') ? "/" : "") + avatar 
            : 
            defaultAvatar.src
          } 
        />
      </div>
      <div className="pl-2 w-[calc(100%-48px)]">
        <h4 className="text-xs text-default font-normal truncate w-full">
          {userName}
        </h4>
        <span className="text-xs font-normal text-disabled">
          {graduationYear}
        </span>
      </div>
    </div>
  );
};

export default UserItem;
