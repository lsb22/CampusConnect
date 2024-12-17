import { Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  blob: Blob;
  fileName: string;
}

const RenderImage = ({ blob, fileName }: Props) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setImg(reader.result as string);
    };
  });

  return <Image className="chat-img" fit="cover" src={img} alt={fileName} />;
};

export default RenderImage;
