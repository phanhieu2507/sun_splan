import Image from "next/image";
import React, { memo, useEffect, useRef, useState } from "react";
import DefaultAvatar from "~/assets/images/default-avatar.png";
import { deleteComment } from "~/utils/comment.js";
import CommentInput from "./CommentInput.js";
import { Modal } from "antd";
import moment from "moment";
import Icon from "../../Icon";
import "moment/locale/ja";
import { ExclamationCircleOutlined } from "@ant-design/icons";
moment.locale("ja");
const contentLineHeight = 1.25;
const Comment = ({
  imageUrl,
  commentId,
  content,
  name,
  userId,
  getComments,
  createdAt,
  setCommentsMaxLength,
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isReadMoreContentBtn, setIsReadMoreContentBtn] = useState(false);
  const contentRef = useRef();

  const handleDisplayContent = () => {
    if (!contentRef.current) return;
    const commentContent = contentRef.current.textContent.trim();
    if (commentContent.length > 300) {
      contentRef.current.textContent = commentContent.substring(0, 300);
      setIsReadMoreContentBtn(true);
    }
  };
  useEffect(() => {
    handleDisplayContent();
  }, [isEditingStatus]);

  const readMoreContent = () => {
    contentRef.current.textContent = content;
    setIsReadMoreContentBtn(false);
  };

  const handleDeleteCommentById = async (id) => {
    await deleteComment(id);
    getComments();
    setCommentsMaxLength((prev) => prev - 1);
    setModal2Visible(false);
  };

  const isCurrentUser = () => {
    if (typeof window !== "undefined") {
      return userId === -(-JSON.parse(localStorage.getItem("currentUser"))?.id);
    }
  };

  const [modal2Visible, setModal2Visible] = useState(false);
  const formatDateTime = (createdAt) => {
    if (
      moment() - moment(createdAt?.substring(0, 19).replace("T", " ")) >
      moment.duration(1, "d")
    ) {
      return moment(createdAt?.substring(0, 19).replace("T", " "))
        .add(moment.duration(7, "h"))
        .format("YYYY/MM/DD HH:MM");
    }
    return moment(createdAt?.substring(0, 19).replace("T", " "))
      .add(moment.duration(7, "h"))
      .fromNow();
  };
  return (
    <div
      className="flex gap-5 px-5 py-3 min-h-[120px]"
      style={{
        borderBottom: "1px solid #a4cff1",
      }}
    >
      <Modal
        centered
        okText="はい"
        cancelText="いいえ"
        visible={modal2Visible}
        onOk={() => handleDeleteCommentById(commentId)}
        onCancel={() => setModal2Visible(false)}
      >
        <div className="flex items-center gap-3">
          <ExclamationCircleOutlined
            className="text-orange-400"
            style={{ fontSize: "22px" }}
          />
          <span className="font-bold text-lg">
            コメントを削除してもよろしいですか?
          </span>
        </div>
      </Modal>
      <div className="h-12 w-12">
        <Image
          src={imageUrl ? imageUrl : DefaultAvatar}
          width={48}
          height={48}
          className="rounded-full object-cover"
          alt="avatar"
        />
      </div>
      <div className="w-[75%]">
        <h4 className="font-bold mb-4">{name}</h4>
        {!isEditingStatus && (
          <>
            <span
              className={`leading-[${contentLineHeight}rem]`}
              ref={contentRef}
            >
              {content}
            </span>
            {isReadMoreContentBtn && (
              <span
                style={{ border: "1px solid #ccc" }}
                className="ml-2 px-2 inline-block cursor-pointer rounded-md transition-all"
                onClick={() => {
                  readMoreContent();
                }}
              >
                ... もっと見る
              </span>
            )}
          </>
        )}
        {isEditingStatus && (
          <CommentInput
            content={content}
            commentId={commentId}
            isEditForm={true}
            setIsEditingStatus={setIsEditingStatus}
            getComments={getComments}
            handleDisplayContent={handleDisplayContent}
          />
        )}
      </div>
      <div className="ml-auto flex flex-col justify-between items-end">
        <span>{formatDateTime(createdAt)}</span>
        {isCurrentUser() && !isEditingStatus && (
          <div className="flex gap-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                setModal2Visible(true);
              }}
            >
              <Icon name="delete" color="danger" />
            </div>

            <div
              className="cursor-pointer"
              onClick={() => {
                setIsEditingStatus(true);
              }}
            >
              <Icon name="pencil-squared" color="primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(Comment);
