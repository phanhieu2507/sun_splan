import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { createComment, updateComment } from "~/utils/comment";
import Button from "../../Button";
import Icon from "../../Icon";

const { TextArea } = Input;

const CommentInput = ({
  content,
  commentId,
  isEditForm,
  setIsEditingStatus,
  getComments,
  handleDisplayContent,
  setCommentsMaxLength,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [inputContent, setInputContent] = useState(content);

  const handleCreateComment = async () => {
    const userId = JSON.parse(localStorage.getItem("currentUser")).id;
    await createComment(id, userId, inputContent);
    getComments();
    setCommentsMaxLength((prev) => prev + 1);
    setInputContent("");
  };

  const handleEditComment = async (id) => {
    await updateComment(inputContent, id);
    getComments();
    handleDisplayContent();
    setIsEditingStatus(false);
  };
  return (
    <div className={`relative max-w-full ${isEditForm ? "" : "flex gap-5"}`}>
      <div className="max-w-full flex flex-col p-2 w-full border-solid border border-primary rounded-lg">
        <TextArea
          className="py-2 px-1 whitespace-pre-wrap"
          maxLength={500}
          autoSize={{ minRows: 1, maxRows: 8 }}
          placeholder="ここにコメントを書く"
          bordered={false}
          value={inputContent}
          onChange={(e) => {
            setInputContent(e.target.value);
          }}
        />
        <div className="ml-auto flex space-x-3 group-icon">
          <Icon name="smile-face" color="disabled" />
          <Icon name="image" color="disabled" />
        </div>
      </div>
      {!isEditForm && (
        <div
          className="absolute cursor-pointer right-0 top-[50%] translate-x-[150%] translate-y-[-50%]"
          onClick={() => {
            handleCreateComment();
          }}
        >
          <Icon name="send" size={48}></Icon>
        </div>
      )}
      {isEditForm && (
        <div className="mt-3 flex justify-end gap-3">
          <Button
            type="border"
            onClick={() => {
              setIsEditingStatus(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            type="fill"
            onClick={() => {
              handleEditComment(commentId);
            }}
          >
            更新
          </Button>
        </div>
      )}
    </div>
  );
};
export default React.memo(CommentInput);
