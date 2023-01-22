import React from "react"
import PropTypes from "prop-types"
import Icon from "./Icon"

export default function NoData(props) {
    return (
        <div className={"text-center " + props.className}>
            <Icon
                name="outlet"
                color="disabled"
                size={
                    props.size == "small" ? 36 : props.size == "medium" ? 72 : 96
                }
            />
            <div className={"font-bold text-disabled " + (
                props.size == "small" ? "text-lg" : props.size == "medium" ? "text-2xl" : "text-3xl"
            )}>
                ダータがありません
            </div>
        </div>
    )
}

NoData.propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
}

NoData.defaultProps = {
    size: "medium",
}
