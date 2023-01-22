import Head from "next/head";
import React, { useEffect, useState } from "react";
import BackButton from "~/components/BackButton";
import AchievementPost from "~/components/C1-Post/AchievementPost";
import ManualPost from "~/components/C1-Post/ManualPost";
import ProgressAchievePost from "~/components/C1-Post/ProgressAchievePost";
import PlanSetPost from "~/components/C1-Post/PlanSetPost";
import { useRouter } from "next/router";
import Comment from "~/components/C1-1components/comment/Comment";
import CommentCreate from "~/components/C1-1components/comment/CommentCreate";
import Link from "next/link";
import HomeLayout from "~/components/layout/HomeLayout";
import { getAllCommentsByPostId } from "~/utils/comment";
import ky from "ky";
import { getPostById } from "~/utils/post";

const NUMBER_OF_INITIAL_COMMENTS = 4;
const PostDetail = () => {
  const router = useRouter();
  const { id, userId } = router.query;
  const [currentUser, setCurrentUser] = useState({avatar: "#"});
  const [userInfo, setUserInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [commentsMaxLength, setCommentsMaxLength] = useState(0);
  const [limitCommentsDisplayed, setLimitCommentsDisplayed] = useState(
    NUMBER_OF_INITIAL_COMMENTS
  );
  const [post, setPost] = useState();

  console.log("CHANGE CHANGE CHANGE");

  console.log(comments);
  const getComments = async () => {
    const data = await getAllCommentsByPostId(id, limitCommentsDisplayed);
    setComments(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
      const commentsMax = await getAllCommentsByPostId(id);
      setCommentsMaxLength(commentsMax.length);

      const postData = await getPostById(id);
      setPost(postData);
      console.log("postData", postData);

      const userRes = await ky
        .get(`/api/user/naiteisha?user_id=${userId}`)
        .json();
      setUserInfo(userRes.data);
      console.log("USER RESPONSE", userRes);
    };
    fetchData();
  }, [id, userId]);

  useEffect(() => {
    const showComment = async () => {
      const data = await getAllCommentsByPostId(id, limitCommentsDisplayed);
      setComments(data);
    };
    showComment();
  }, [limitCommentsDisplayed, id]);

  const readmoreComment = async () => {
    setLimitCommentsDisplayed((prev) => prev + 4);
  };

  console.log(limitCommentsDisplayed, commentsMaxLength);
  const showPost = (post) => {
    if (!post) return;
    if (post.type === 0) {
      return (
        <ManualPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
        />
      );
    } else if (post.type === 1) {
      return (
        <AchievementPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
        />
      );
    } else if (post.type === 2) {
      return (
        <PlanSetPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
        />
      );
    } else {
      return (
        <ProgressAchievePost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
        />
      );
    }
  };
  return (
    <div>
      <Head>
        <title>PostDetail</title>
      </Head>
      <HomeLayout userInfo={userInfo}>
        <div
          className="bg-[#E5E5E5] w-full overflow-y-scroll"
          style={{ height: "calc(100vh - 246px)" }}
        >
          <div className="flex flex-col bg-white mt-2 p-5 pt-3 rounded-lg">
            <Link href={`/home/${post && post.userId}`}>
              <a className="w-fit">
                <BackButton />
              </a>
            </Link>
            <div className="px-8">
              <div className="mb-2">{showPost(post)}</div>
              <CommentCreate
                imageUrl={currentUser.avatar}
                getComments={getComments}
                setCommentsMaxLength={setCommentsMaxLength}
              />

              {comments.length !== 0 ? (
                <div>
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      imageUrl={comment.avatar}
                      commentId={comment.id}
                      content={comment.content}
                      name={comment.japaneseFullname}
                      userId={comment.userId}
                      createdAt={comment.createdAt}
                      getComments={getComments}
                      setCommentsMaxLength={setCommentsMaxLength}
                    />
                  ))}
                  {commentsMaxLength > 4 &&
                    comments.length < commentsMaxLength && (
                      <div
                        style={{
                          borderBottom: "1px solid #a4cff1",
                        }}
                        className="text-center py-3"
                      >
                        <span
                          className="font-bold cursor-pointer hover:text-primary transition-all"
                          onClick={() => {
                            readmoreComment();
                          }}
                        >
                          コメントをもっと見る(
                          <span>{commentsMaxLength - comments.length}</span>)
                        </span>
                      </div>
                    )}
                </div>
              ) : (
                <div className="pt-3 text-center text-xl font-bold">
                  まだコメントはありません
                </div>
              )}
            </div>
          </div>
        </div>
      </HomeLayout>
    </div>
  );
};

export default PostDetail;
