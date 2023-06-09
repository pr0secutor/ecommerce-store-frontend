import React, { useState } from "react";

import Wrapper from "@/components/Wrapper";
import ProductDetailsCarosusel from "@/components/ProductDetailsCarosusel";

import { IoMdHeartEmpty } from "react-icons/io";
import RelatedProducts from "@/components/RelatedProducts";
import { fetchDataFromAPI } from "@/utils/api";
import { percentageCalc } from "@/utils/helper";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = ({ productDetails, relatedProducts, slug }) => {
  const [selectedSize, setSelectedSize] = useState();
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  const notify = () => {
    toast.success("Product Added to the Cart", {
      position: "bottom-center",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="w-full md:py-20">
      <ToastContainer />
      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
          {/* Left Column Start */}
          <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
            <ProductDetailsCarosusel
              images={productDetails?.data[0]?.attributes?.image.data}
            />
          </div>
          {/* Left Column End */}

          {/* Right Column Start */}
          <div className="flex-[1] py-3">
            <div className="text-[34px] font-semibold mb-2 leading-tight">
              {productDetails?.data[0]?.attributes?.name}
            </div>

            <div className="flex items-center">
              <p className="mr-2 text-lg font-semibold">
                MRP: &#8377;{productDetails?.data[0]?.attributes?.price}
              </p>
              {productDetails?.data[0]?.attributes?.orignal_price && (
                <>
                  <p className="text-base font-medium line-through">
                    &#8377;{productDetails?.data[0]?.attributes?.price}
                  </p>
                  <p className="ml-auto text-base font-medium text-green-500">
                    {percentageCalc(
                      productDetails?.data[0]?.attributes?.orignal_price,
                      productDetails?.data[0]?.attributes?.price
                    )}
                    % off
                  </p>
                </>
              )}
            </div>
            <div className="text-lg font-semibold mb-5">
              {productDetails?.data[0]?.attributes?.subtitle}
            </div>

            <div className="text-md font-medium text-black/[0.5]">
              incl. of taxes
            </div>

            <div className="mb-10">
              {/* HEADING START */}
              <div className="flex justify-between mb-2">
                <div className="text-md font-semibold">Select Size</div>
                <div className="text-md font-medium text-black/[0.5] cursor-pointer">
                  Select Guide
                </div>
              </div>
              {/* Heading End */}

              <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                {productDetails?.data[0]?.attributes?.size?.data.map((item) => {
                  return (
                    <SizeBox
                      size={item.size}
                      enabled={item.enabled}
                      setSelectedSize={setSelectedSize}
                      selectedSize={selectedSize}
                      setShowError={setShowError}
                    />
                  );
                })}
              </div>
              {showError && (
                <div className="text-red-600 mt-1">
                  Size Selection is required
                </div>
              )}
            </div>

            {/* Add to Cart Button Start */}
            <button
              className="w-full py-4 rounded-full bg-black text-white text-lg font-medium 
                transition-transform active:scale-95 mb-3 hover:opacity-75"
              onClick={() => {
                if (!selectedSize) {
                  setShowError(true);
                  document.getElementById("sizesGrid").scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  });
                } else {
                  dispatch(
                    addToCart({
                      ...productDetails?.data?.[0],
                      selectedSize,
                      oneQuantityPrice: productDetails?.data[0]?.attributes?.price,
                    })
                  );
                  notify();
                }
              }}
            >
              Add to Cart
            </button>
            {/* Add to Cart Button End */}

            {/* Whishlist Button Start */}
            <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
              Whishlist
              <IoMdHeartEmpty size={20} />
            </button>
            {/* Whishlist Button End */}

            <div>
              <div className="text-lg font-bold mb-5">Product Details</div>
              <div className="text-md mb-5">
                <ReactMarkdown>
                  {productDetails?.data[0]?.attributes?.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          {/* Right Column End */}
        </div>
        <RelatedProducts products={relatedProducts} />
      </Wrapper>
    </div>
  );
};

function SizeBox({
  size,
  enabled,
  setSelectedSize,
  setShowError,
  selectedSize,
}) {
  return (
    <div
      className={`border rounded-md text-center py-3 font-medium ${
        enabled
          ? "hover:border-black cursor-pointer"
          : "cursor-not-allowed bg-black/[0.1] opacity-50"
      } ${selectedSize === size ? "border-black" : ""}`}
      onClick={() => {
        setSelectedSize(size);
        setShowError(false);
      }}
    >
      {size}
    </div>
  );
}

export default ProductDetails;

export async function getStaticPaths() {
  const products = await fetchDataFromAPI("/api/products?populate=*");

  const paths = products?.data?.map((p) => ({
    params: {
      slug: p.attributes.slug,
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params: { slug } }) {
  const productDetails = await fetchDataFromAPI(
    `/api/products?populate=*&filters[slug][$eq]=${slug}`
  );

  const relatedProducts = await fetchDataFromAPI(
    `/api/products?populate=*&[filters][slug][$ne]=${slug}`
  );

  return {
    props: {
      productDetails,
      relatedProducts,
      slug,
    },
  };
}
