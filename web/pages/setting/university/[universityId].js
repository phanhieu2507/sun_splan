import Image from "next/image";
import React, { useEffect, useState } from "react";
import SettingLayout from "~/components/layout/SettingLayout";
import UniversityTable from "~/components/E3-3/UniversityTable";
import { useRouter } from "next/router";
import PageHeader from "~/components/PageHeader";
import client from "~/api/client";
import defaultUniversity from "~/assets/images/default-university.png";
export default function UniversityDetail() {
  const router = useRouter();
  const { universityId } = router.query;
  const [items, setItems] = useState([]);
  const [universityInfo, setUniversityInfo] = useState({
    id: universityId,
    year: "",
    code: "",
    image: "https://via.placeholder.com/480x270",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get(`universities/${universityId}`).json();
      console.log(data);
      setUniversityInfo(data);
      if (data) {
        setImage(data.image);
        if (data.gradeCodes.length > 0) {
          setItems(
            data.gradeCodes.map((item, index) => ({
              id: index + 1,
              code: item.code,
              year: item.year,
            }))
          );
        }
      }
    };
    fetchData();
  }, [universityId]);

  return (
    <div>
      <SettingLayout>
        <div>
          <PageHeader
            title="大学詳細"
            type="detail"
            onBackBtnClick={() => router.push(`/setting/university`)}
            onEditBtnClick={() =>
              router.push(`/setting/university/edit/${universityId}`)
            }
          />
          <div className="py-4 thumbnail-name flex">
            {image && typeof image === "object" ? (
              <div className="mt-2 transition-all">
                <Image
                  src={URL.createObjectURL(image)}
                  width={160}
                  height={90}
                  objectFit="cover"
                  alt="#"
                />
              </div>
            ) : (
              <div className="mt-2 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    universityInfo?.image
                      ? universityInfo?.image.startsWith("images/")?'/'+universityInfo?.image:''+universityInfo.image
                      : defaultUniversity.src
                  }
                  width={160}
                  height={90}
                  style={{ objectFit: "contain" }}
                  alt=""
                />
              </div>
            )}
            <div className="container w-1/5 flex flex-col justify-center">
              <h2 className="ml-8 text-center font-bold">
                {" "}
                {universityInfo?.abbreviation}{" "}
              </h2>
              <h3 className="ml-8 text-center font-bold">
                {" "}
                {universityInfo?.name}{" "}
              </h3>
            </div>
          </div>
          <div className="py-4">
            <UniversityTable data={items} />
          </div>
        </div>
      </SettingLayout>
    </div>
  );
}
