import { memo } from "react";

const Genre = ({ name }: { name: string }) => {
  return (
    <span
      className="genre md:text-[13px] sm:text-[12.5px] xs:text-[12px] text-[11.5px] sm:py-1.5 py-1 sm:px-4 px-3.5 rounded-xl text-gray-100 font-medium tracking-tight"
    >
      {name}
    </span>
  );
};

export default memo(Genre);
