import { AutoComplete, Input, Modal, TreeSelect } from "antd";
import { useState, useEffect, useRef } from "react";
import client from "~/api/client";

const { TreeNode } = TreeSelect;

const SelectTargetType = ({
  handleAddJapaneseContestTarget,
  handleAddFreeContentTarget,
}) => {
  const [value, setValue] = useState(""); // contestName
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [treeSelectedValue, setTreeSelectedValue] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const filteringTimeout = useRef(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleAddTarget = (selectedValue, category) => {
    if (
      !selectedValue.includes("free") &&
      !options.find((option) => option.value === value)
    ) {
      setErrorMessage("この試験はありません。");
      return;
    }
    switch (selectedValue) {
      case "japanese-test":
        handleAddJapaneseContestTarget(value);
        break;
      default:
        handleAddFreeContentTarget(category);
    }
    setValue("");
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setErrorMessage("");
    setValue("");
    setIsModalOpen(false);
  };

  const treeSelectOnChange = (newValue) => {
    if (newValue) {
      let category;
      if (newValue.includes("japanese")) {
        setModalTitle("日本語");
        category = "日本語";
      } else if (newValue.includes("it")) {
        setModalTitle("IT知識・技術");
        category = "IT知識・技術";
      } else {
        setModalTitle("その他");
        category = "その他";
      }
      if (!newValue.includes("free")) {
        showModal();
      } else {
        handleAddTarget(newValue, category);
      }
    }
    setTreeSelectedValue(newValue);
  };

  const onSelect = (data) => {
    setValue(data);
  };

  const AutoCompleteOnChange = (data) => {
    setErrorMessage("");
    setValue(data);
  };

  useEffect(() => {
    const callAPI = async () => {
      try {
        const res = await client
          .get("contest/filter", {
            searchParams: {
              name: value,
              category: modalTitle,
            },
          })
          .json();
        if (res && res.success) {
          const newOptions = res.data.map((contest) => {
            return {
              label: contest.contestName,
              value: contest.contestName,
            };
          });
          setOptions(newOptions);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      callAPI();
    }, 500);
  }, [modalTitle, value]);

  return (
    <div>
      <TreeSelect
        className="text-default"
        showSearch
        style={{
          width: "240px",
        }}
        value="＋目標を追加する"
        dropdownStyle={{
          maxHeight: 400,
          overflow: "auto",
        }}
        placeholder="＋目標を追加する"
        allowClear
        treeDefaultExpandAll
        onChange={treeSelectOnChange}
      >
        <TreeNode className="text-default" value="japanese" title="日本語">
          <TreeNode
            className="text-default"
            value="japanese-test"
            title="試験"
          />
          <TreeNode
            className="text-default"
            value="japanese-free"
            title="自由入力"
          />
        </TreeNode>
        <TreeNode className="text-default" value="it" title="IT知識・技術">
          <TreeNode className="text-default" value="it-test" title="試験" />
          <TreeNode className="text-default" value="it-free" title="自由入力" />
        </TreeNode>
        <TreeNode className="text-default" value="other" title="その他">
          <TreeNode className="text-default" value="other-test" title="試験" />
          <TreeNode
            className="text-default"
            value="other-free"
            title="自由入力"
          />
        </TreeNode>
      </TreeSelect>
      <Modal
        title={modalTitle}
        visible={isModalOpen}
        onOk={() => handleAddTarget(treeSelectedValue, modalTitle)}
        cancelText="キャンセル"
        okText="作成"
        onCancel={handleCancel}
        centered
      >
        <AutoComplete
          options={options}
          style={{
            width: "100%",
          }}
          value={value}
          placeholder="試験名"
          onSelect={onSelect}
          onChange={AutoCompleteOnChange}
          autoFocus
        />
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Modal>
    </div>
  );
};

export default SelectTargetType;
