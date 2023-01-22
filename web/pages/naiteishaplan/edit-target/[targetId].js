import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useRouter } from "next/router";
import ky from "ky";
import moment from "moment";

import HomeLayout from "~/components/layout/HomeLayout";
import { PlanProgress } from "~/components/C3components";
import Button from "~/components/Button";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, notification, message } from "antd";

const { confirm } = Modal;

import { getMilestoneById } from "~/utils/C3/plan";
import Loading from "~/components/C3components/Loading";
import EditTargetShow from "~/components/C3components/Target-Achievement/EditTarget";

const openNotification = (props) => {
  const key = `open${Date.now()}`;
  notification.open({
    type: props.type,
    message: props.title,
    description: props.description,
    key,
    duration: 2,
  });
};

const msg = {
  c3213: "この項目は必須です",
  c3403: "保存完了しました",
  c3404: "変更内容が保存されません。",
  saveError: "保存できませんでした",
  cancelContent: "よろしいですか？",
}

const initialState = {
  milestone: {
    target: null,
    plan: null,
  },
  canSubmit: true,
  hasChanged: false,
}

const reducer = (state, action) => {
  switch(action.type){
    case "backToInit":
      return initialState;
    case "initMilestone":
      const milestone = action.payload;
      return {
        ...state, milestone: milestone,
      }
    case "addTargetDetail":
      return {
        ...state, 
        milestone: {
          ...state.milestone,
          target: {
            ...state.milestone.target,
            target_details: [...state.milestone.target.target_details, { ...action.payload, new: true }],
          }
        },
        hasChanged: true,
      }
    case "deleteTargetDetail":
      return {
        ...state,
        milestone: {
          ...state.milestone,
          target: {
            ...state.milestone.target,
            target_details: state.milestone.target.target_details.map(
              (targetDetail) => 
              targetDetail.id === action.payload.id ? { ...targetDetail, delete: true } : targetDetail
            )
          }
        },
        hasChanged: true,
      }
    case "editTargetDetail":
      return {
        ...state,
        milestone: {
          ...state.milestone,
          target: {
            ...state.milestone.target,
            target_details: state.milestone.target.target_details.map(
              (targetDetail) =>
              targetDetail.id === action.payload.id ? action.payload : targetDetail
            )
          }
        },
        hasChanged: true,
      }
    case "check":
      const canSubmit = state.milestone.target.target_details.every((targetDetail) => {
        if (targetDetail?.delete) {
          return true;
        } else {
          if (targetDetail.type === 0){
            return targetDetail.test_content.score_eachs.every((part) => !part.error);
          }
          else if (targetDetail.type === 1){
            return !targetDetail.free_content.error;
          }
        }
      })
      return {
        ...state,
        canSubmit: canSubmit,
      };
    default:
      return state;
  }
}

const EditTarget = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const targetId = parseInt(useRouter().query.targetId);
  const [userInfo, setUserInfo] = useState({});

  const [state, dispatch] = useReducer(reducer, initialState);

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
        console.error(err);
        setUserInfo({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    const callAPI = async () => {
      try {
        setIsLoading(true);
        const data = await getMilestoneById(targetId);
        if (!data) {
          //Need to consider more
          
        } else {
          dispatch({ type: 'initMilestone', payload: data });
          dispatch({ type: 'check' });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: 'backToInit' });
      } finally {
        setIsLoading(false);
      }
    }
    callAPI();
  }, [targetId])

  const handleCancel = useCallback(() => {
    if (state?.hasChanged){
      confirm({
        title: msg.c3404,
        style: { top: 300 },
        icon: <ExclamationCircleOutlined/>,
        content: msg.cancelContent,
        okText: 'はい',
        cancelText: 'いいえ',
        onOk(){
            router.push(`/naiteishaplan/` + userInfo.id)
        },

        onCancel(){
          return;
        }
      });
    } else {
      router.push(`/naiteishaplan/` + userInfo.id)
    }
  }, [state?.hasChanged, router, userInfo]); 

  const handleSubmit = useCallback( async () => {
    if(state?.canSubmit){
      const hide = message.loading("保存中...", 0)
      const json = await ky
        .put(`/api/target/editTarget`, { json: { target: state.milestone.target } })
        .json()
      if(json.success){
        hide()
        openNotification({
          type: 'success',
          title: '保存成功',
          description: msg.c3403,
        })
        router.push(`/naiteishaplan/` + userInfo.id)
      } else {
        hide()
        openNotification({
          type: 'error',
          title: '保存失敗',
          description: msg.saveError,
        })
      }
    } else {
      openNotification({
        type: 'error',
        title: '保存失敗',
        description: msg.c3213,
      })
    }
  }, [state, router, userInfo]);


  return (
    <HomeLayout userInfo={userInfo} active={"学習目標"}>
      <div className="wrapper overflow-y-auto w-full">
        <div className="bg-white my-3 mx-2 rounded-[20px] pl-8 pt-8 pb-8">
          { state?.milestone && 
            <h2 className="mt-20 ml-16">
              { moment(state?.milestone?.target?.date_of_target).format('YYYY/MM') }
            </h2>
          }
                
          <EditTargetShow target={state?.milestone?.target} state={state} dispatch={dispatch}/>

          <div className="flex justify-center mt-16">
            <div>
              {
                state?.milestone && 
                  <PlanProgress 
                    editIcon={false} 
                    planData={state?.milestone?.plan} 
                  />
              }
              {
                !state?.milestone && 
                  <div className="text-xl">読み込み中...</div>
              }
            </div>
          </div>
          <div className="mt-14 mb-6 mr-16 flex justify-end">
            <Button
              type="border"
              onClick={handleCancel}
            >
              キャンセル
            </Button>
            <span className="mx-2"></span>
            <Button 
              type="fill"
              onClick={handleSubmit}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
      {
        isLoading && <Loading/>
      }
    </HomeLayout>
  );
};

export default EditTarget;
