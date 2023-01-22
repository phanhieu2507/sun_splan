import Icon from "./Icon";

const BackButton = ({ onClick }) => {
  return (
    <button
      className="inline-flex items-center cursor-pointer bg-transparent border-none font-medium text-2xl group hover:text-primary"
      onClick={onClick}
    >
      <Icon
        name="back"
        color="default"
        size={32}
        className="group-hover:bg-primary"
      />
      <span>戻る</span>
    </button>
  );
};
export default BackButton;
