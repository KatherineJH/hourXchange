import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListTable from "../product/ListTable";

function SearchProduct() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";

  const [searchKeyword, setSearchKeyword] = useState(keyword);

  // keyword가 URL에서 바뀌면 갱신
  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  return (
    <div>
      <h2 style={{ margin: "1rem 0" }}>
        🔍 "{searchKeyword}" 검색 결과
      </h2>
      <ListTable keyword={searchKeyword} />
    </div>
  );
}

export default SearchProduct;
