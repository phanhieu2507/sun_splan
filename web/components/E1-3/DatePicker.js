import { DatePicker } from "antd";
import moment from "moment";


export default function DateInput() {

    const disableDate = (current) => {
        return current && current < moment().endOf('day');
    }

    return (
        <DatePicker
            format="YYYY/MM/DD"
            disabledDate={disableDate}
            size="large"
            className="w-72  cursor-pointer text-default font-bold"
        />
    )
}
