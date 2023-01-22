import { Input } from "antd"

const UniversitySearch = (props) => {
  return (
    <div className="flex justify-center mt-24">
      <Input
        placeholder="検索"
        className="h-10 w-[60%] placeholder:text-disabled focus:shadown-none"
        value={props.search}
        onChange={props.setSearch}
      />
    </div>
  )
}

export default UniversitySearch