import Icon from "~/components/Icon";
import { InputNumber } from 'antd';
import { useState } from 'react';

const Item = ({ type, planData, formData, setFormData, setChanged, errorMessage }) => {
    const [currValue, setCurrValue] = useState(planData?.real_amount);

    const handleChange = (value, doc_id) => {
		const plan = formData.find(each => each.doc_id === doc_id);
        plan.real_amount = value;
        setChanged(true);
        setCurrValue(value);
	}

    const handleDelete = (doc_id, id) => {
		setFormData([...formData.filter(each => each.doc_id !== doc_id), id && {
			id: id,
			delete: true,
		}]);
        setChanged(true);
	}

    return (
        <div className="items-center text-xl grid grid-cols-6 auto-rows-auto font-normal">
            <label htmlFor="real_amount" className="col-span-3 text-xl">
                {planData?.document.doc_name}
            </label>
            {type === "edit" ? (
                <>
                    <div className="col-span-2">
                        <InputNumber
                            id = "real_amount"
                            className="max-w-[70px] text-default"
                            size="large" 
                            placeholder="0"
                            min={0}
                            max={planData?.expected_amount}
                            defaultValue={planData?.real_amount}
                            status={errorMessage && "error"}
                            value={currValue}
                            onChange={(value) => handleChange(value, planData.doc_id)}
                        />
                        <span className="ml-4">
                            {planData?.document.unit.name}
                        </span> 
                    </div>
                    <Icon
                        name="delete"
                        size={24}
                        color="danger"
                        className="justify-self-center cursor-pointer h-max"
                        onClick={() => handleDelete(planData?.doc_id, planData?.id)}
                    />
                    <div className="row-start-2 col-start-4 text-red-500 text-sm font-normal block h-2 mt-1">
                        {errorMessage}
                    </div>
                </>
            ): (
               <>
                    <span className="col-start-5">
                        {planData?.real_amount}/{planData?.expected_amount}
                    </span>
                    <span className="col-start-6">
                        {planData?.document.unit.name}
                    </span>
               </>
            )}
        </div>
    );
};

export default Item;
