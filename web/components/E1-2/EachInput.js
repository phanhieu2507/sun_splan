export default function EachInput({title, id, content, errorMessage, detail}) {
    return(
        <>
            <div className="grid grid-cols-9 auto-rows-auto items-center">
                <label htmlFor={id} className="col-span-3 text-right text-xl font-bold">
                    {title}
                    {!detail && <span className="text-red-400 mx-1">*</span>}
                    :
                </label>
                <div className="col-span-6 px-9 text-xl font-bold">
                    {content}
                </div>
                <span className="row-start-2 col-start-4 col-span-6 px-9 text-red-500 text-base font-normal block h-3 mt-1">
                    {errorMessage}
                </span>
            </div>
        </>
    )
}