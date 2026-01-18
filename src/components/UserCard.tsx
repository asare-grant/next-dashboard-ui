import Image from "next/image";

const UserCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-2xl shadow-md odd:bg-[#7aebeb] even:bg-[#17972a80] p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          Today
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>

      <h1 className="text-md font-semibold my-4">{value}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-600">
        {label}
      </h2>
    </div>
  );
};

export default UserCard;
