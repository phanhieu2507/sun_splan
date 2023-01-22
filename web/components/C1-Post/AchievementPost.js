import Icon from "../Icon";
import Post from "./Post";
import PropTypes from "prop-types";
import { Divider } from "antd";
import Link from "next/link";

const AchievementPost = (props) => {
  return (
    <Post {...props}>
      <div className="achieve-content flex flex-col justify-center">
        {props.success ? (
          <SuccessMsg {...props} />
        ) : (
          <FailedMsg {...props} />
        )}
        {props.isShowDetail ? (
          <div className="flex gap-1 flex-col 2xl:flex-row 2xl:gap-10 lg:justify-center mt-4">
            <div className="plan flex flex-col self-center">
              <h4 className="text-default font-medium text-center mb-1">目標</h4>
              {props.subPosts
                .filter((subPost) => subPost.type === "contest")
                .map((subPost, index) => (
                  <div key={subPost.id} className="flex">
                    <TestScore
                      type="target"
                      scoreStr={subPost.expectedScore + "/" + subPost.maxScore}
                      name={subPost.contestName}
                      contestDate={subPost.contestDate}
                    />
                  </div>
                ))}
              <div className="free-plan flex flex-col mt-2 text-base">
                <div className="font-bold">他の目標:</div>
                {props.subPosts
                  .filter((subPost) => subPost.type === "freeContent")
                  .map((subPost, index) => (
                    <FreeContentPlan
                      content={subPost.content}
                      key={subPost.id}
                    />
                  ))}
              </div>
            <div className="custom-divider w-full mt-4 mb-2 bg-black bg-opacity-20 h-[1px] 2xl:hidden"></div>
            </div>
            <div className="custom-divider self-stretch mx-1 bg-black bg-opacity-20 w-[1px] hidden 2xl:block"></div>
            <div className="plan-result flex flex-col self-center">
              <h4 className="text-default font-medium text-center mb-1">実績</h4>
              {props.subPosts
                .filter((subPost) => subPost.type === "contest")
                .map((subPost, index) => (
                  <div key={subPost.id} className="flex">
                    <TestScore
                      type={subPost.achievedScore >= subPost.expectedScore ? "success" : "failed"}
                      scoreStr={subPost.achievedScore + "/" + subPost.maxScore}
                      name={subPost.contestName}
                      contestDate={subPost.contestDate}
                    />
                  </div>
                ))}
              <div className="free-plan flex flex-col mt-2 text-base">
                <div className="font-bold">他の目標:</div>
                {props.subPosts
                  .filter((subPost) => subPost.type === "freeContent")
                  .map((subPost, index) => (
                    <FreeContentPlan
                      content={subPost.content}
                      type={props.success ? "success" : "failed"}
                      key={subPost.id}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={{
              pathname: `/post-detail/${props.id}`,
              query: { userId: props.userId },
            }}
          >
            <a className="text-default flex mt-4 items-center justify-center gap-2 group hover:text-primary transition-all cursor-pointer">
              <Icon name="open-preview group-hover:bg-primary" size={20} />{" "}
              詳細を表示...
            </a>
          </Link>
        )}
      </div>
    </Post>
  );
};

const SuccessMsg = ({ content }) => (
  <div className="success-msg flex flex-col items-center gap-3 ">
    <div className="success-icon bg-primary rounded-full w-[50px] aspect-square flex items-center justify-center">
      <Icon name="party-popper" color="white" size={28} />
    </div>
    <h4 className="text-center w-full text-default">
      やった！
      <br />
      {content}の目標を達成しました。
    </h4>
  </div>
);

const FailedMsg = ({ content }) => (
  <div className="failed-msg flex flex-col items-center gap-3 ">
    <div className="failed-icon bg-[#C6C6C6] rounded-full w-[50px] aspect-square flex items-center justify-center">
      <Icon name="cloud-rain" color="black" size={28} />
    </div>
    <h4 className="text-center w-full text-default">
      残念
      <br />
      {content}の目標を達成しませんでした。
    </h4>
  </div>
);

const TestScore = (props) => {
  return (
    <div className="test self-center w-[400px]">
      {/* <div className="score-type">
        {props.type === "target" ? "目標" : "実績"}
      </div> */}
      <h4 className="flex gap-2 w-full justify-between font-bold text-default">
        <span className="test-name text-ellipsis whitespace-nowrap overflow-hidden">
          {props.name}
        </span>
        <span
          className={
            "test-score " +
            (props.type === "success" && "text-primary ") +
            (props.type === "failed" && " text-disabled ")
          }
        >
          {props.scoreStr}
        </span>
      </h4>
      <div className="test-date">{props.contestDate}</div>
    </div>
  );
};

const FreeContentPlan = (props) => (
  <div
    className={
      "ml-12 flex items-center gap-3 " +
      (props.type == "success" && " text-primary -translate-x-8 ") +
      (props.type == "failed" && " text-disabled -translate-x-8 ")
    }
  >
    {props.type == "success" && (
      <Icon name="circle-check" size={18} color="primary" />
    )}
    {props.type == "failed" && (
      <Icon name="circle-x" size={18} color="disabled" />
    )}
    <span>{props.content}</span>
  </div>
);

TestScore.propTypes = {
  contestDate: PropTypes.string,
  type: PropTypes.oneOf(["target", "success", "failed"]),
  scoreStr: PropTypes.string,
  name: PropTypes.string,
};

FreeContentPlan.propTypes = {
  content: PropTypes.string.isRequired,
  type: PropTypes.string,
};

AchievementPost.propTypes = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  content: PropTypes.string,
  subPosts: PropTypes.array,
  isShowDetail: PropTypes.bool.isRequired,
  success: PropTypes.bool,
};

AchievementPost.defaultProps = {
  isShowDetail: true,
  success: true,
};

export default AchievementPost;
