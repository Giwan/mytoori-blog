const puppeteer = require("puppeteer")
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")

/**
 * Note this information is not visible
 * directly on the web but should
 * still be in an env variable
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_ACCOUNT,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const headers = {
    "Content-Type": "application/json",
}

exports.handler = async (event) => {
    try {
        const { url } = JSON.parse(event.body)

        if (!url) {
            return {
                statusCode: 400,
                headers,
                body: "url required",
            }
        }

        const screenshotData = await makePDF(url)
        await uploadToCloudinary(screenshotData, url)

        return {
            statusCode: 200,
            headers,
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error }),
        }
    }
}

const makePDF = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        height: 1024,
        width: 375,
        deviceScaleFactor: 1,
        isMobile: false,
    })
    await page.goto(url, { waitUntil: "networkidle2" })

    const screenshotData = await page.screenshot()

    await browser.close()

    return screenshotData
}

const uploadToCloudinary = async (screenshotData, url) => {
    try {
        const location = new URL(url)

        const uploadStream = cloudinary.uploader.upload_stream({
            public_id: `landing_pages/${location.hostname}`,
        })

        streamifier.createReadStream(screenshotData).pipe(uploadStream)
    } catch (error) {
        console.error("Failed to upload to Cloudinary: ", error)
        throw error
    }
}
