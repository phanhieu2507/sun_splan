import React, { useCallback, useEffect, useState } from "react";
import AchievementPost from "~/components/C1-Post/AchievementPost";
import ManualPost from "~/components/C1-Post/ManualPost";
import ProgressAchievePost from "~/components/C1-Post/ProgressAchievePost";
import PlanSetPost from "~/components/C1-Post/PlanSetPost";
import C1CreatePost from "~/components/C1CreatePost";
import C1CurrentSkill from "~/components/C1CurrentSkill";
import HomeLayout from "~/components/layout/HomeLayout";
import { useRouter } from "next/router";
import ky from "ky";
import { message, Spin } from "antd";

const NaiteishaOverview = () => {
  // get route param userId
  const router = useRouter();
  let { userId } = router.query;
  userId = parseInt(userId);
  const [currentUser, setCurrentUser] = useState({
    avatar: '',
    id: null,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isZeroPost, setIsZeroPost] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [inCompletedTargets, setInCompletedTargets] = useState([]);
  const [completedTargets, setCompletedTargets] = useState([]);
  const addPost = (post) => {
    
    setPosts([post].concat(posts));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await ky.get(`/api/user/naiteisha?user_id=${userId}`).json();
        
        if (!userRes.data) {
          router.push('/');
        }
        else {
          setUserInfo(userRes.data);
        }
      } catch (err) {
        setUserInfo({});
      }
      try {
        //show loading post
        setPosts([]);
        setIsZeroPost(false);
        const res = await ky(`/api/user/posts?user_id=${userId}`).json();
        if (res.data.length === 0) {
          setIsZeroPost(true);
        }
        else {
          setPosts(res.data);
        }
        const targetRes = await ky.get(`/api/user/target?user_id=${userId}`).json();
        setInCompletedTargets(targetRes.data.inCompleted);
        setCompletedTargets(targetRes.data.completed);
      }
      catch (err) {
        // message.error("Error while fetching data from server");
      }
      finally {
        setLoading(false);
      }
    };
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    fetchData();
  }, [userId, router])

  return (
    <div>
      <HomeLayout userInfo={userInfo}>
        {loading && (
          <div className={"loading flex flex-col gap-3 justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 z-[999] "} >
            <style>
            {`
              .loading .ant-spin-text {
                color: #fff;
              }
              .loading .ant-spin-dot-item {
                background-color: white;
              }
            `}
          </style>
            <Spin size="large" />
            <div className="text-white text-lg"> 読み込んでいます... </div>
          </div>
        )}
        <div className="overflow-y-auto">
          <div className="spacing py-1"></div>
          <C1CurrentSkill title={"次の目標"} targets={inCompletedTargets} />
          <C1CurrentSkill title={"現状"} targets={completedTargets} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="spacing py-1"></div>
          {
            userInfo?.id === currentUser.id && (
              <C1CreatePost currentUser={currentUser} addPost={addPost} />
            )
          }
          <div className="flex flex-col justify-center items-center pb-2 w-full gap-2">
            {
              isZeroPost
              && 
              <div className="zero-post mt-4 font-bold text-xl">表示できるポストがまだありません。</div>
            }
            {posts.map((post) => {
              if (post.type === 0) {
                return <ManualPost {...post} key={post.id} />;
              }
              if (post.type === 1) {
                return (
                  <AchievementPost {...post} key={post.id} isShowDetail={false}  />
                );
              }
              if (post.type === 2) {
                return <PlanSetPost {...post} key={post.id} isShowDetail={false} />;
              }
              if (post.type === 3) {
                return (
                  <ProgressAchievePost
                    {...post}
                    key={post.id}
                  />
                );
              }
            })}
          </div>
        </div>
      </HomeLayout>
    </div>
  );
};

export default NaiteishaOverview;
