import React, { useEffect, useState } from "react";
import HomeLayout from "~/components/layout/HomeLayout";
import { useRouter } from "next/router";
import ky from "ky";
import moment from "moment";
import { Button } from "antd";

import { PlanProgress } from "~/components/C3components";
import Icon from "~/components/Icon";
import C3Status from "~/components/C3components/C3Status";
import C3FutureGoal from "~/components/C3components/C3FutureGoal";
import C3Achievement from "~/components/C3components/C3Achievement";

import {
  getAllMilestoneByUserId,
  getMilestoneThisMonth,
  getMilestoneById,
} from "~/utils/C3/plan";
import Roadmap from "~/components/C3components/Roadmap";

class parseTargetDetails {
  constructor(obj) {
    this.target_id = obj.target_id;
    this.category_name = obj.category.name;
    this.type = obj.type;
    this.test_content =
      obj.type === 0
        ? {
            ...obj.test_content,
            contest_name: obj.test_content.contest.contest_name,
            pass_score: obj.test_content.contest.pass_score,
            score_eachs: obj.test_content.contest.contest_score_eachs.map(
              (value) => {
                for (let each of obj.test_content.score_eachs) {
                  if (each.part_name === value.name) {
                    return { ...each, max_score: value.max_score };
                  }
                }
              }
            ),
          }
        : null;
    this.free_content =
      obj.type === 1
        ? {
            content: obj.free_content.content,
            result: obj.free_content.result,
          }
        : null;
  }
}

const NaiteishaPlan = () => {
  const router = useRouter();
  const userId = parseInt(useRouter().query.userId);
  const [userInfo, setUserInfo] = useState({});
  const [milestone, setMilestone] = useState({
    plan: null,
    target: null,
  });

  const changeMilestone = async (id) => {
    const data = await getMilestoneById(id);
    setMilestone(data);
  };

  useEffect(() => {
    const callAPI = async () => {
      try {
        const userRes = await ky
          .get(`/api/user/naiteisha?user_id=${userId}`)
          .json();
        setUserInfo(userRes.data);
      } catch {
        setUserInfo({});
      } finally {
      }
    };

    const getMilestoneDataThisMonth = async () => {
      const data = await getMilestoneThisMonth(userId);
      setMilestone(data);
    };

    callAPI();
    getMilestoneDataThisMonth();
  }, [userId, router]);

  return (
    <HomeLayout userInfo={userInfo} active={"学習目標"}>
      <div className="wrapper overflow-y-auto w-full bg-white my-3 rounded-[20px] p-8">
        <div className="flex justify-between">
          <h1 className="font-medium">学習目標</h1>
          <Button
            className="float-right mr-16 rounded-md"
            type="primary"
            icon={<Icon name="plus-circle" color={"white"} size={16} />}
            onClick={() => router.push("/naiteishaplan/create-target")}
          >
            <span className="ml-2">目標を作成する</span>
          </Button>
        </div>

        <Roadmap
          userId={userId}
          handleChange={(id) => changeMilestone(id)}
          milestone={milestone}
        />

        <div className="my-4 float-right mr-32">
          {milestone.target && (
            <C3Status
              user={userInfo}
              target={milestone.target}
              handleChange={(value) => {
                setMilestone((prev) => {
                  return {
                    ...prev,
                    target: {
                      ...prev.target,
                      is_completed: value,
                    },
                  };
                });
              }}
            />
          )}
        </div>

        <h2 className="mt-20 ml-10">
          {milestone.target
            ? moment(milestone.target.date_of_target).format("YYYY/MM")
            : "yyyy/MM"}
        </h2>
        <div className="flex flex-row justify-center mt-20 h-fit">
          <div className="w-full flex justify-center">
            <C3FutureGoal
              target_details={
                milestone.target
                  ? milestone.target.target_details.map(
                      (val) => new parseTargetDetails(val)
                    )
                  : []
              }
              targetId={milestone?.target?.id}
            />
          </div>
          <div className="border-solid border-l-[0.25px] border-x-0 border-y-0 flex justify-center w-full">
            <C3Achievement
              target_details={
                milestone.target
                  ? milestone.target.target_details.map(
                      (val) => new parseTargetDetails(val)
                    )
                  : []
              }
              targetId={milestone?.target?.id}
            />
          </div>
        </div>
        <div className="grid justify-items-center mt-16 mb-24">
          <div>
            <PlanProgress
              editIcon={true}
              planData={milestone.plan}
            ></PlanProgress>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default NaiteishaPlan;
