import { createIcon } from "@chakra-ui/icons";
export const HomeIcon = createIcon({
  displayName: "HomeIcon",
  viewBox: "0 0 24 24",

  path: (
    <g>
      <path
        fill="currentColor"
        d="M11.494 4.951a.351.351 0 00-.486 0l-8.09 7.729a.352.352 0 00-.109.254v7.254a1.406 1.406 0 001.405 1.406h4.223a.703.703 0 00.704-.703v-5.976a.351.351 0 01.351-.352h3.516a.351.351 0 01.351.352v5.976a.703.703 0 00.704.703h4.22a1.407 1.407 0 001.407-1.406v-7.254a.35.35 0 00-.108-.254L11.494 4.95z"
      />
      <path
        fill="currentColor"
        d="M21.574 11.23l-3.287-3.144V3.314a.703.703 0 00-.703-.703h-2.11a.703.703 0 00-.703.703V4.72l-2.545-2.434c-.239-.24-.593-.378-.976-.378-.38 0-.734.138-.972.379L.93 11.23a.717.717 0 00-.058.983.703.703 0 001.018.046l9.119-8.713a.352.352 0 01.486 0l9.12 8.713a.703.703 0 00.992-.019c.27-.28.248-.74-.033-1.01z"
      />
    </g>
  ),
});

export const ProfileIcon = createIcon({
  displayName: "ProfileIcon",
  viewBox: "0 0 24 24",
  path: (
    <g>
      <path d="M0 0h24v24H0V0z" fill="transparent" />
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"
      />
    </g>
  ),
});

export const BagIcon = createIcon({
  displayName: "BagIcon",
  viewBox: "0 0 24 24",
  path: (
    <g>
      <path d="M0 0h24v24H0V0z" fill="transparent" />
      <path
        fill="currentColor"
        d="M19 6h-2.1c-.2-2.1-1.9-3.7-4-3.9-2.1-.3-4.1 1.3-4.4 3.4V6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 6c.2-1.1 1.2-2 2.3-2 1.1 0 2 .8 2.2 1.9V6H9V6zM5 8h14v12H5V8zm2 3h10v2H7v-2z"
      />
    </g>
  ),
});

const CategoryIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-list"
    {...props}
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export default CategoryIcon;

export const InvoiceIcon = createIcon({
  displayName: "InvoiceIcon",
  viewBox: "0 0 24 24",
  path: (
    <g>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        fill="currentColor"
        d="M20 2H8c-1.1 0-2 .9-2 2v16c0 .55.45 1 1 1 .25 0 .5-.1.71-.29l2.3-2.3 2.3 2.3c.39.39 1.02.39 1.41 0l2.3-2.3 2.3 2.3c.39.39 1.02.39 1.41 0 .21-.2.29-.45.29-.71V4c0-1.1-.9-2-2-2zm-2 14H10v-2h8v2zm0-4H10V6h8v6z"
      />
    </g>
  ),
});

export const CustomIcon = createIcon({
  displayName: "CustomIcon",
  path: (
    <path
      d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z"
      fill="currentColor"
    />
  ),
  viewBox: "0 0 512 512",
});

export const CameraIcon = createIcon({
  displayName: "CameraIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M12 5.5C14.21 5.5 16 7.29 16 9.5C16 11.71 14.21 13.5 12 13.5C9.79 13.5 8 11.71 8 9.5C8 7.29 9.79 5.5 12 5.5M12 3C9.24 3 7 5.24 7 8C7 10.76 9.24 13 12 13C14.76 13 17 10.76 17 8C17 5.24 14.76 3 12 3M19 19H5C4.45 19 4 18.55 4 18V10C4 9.45 4.45 9 5 9H6.17L8.17 6.76C8.59 6.29 9.26 6 9.95 6H14.05C14.74 6 15.41 6.29 15.83 6.76L17.83 9H19C19.55 9 20 9.45 20 10V18C20 18.55 19.55 19 19 19M12 18C14.21 18 16 16.21 16 14C16 11.79 14.21 10 12 10C9.79 10 8 11.79 8 14C8 16.21 9.79 18 12 18Z"
    />
  ),
});

export const ShoppingIcon = createIcon({
  displayName: "ShoppingIcon",
  viewBox: "0 0 24 24", // Define the viewbox of the icon
  // Define the path for the shopping cart
  path: (
    <g fill="currentColor" stroke="#b29c6e" strokeWidth="1.5">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.78 15h8.44c.87 0 1.64-.55 1.88-1.39l1.72-6.45c.08-.3.12-.61.12-.92 0-1.25-1-2.25-2.25-2.25h-3.19L11.8 3.29c-.18-.34-.52-.54-.91-.54H5.25C4.01 2.75 3 3.75 3 5v2.5c0 .41.34.75.75.75S4.5 7.91 4.5 7.5V5c0-.41.34-.75.75-.75h5.15l1.88 3.75H6.91c-.99 0-1.83.72-2.01 1.7l-.89 4.45c-.09.48.07.98.4 1.33.34.36.81.56 1.3.56h.07zM17.38 8.5l-1.5 5.64c-.06.21-.25.36-.47.36H7.78c-.27 0-.47-.24-.42-.51l.88-4.45c.04-.23.25-.4.48-.4h8.66c.41 0 .75.34.75.75s-.34.75-.75.75H7.97l-.69 3.45h9.55l1.5-5.64.02-.11c0-.41-.33-.74-.75-.74s-.75.33-.75.74l-.02.11z" />
    </g>
  ),
});

/**=================================================================================================== */
export const IconPhone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="25"
    height="25"
    fill="currentColor"
  >
    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
  </svg>
);

export const IconFacebook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="25"
    height="25"
    fill="currentColor"
  >
    <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
  </svg>
);

export const IconInstagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="25"
    height="25"
    fill="currentColor"
  >
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);
export const IconSoundCloud = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="25"
    height="25"
    fill="currentColor"
  >
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
  </svg>
);

export const IconZalo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="25"
    height="25"
    fill="currentColor"
  >
    <rect width="48" height="48" rx="10" ry="10" fill="currentColor" />
    <text
      x="50%"
      y="50%"
      fontSize="20"
      fill="#fff"
      fontFamily="Arial"
      textAnchor="middle"
      alignmentBaseline="middle"
    >
      Zalo
    </text>
  </svg>
);
// =================================================================================================================

export const HeartIcon = createIcon({
  displayName: "HeartIcon",
  viewBox: "0 0 24 24", // Define the viewbox of the icon

  // Define the path for the heart shape
  path: (
    <g fill="currentColor" stroke="#b29c6e" strokeWidth="1.5">
      {" "}
      {/* You can adjust the fill color as needed */}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </g>
  ),
});
// ====================================================== delete cart ==============================================================



export const DeleteIcon = createIcon({
  displayName: "DeleteIcon",
  viewBox: "0 0 576 512",
  path: (
    <path
      fill="#aa0808"
      d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
    />
  ),
});

//======================================================== giỏ hàng trống ========================================================






export const AddressIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      style={{ width: "24px", height: "24px", fill: "#74C0FC" }} // Bạn có thể tùy chỉnh kích thước và màu sắc tại đây
    >
      <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
    </svg>
  );
};


export const CardIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      style={{ width: "24px", height: "24px", fill: "#74C0FC" }} // Bạn có thể tùy chỉnh kích thước và màu sắc
    >
      <path d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
    </svg>
  );
};
