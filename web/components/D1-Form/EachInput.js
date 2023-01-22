export default function EachInput({ title, id, content }) {
  return (
    <>
      <div className="grid grid-cols-12 auto-rows-auto items-center">
        <label htmlFor={id} className="col-span-2 text-right text-xl font-bold">
          {title}
          <span className="text-red-400 mx-1">*</span>
          :
        </label>
        <div className="col-span-10 px-9 text-xl font-bold">
          {content}
        </div>
      </div>
    </>
  )
}