const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_ACCOUNT,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const headers = {
    "Content-Type": "application/json",
};

const start = async (url) => {
    try {
        if (!url) {
            return {
                statusCode: 400,
                headers,
                body: "url required",
            };
        }

        const screenshotData = await makeScreenshot(url);
        const path = await uploadToCloudinary(screenshotData, url);

        const file = path.replace(/^http(.*)upload/, "");
        console.log(file);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                path,
                file,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error }),
        };
    }
};

/**
 * Use Puppeteer to create screenshots
 * @param {String} url
 */
const makeScreenshot = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        height: 1024,
        width: 375,
        deviceScaleFactor: 1,
        isMobile: false,
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    const screenshotData = await page.screenshot();

    await browser.close();

    return screenshotData;
};

/**
 * Upload and store the screenshot in cloudinary
 * @param {Binary} screenshotData
 * @param {String} url
 */
const uploadToCloudinary = async (screenshotData, url) => {
    try {
        return new Promise((resolve, reject) => {
            const options = {
                public_id: `landing_pages/${new URL(url).hostname}`,
            };

            const uploadStream = cloudinary.uploader.upload_stream(
                options,
                (error, result) =>
                    result ? resolve(result.url) : reject(error)
            );

            streamifier.createReadStream(screenshotData).pipe(uploadStream);
        });
    } catch (error) {
        console.error("Failed to upload to Cloudinary: ", error);
        throw error;
    }
};
const url = process.argv[2];
if (url) start(url);
else console.log("url required");
