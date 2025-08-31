// S3 Image URLs Configuration
// Using the actual S3 bucket: images-retrotaxi.s3.eu-north-1.amazonaws.com

const S3_BASE_URL = "https://images-retrotaxi.s3.eu-north-1.amazonaws.com";

export const IMAGES = {
    // Logo
    LOGO: `${S3_BASE_URL}/RT-logo.png`,

    // Home page background
    HOME_BACKGROUND: `${S3_BASE_URL}/voiture-en-montagne.jpg`,

    // Brand images for blogs
    BRANDS: {
        Tesla: `${S3_BASE_URL}/Tesla.jpg`,
        Amazon: `${S3_BASE_URL}/zoox.jpg`,
        Google: `${S3_BASE_URL}/Waymo.jpg`,
        GM: `${S3_BASE_URL}/Cruise.jpg`,
        Baidu: `${S3_BASE_URL}/baidu.jpg`,
    },
};

export default IMAGES;
