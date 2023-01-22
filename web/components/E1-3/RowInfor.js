export default function RowInfor({ id,title, content, message }) {
    return (
        <div>
            <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right text-xl font-bold">
                    <label htmlFor={ id }>
                        <span> { title } </span>
                        <span className="text-red-500">*</span>
                       <span> : </span>
                    </label>
                </div>
                <div className="col-span-9 px-9 text-xl font-bold">{ content }</div>
                <div className="col-start-4 col-end-12 px-9 mt-1 text-red-500">{ message }</div>
            </div>

        </div>
    )
}