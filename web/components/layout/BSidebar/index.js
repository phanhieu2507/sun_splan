import SearchBox from "./SearchBox";
import UserItem from "./UserItem";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import Link from "next/link";
import client from "~/api/client";

const BSidebar = () => {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [users, setUsers] = useState([]);
  const filteringTimeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client
          .get(
            "user/naiteishas" +
              ((name || companyId || graduationYear) && "?") +
              (name && `name=${name}&`) +
              (companyId && `company_id=${companyId}&`) +
              (graduationYear && `graduation_year=${graduationYear}`)
          )
          .json();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      fetchData();
    }, 500);
  }, [name, companyId, graduationYear]);

  return (
    <div className="w-[224px] min-h-screen bg-white shadow-md">
      <div className="px-2">
        <SearchBox
          setName={setName}
          setGraduationYear={setGraduationYear}
          setCompanyId={setCompanyId}
        />
      </div>
      <div>
        {users && users.length > 0 ? (
          users.map((user) => (
            <Link href={`/home/${user.id}`} key={user.id}>
              <a>
                <UserItem
                  avatar={user.avatar}
                  userName={user.japaneseFullname}
                  graduationYear={moment(user.graduationDate).format("YYYY")}
                />
              </a>
            </Link>
          ))
        ) : (
          <div className="text-center">
            <span>データがありません。</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BSidebar;
