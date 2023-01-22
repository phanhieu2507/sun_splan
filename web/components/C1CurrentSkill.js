import moment from "moment";
import Link from "next/link";
import React from "react";
import Icon from "~/components/Icon";

const C1CurrentSkill = ({ title, targets }) => {
  return (
    <div className="w-[400px] px-8 shadow-md rounded-2xl flex flex-col items-center py-4 bg-white mb-2">
      <div className="flex justify-between self-start mb-4 text-primary w-full">
        {title === "現状" ? (
          <div className="flex items-center gap-2">
            <Icon name="circle-check" color="primary" size={28} />
            <h3 className="mb-0 text-primary leading-none">現状</h3>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Icon name="flag-2-line" color="primary" size={28} />
            <h3 className="mb-0 text-primary leading-none">次の目標</h3>
          </div>
        )}
        <Link href="/" className="flex items-center">
          <div className="cursor-pointer flex items-center gap-1">
            <Icon name="open-preview" color="primary" size={20} />
            <span>詳細</span>
          </div>
        </Link>
      </div>
      {targets &&
        targets.length > 0 &&
        targets.map((target) => {
          if (!target.type)
            return (
              <div
                className="flex items-start justify-between self-start my-2 w-full"
                key={target.id}
              >
                <div>
                  <h3 className="font-bold">{target.contestName}</h3>
                  <span>
                    {moment(target.dateOfTarget).format("YYYY/MM/DD")}
                  </span>
                </div>
                <div className="flex items-center">
                  <h3 className="font-bold">{target.actualScore}</h3>
                  <h3 className="font-bold">/</h3>
                  <h3 className="font-bold">{target.maxScore}</h3>
                </div>
              </div>
            );
        })}

      <div className="flex w-full flex-col gap-3 mt-2">
        {targets &&
          targets.length > 0 &&
          targets.map((target) => {
            if (target.type) {
              return (
                <div className="flex w-full self-start" key={target.id}>
                  <div>
                    <h4>{target.content}</h4>
                    <span>
                      {moment(target.dateOfTarget).format("YYYY/MM/DD")}
                    </span>
                  </div>
                </div>
              );
            }
          })}
      </div>
      {!targets ||
        (targets && targets.length === 0 && (
          <div className="flex w-full justify-center">データがありません。</div>
        ))}
    </div>
  );
};

export default C1CurrentSkill;
