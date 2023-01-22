import React, { useState, useEffect, createContext, useRef } from "react";
import SettingLayout from "~/components/layout/SettingLayout";
import { Button, Pagination } from "antd";
import UserCard from "~/components/E1-1/UserCard";
import UserSearch from "~/components/E1-1/UserSearch";
import Icon from "~/components/Icon";
import Link from "next/link";
import SidebarItem from "~/components/layout/SettingSidebar/SidebarItem";
import { useRouter } from "next/router";
import client from "~/api/client";
import PageHeader from "~/components/PageHeader";

export const UserListContext = createContext();

function UserList() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [receiveNaiteiDate, setReceiveNaiteiDate] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [reRender, setReRender] = useState(false);
  const filteringTimeout = useRef(null);

  const value = {
    name,
    setName,
    universityId,
    setUniversityId,
    companyId,
    setCompanyId,
    gradeCode,
    setGradeCode,
    graduationDate,
    setGraduationDate,
    receiveNaiteiDate,
    setReceiveNaiteiDate,
    page,
    setPage,
  };

  useEffect(() => {
    setName("");
    setUniversityId("");
    setCompanyId("");
    setGradeCode("");
    setGraduationDate("");
    setReceiveNaiteiDate("");
    setPage(1);
  }, [router.query.userType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client
          .get(
            `user/user-type/${router.query.userType}?` +
              (name && `name=${name}&`) +
              (companyId && `company_id=${companyId}&`) +
              (universityId &&
                `university_id=${universityId}&` +
                  (gradeCode &&
                    `grade_code=${gradeCode}&` +
                      (graduationDate && `graduation_date=${graduationDate}&`) +
                      (receiveNaiteiDate &&
                        `receive_naitei_date=${receiveNaiteiDate} &`))) +
              (page && `page=${page}`)
          )
          .json();
        if (res.success) {
          if (res.data.data.length > 0) {
            setUsers(res.data.data);
            setPage(res.data.current_page);
          } else {
            setUsers(res.data.data);
            setPage(1);
          }
          setLastPage(res.data.last_page);
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
  }, [
    companyId,
    gradeCode,
    graduationDate,
    name,
    page,
    receiveNaiteiDate,
    router.query.userType,
    universityId,
    reRender,
  ]);

  return (
    <UserListContext.Provider value={value}>
      <SettingLayout>
        <PageHeader
          type="list"
          title="ユーザ一覧"
          onAddBtnClick={() => router.push(`/setting/user/user-create-form`)}
        />
        <div>
          <div className="flex mt-8">
            <div className="pr-4" style={{ borderRight: "2px solid #D9D9D9" }}>
              <h4 className="font-semibold mb-6">役割</h4>
              <div className="setting-sidebar bg-white flex flex-col gap-4 w-full">
                <SidebarItem
                  href="/setting/user/naiteisha"
                  title="内定者"
                  currentPath={router.asPath}
                />
                <SidebarItem
                  href="/setting/user/manager"
                  title="企業担当者"
                  currentPath={router.asPath}
                />
                <SidebarItem
                  href="/setting/user/teacher"
                  title="教師"
                  currentPath={router.asPath}
                />
                <SidebarItem
                  href="/setting/user/mentor"
                  title="メンター"
                  currentPath={router.asPath}
                />
              </div>
            </div>
            <div className="flex justify-center flex-1">
              <div className="w-full">
                <div className="flex justify-center">
                  <UserSearch role={router.query.userType} />
                </div>
                <div className="m-6 grid grid-cols-4 gap-5">
                  {users.length > 0 &&
                    users.map((user) => (
                      <UserCard
                        avatar={user.avatar && (user.avatar.startsWith('images/') ? "/" : "") + user.avatar}
                        name={user.japaneseFullname}
                        userId={user.id}
                        company={
                          (user.role === 1 || user.role === 4) && user.company
                        }
                        university={
                          (user.role === 1 || user.role === 3) &&
                          user.abbreviation
                        }
                        role={user.role}
                        setReRender={setReRender}
                        key={user.id}
                      />
                    ))}
                </div>
                {users.length === 0 && (
                  <div className="flex justify-center w-full">
                    データがありません。
                  </div>
                )}
                <div className="flex justify-center">
                  {users.length > 0 && lastPage > 1 && (
                    <Pagination
                      current={page}
                      total={lastPage * 10}
                      onChange={(page) => setPage(page)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingLayout>
    </UserListContext.Provider>
  );
}

export default UserList;
