import Icon from "../Icon";
import Post from "./Post";
import PropTypes from "prop-types";

const Manual = (props) => {
  return (
    <Post {...props}>
      <div className="success-msg flex flex-col items-center">
        <div className="success-icon bg-information rounded-full w-[50px] aspect-square flex items-center justify-center">
          <Icon name="plant" color="white" size={28} />
        </div>
        <h4 className="material-name w-full text-default mb-1 mt-4 text-center">
          {props.content}の目標に対して進捗がありました。
        </h4>
        <h3 className="text-center w-full">
          <span className="text-information font-medium">
            {props.sub_content.split("%")[0]}
          </span>
          <span className="text-lg">% 達成</span>
        </h3>
      </div>
    </Post>
  );
};

Manual.propTypes = {
  sub_content: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Manual;
