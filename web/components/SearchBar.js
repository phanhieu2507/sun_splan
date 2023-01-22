import { Input, Popover } from "antd";
import Icon from "~/components/Icon";
import PropTypes from "prop-types";

const SearchBar = (props) => {

  let styles = "";
  if (props.showContainer === true) {
    styles = "rounded-xl shadow-inner shadow-searchbar";
  } else {
    styles = "rounded-xl";
  }

  return (
    <div className={styles}>
      <div className="grid justify-items-center">
        <div className="flex items-center w-full">
          <Input
            className="my-4 mx-4
                            w-full
                            border-[1px]  border-input-default rounded-[2px]
                            focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input"
            placeholder={props.placeholder}
            onChange={(e) => props.handleSearch(e)}
            value={props.name}
          />
          {
            props.showFilter && (
              <Popover
                content={
                  props.children
                }
                title={<h4>検索オプション</h4>}
                trigger="click"
                placement="bottomRight"
                visible={props.visibleFilter}
                onVisibleChange={props.handleVisibleFilter}
              >
                <div>
                  <Icon className="mx-1 cursor-pointer" name="filter" size={32} />
                </div>
              </Popover>
            )
          }
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  showContainer: PropTypes.bool,
  showFilter: PropTypes.bool,
  placeholder: PropTypes.string,
  filterFor: PropTypes.string,
  handleSearch: PropTypes.func,
  children: PropTypes.element,
};

SearchBar.defaultProps = {
  showFilter: false,
  showContainer: false,
};

export default SearchBar;
