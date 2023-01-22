import PropTypes from "prop-types";

function Icon(props) {
  return (
    <i
      className={
        "custom-icon custom-icon-color-" +
        props.color +
        " custom-icon-" +
        props.name +
        " " +
        props.className
      }
      onClick={props.onClick}
      style={{
        display: "inline-block",
        width: props.size,
        height: props.size,
      }}
    ></i>
  );
}

Icon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "primary",
      "danger",
      "warning",
      "success",
      "white",
      "default",
      "black",
    ]),
  ]),
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  color: "default",
  size: 24,
};

export default Icon;
