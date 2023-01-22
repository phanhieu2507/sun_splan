import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ky from "ky";
import moment from "moment";

import EditPlanShow from "~/components/C3components/Target-Achievement/EditPlan";
import { PlanProgress } from "~/components/C3components";
import HomeLayout from "~/components/layout/HomeLayout";

import { getMilestoneById } from "~/utils/C3/plan";

const EditPlan = () => {
  const router = useRouter();
  const targetId = parseInt(useRouter().query.targetId);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [milestone, setMilestone] = useState({
    target: null,
    plan: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userId = parseInt(
          JSON.parse(localStorage.getItem('currentUser')).id
        );
        const userRes = await ky
          .get(`/api/user/naiteisha?user_id=${userId}`)
          .json();
        if (!userRes.data){
          router.push('/');
        } else {
          setUserInfo(userRes.data);
        }
      } catch (err) {
        console.log(err);
        setUserInfo({});
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    const callAPI = async () => {
      try {
        setIsLoading(true);
        const data = await getMilestoneById(targetId);
        if (!data){
          //Need to consider more

        } else {
          setMilestone(data);
        }
      } catch (err) {
        setMilestone({ plan: null, target: null });
      } finally {
        setIsLoading(false);
      }
    }
    callAPI();
  }, [targetId]);

  return (
    <HomeLayout userInfo={userInfo} active={"学習目標"}>
      <div className="wrapper overflow-y-auto w-full">
        <div className="bg-white my-3 mx-2 rounded-[20px] pl-8 pt-8 pb-8">
          { milestone && 
            <h2 className="mt-20 ml-16">
              { moment(milestone?.target?.date_of_target).format('YYYY/MM') }
            </h2>
          }

          <EditPlanShow target={milestone?.target} />

          <h3 className="mb-6 text-4xl">計画進捗</h3>
          <PlanProgress type={"edit"} planData={milestone}></PlanProgress>
        </div>
      </div>
    </HomeLayout>
  );
};

export default EditPlan;
