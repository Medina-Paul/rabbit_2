import React, { useEffect, useState, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "./SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import {useParams, useSearchParams} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByFilters,
} from "../../redux/slices/productsSlice";

const CollectionPage = () => {
  const {collection} = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);

  const queryParams = Object.fromEntries([...searchParams]);
  const sideBarRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({collection, ...queryParams}));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleClickOutside = (e) => {
    if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <div className="flex flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border-p2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>

      <div
        ref={sideBarRef}
        className={`${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[356px] fixed inset-y-0 z-50 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow-0 p-4">
        <h2 className="text-2xl uppercase mb-4">All Collections</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
    </div>
  );
};

export default CollectionPage;
