import defaultUniversity from "~/assets/images/default-university.png";
import Link from "next/link";
import Icon from "../Icon";
import confirmModal from "../E1-3/ConfirmModal";
import { useRouter } from "next/router";
import { useState } from "react";

const UniversityCard = (props) => {
  const router = useRouter();
  const { universityId } = router.query;
  const [universityInfo, setUniversityInfo] = useState({
    id: universityId,
    year: "",
    code: "",
    image: "https://via.placeholder.com/480x270",
  });
  const image = props;
  const handleRemove = () =>
    confirmModal(
      "この大学を削除してもよろしですか?",
      "削除後に復元できません。",
      "削除",
      "キャンセル",
      () => props.delete(props.id)
    );

  return (
    <div
      className="col-span-4 hover:shadow-xl transition-all duration-300"
      style={{ border: "1px solid #D9D9D9" }}>
      <Link href={`/setting/university/${props.id}`}>
        <a>
          <div className="flex flex-col justify-center ">
            {/* <Image 
                            className="object-contain"
                            height={150}
                            width={200}
                           // src={ props.image? props.image : defaultUniversity }
                            src={props.image!=null?((image.image.startsWith("images/") ? `/` : "") + image.image):defaultUniversity}
                            // src={
                            //     (props.image.startsWith("images/") ? `/` : "") +
                            //     props.image
                            //   }
                            alt="#"
                        /> */}
            <picture>
              <source
                srcSet={props.image ? props.image.startsWith("images/")?'/'+props.image:''+props.image : defaultUniversity.src}
                type="image/webp"
              />
              <img
                src={props.image ? props.image.startsWith("images/")?'/'+props.image:''+props.image : defaultUniversity.src}
                width="100%"
                height="173px"
                alt="#"
                style={{ objectFit: "contain" }}
              />
            </picture>
            {/* <img
              //src={props.image!=null?((image.image.startsWith("images/") ? `/` : "") + image.image):defaultUniversity}
              src={ props.image? props.image : defaultUniversity }
              className="object-contain"
              width="100%"
              height="173px"
              //style={{ objectFit: "cover" }}
              alt=""
            /> */}

            <h4 className="text-center mt-5 font-medium text-primary">
              {props.abbreviation ? props.abbreviation : "大学の名前（略称)"}
            </h4>
            <h4 className="text-center mt-2 font-bold">
              {props.name ? props.name : "大学の名前"}
            </h4>
          </div>
        </a>
      </Link>
      <div
        className="grid grid-cols-2 gap-0 py-3 mt-10"
        style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <div
          className="group col-span-1 text-center hover:text-danger transition-all"
          style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
          onClick={handleRemove}>
          <Icon
            className="cursor-pointer group-hover:bg-danger transition-all"
            name="delete"
            color="disabled"
          />
        </div>
        <div className="col-span-1 text-center">
          <Link href={`/setting/university/edit/${props.id}`}>
            <a>
              <div className="group hover:text-primary transition-all">
                <Icon
                  className="group-hover:bg-primary"
                  color="disabled"
                  name="pencil-squared"
                />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
