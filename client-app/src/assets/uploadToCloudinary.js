import React from "react";

const uploadToCloudinary = async (pics) => {
  if (pics) {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      {
        method: "post",
        body: data,
      }
    );

    const fileData = await res.json();
    console.log("url : ", fileData);
    return fileData.url;
  } else {
    console.log("error");
  }
};

export default uploadToCloudinary;
