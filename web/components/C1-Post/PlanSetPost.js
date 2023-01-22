import Icon from "../Icon";
import Post from "./Post";
import PropTypes from "prop-types";
import Link from "next/link";

const PlanSetPost = (props) => {
  return (
    <Post {...props}>
      <h4 className="title w-full text-default mb-3 text-center">
        {props.content}の目標の学習計画を作成しました。
      </h4>

      {props.isShowDetail ? (
        <div className="flex justify-center">
          <div className="plan-list inline-flex flex-col gap-1 justify-start mx-auto">
            {props.subPosts.map((subPost) => (
              <div
                className="flex ml-8 items-center text-default gap-2"
                key={subPost.id}
              >
                {["章", "課", "ページ"].includes(
                  subPost.subContent.slice(-1)
                ) && <Icon name="page" color="default" size={30} />}
                {(["時", "分"].includes(subPost.subContent.slice(-1)) ||
                  ["時間"].includes(subPost.subContent.slice(-2))) && (
                  <Icon name="time" color="default" size={30} />
                )}
                <h4 className="material-name-amount text-default">
                  {subPost.documentName} - {subPost.subContent}
                </h4>
              </div>
            ))}
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
            <Icon name="open-preview group-hover:bg-primary" size={20} />
            詳細を表示...
          </a>
        </Link>
      )}
    </Post>
  );
};

PlanSetPost.propTypes = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  subPosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      postId: PropTypes.number,
      content: PropTypes.any,
      subContent: PropTypes.string,
      documentName: PropTypes.string,
      type: PropTypes.string,
    })
  ),
  isShowDetail: PropTypes.bool,
};

PlanSetPost.defaultProps = {
  isShowDetail: true,
};
export default PlanSetPost;
