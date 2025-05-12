// src/assets/uploadToCloudinary.js
const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const FOLDER_NAME = "images";

const uploadToCloudinary = async (pics) => {
  if (!pics) {
    console.log("파일이 없습니다.");
    return;
  }
  const file = Array.isArray(pics) ? pics[0] : pics;
  const data = new FormData();
  data.append("file", pics);
  data.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );
    const fileData = await res.json();
    console.log("업로드 성공:", fileData);
    return fileData.url;
  } catch (error) {
    console.error("Cloudinary 업로드 실패:", error);
    throw error;
  }
};

export default uploadToCloudinary;
