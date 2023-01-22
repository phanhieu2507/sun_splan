import { Button } from "antd";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import Icon from "./Icon";
import {PlusCircleOutlined} from '@ant-design/icons';

// prop showBackBtn={true}, showDeleteBtn={true}, showEditBtn={true} to display back button, delete button, edit button
function PageHeader(props) {
  const router = useRouter();
  return (
    <div className="page-header">
      <div className="flex w-full justify-between">
        {props.type !== 'list' ? 
          <BackButton onClick={props.onBackBtnClick} />
          : (
            <h1 className="title font-semibold">
              {props.title}
            </h1>
          )
        }
        <div className="icons flex gap-8">
          {
            ['detail'].includes(props.type) && (
            <Icon
              name="delete"
              color="danger"
              size={28}
              className="cursor-pointer"
              onClick={props.onDeleteBtnClick}
            />
            )}
          {
            ['detail'].includes(props.type) && (
            <Icon
              name="pencil-squared"
              color="primary"
              size={28}
              className="cursor-pointer"
              onClick={props.onEditBtnClick}
            />
            )
          } 
          {
            ['list'].includes(props.type) && (
              <>
                <Button size="large" icon={<PlusCircleOutlined />} type="primary" onClick={props.onAddBtnClick}>
                  追加
                </Button> 
              </>
            )
          }

        </div>
      </div>
      {
      (props.type !== "list") && (
      <h1 className="title font-semibold text-center mt-6 mb-10">
        {props.title}
      </h1>)
      }
    </div>
  );
}

PageHeader.propTypes = {
  type: PropTypes.oneOf(["list", "detail", "edit", "create"]),
  onEditBtnClick: PropTypes.func,
  onDeleteBtnClick: PropTypes.func,
  onBackBtnClick: PropTypes.func,
  onAddBtnClick: PropTypes.func,
};

PageHeader.defaultProps = {
  type: "create",
  onDeleteBtnClick: null,
  onBackBtnClick: null,
  onEditBtnClick: null,
  onAddBtnClick: null, 
  addBtnText: "追加",

}

export default PageHeader;
