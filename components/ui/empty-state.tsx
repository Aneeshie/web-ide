import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const EmptyState = ({ title, description, image }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-15">
      <Image
        src={image!}
        alt="title"
        className=" mb-5"
        height={100}
        width={100}
      />
      <h2 className="text-xl font-semibold text-gray-500">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default EmptyState;
