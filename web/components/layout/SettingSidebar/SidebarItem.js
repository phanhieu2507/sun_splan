import React from "react";
import PropTypes from "prop-types";
import NavLink from "~/components/NavLink";
import Icon from "~/components/Icon";
import { Tooltip } from "antd";

function SidebarItem(props) {
  return (
    <Tooltip placement="right" title={props.minimized ? props.title : ""}>
      <div className="sidebar-item ">
        <NavLink href={props.href}>
          <div
            className={
              "group sidebar-item-link flex items-center gap-4 px-8 py-3" +
              (props.minimized ? "" : " rounded-[5px]")
            }
          >
            {props.iconName && (
              <div className="sidebar-item-icon">
                <Icon
                  name={props.iconName}
                  size={28}
                  className="group-hover:bg-primary transition-all"
                  color="default"
                />
              </div>
            )}
            {!props.minimized && (
              <div className="sidebar-item-title whitespace-nowrap">
                {props.title}
              </div>
            )}
          </div>
        </NavLink>
      </div>
    </Tooltip>
  );
}

SidebarItem.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  minimized: PropTypes.bool,
};

SidebarItem.defaultProps = {
  minimized: false,
};

export default SidebarItem;
