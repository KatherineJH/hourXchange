import React, { useEffect, useState } from "react";
import { getList } from "../../api/categoryApi.js";
import { getRead, putUpdate } from "../../api/productApi.js";
import { useParams } from "react-router-dom";

const initState = {
  // 서버 데이터 수정용
  title: "",
  description: "",
  hours: "",
  startedAt: "",
  endAt: "",
  ownerId: "",
  owner: {},
  categoryId: "",
  category: {},
  providerType: "",
  images: [], // 클라우드 연동 후 저장
};

function Modify() {
  const [updateData, setUpdateData] = useState(initState);

  const { id } = useParams();

  const [categoryData, setCategoryData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleImageChange = (index, newUrl) => {
    setUpdateData((prev) => {
      const images = [...prev.images];
      images[index] = newUrl;
      return { ...prev, images };
    });
  };

  useEffect(() => {
    getList()
      .then((response) => {
        console.log(response);
        setCategoryData(response.data);
      })
      .catch((error) => console.log(error));

    getRead(id)
      .then((response) => {
        console.log(response.data);
        setUpdateData({
          ...response.data,
          ["categoryId"]: response.data.category.id,
          ["ownerId"]: response.data.owner.id,
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleAddImage = (e) => {
    e.preventDefault();
    setUpdateData((prev) => {
      const images = [...prev.images];
      images.push("");
      return { ...prev, images };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(updateData);
    try {
      const response = putUpdate(id, updateData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <h2>수정</h2>
      <div>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={updateData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          value={updateData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="hours">시간(비용)</label>
        <input
          type="number"
          id="hours"
          name="hours"
          value={updateData.hours}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="startedAt"></label>
        <input
          type="datetime-local"
          id="startedAt"
          name="startedAt"
          value={updateData.startedAt}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="endAt"></label>
        <input
          type="datetime-local"
          id="endAt"
          name="endAt"
          value={updateData.endAt}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="categoryId"></label>
        <select
          id="categoryId"
          name="categoryId"
          value={updateData.categoryId}
          onChange={handleChange}
        >
          <option value="">---카테고리---</option>
          {categoryData.map((item) => (
            <option key={item.id} value={item.id}>
              {item.categoryName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleAddImage}>사진추가</button>
      </div>
      {updateData.images.map((item, index) => (
        <div key={index}>
          <label htmlFor={"image" + index}>Image {index + 1}</label>
          <input
            type="text"
            id={"image" + index}
            name={"image" + index}
            value={item}
            onChange={(e) => handleImageChange(index, e.target.value)}
          />
        </div>
      ))}

      <div>
        <label htmlFor="providerType"></label>
        <select
          id="providerType"
          name="providerType"
          value={updateData.providerType}
          onChange={handleChange}
        >
          <option value="">---타입---</option>
          <option value="BUYER">구매</option>
          <option value="SELLER">판매</option>
        </select>
      </div>
      <button onClick={handleSubmit}>수정</button>
    </form>
  );
}

export default Modify;
