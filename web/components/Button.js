const Button = ({ children, type, onClick, disabled, htmlType }) => {
  let styles = "";
  if (type === "fill") {
    styles =
      "custom-btn-fill px-4 py-1 bg-primary text-white hover:bg-[#228BDD] rounded-sm transition-all cursor-pointer";
  } else {
    styles =
      "custom-btn px-4 py-1 bg-white text-default rounded-sm border  hover:text-primary transition-all cursor-pointer";
  }
  return (
    <button className={styles} onClick={onClick} disabled={disabled} type={htmlType}>
      {children}
    </button>
  );
};

export default Button;