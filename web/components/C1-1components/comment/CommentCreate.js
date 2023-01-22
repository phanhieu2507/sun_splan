import Image from "next/image";
import React from "react";
import DefaultAvatar from "~/assets/images/default-avatar.png";
import CommentInput from "./CommentInput";

const CommentCreate = ({ imageUrl, getComments, setCommentsMaxLength }) => {
  return (
    <div
      className="flex gap-5 p-5"
      style={{
        borderTop: "1px solid #a4cff1",
        borderBottom: "1px solid #a4cff1",
      }}
    >
      <div className="h-12 w-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl ? imageUrl : DefaultAvatar}
          className="rounded-full object-cover w-12 h-12"
          alt="avatar"
        />
      </div>
      <div className="min-w-[75%]">
        <CommentInput
          isEditForm={false}
          getComments={getComments}
          setCommentsMaxLength={setCommentsMaxLength}
        />
      </div>
    </div>
  );
};
export default React.memo(CommentCreate);
