import Icon from "../Icon";
import Post from "./Post";
import PropTypes from "prop-types";

const Manual = (props) => {
  return (
    <Post {...props}>
      <h4 className="material-name w-full text-center text-default mb-3">
        {props.documentName}
      </h4>
      <div className="flex items-center justify-center text-default gap-2">
        {props.content.includes("/") ? (
          <Icon name="page" color="default" size={30} />
        ) : (
          <Icon name="time" color="default" size={30} />
        )}
        <h4 className="amount text-default">{props.content}</h4>
      </div>
    </Post>
  );
};

Manual.propTypes = {
  documentName: PropTypes.string,
  content: PropTypes.string,
};

export default Manual;
