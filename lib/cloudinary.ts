import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v12345/simtech-products/sample.jpg
 * returns: simtech-products/sample
 */
export const extractPublicId = (url: string): string | null => {
    try {
        if (!url || !url.includes('res.cloudinary.com')) return null;

        // Split by /upload/ to get the path after the version/upload tag
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;

        // The public_id is after the version part (e.g., v12345/folder/id.jpg)
        const pathParts = parts[1].split('/');

        // Remove version part if it exists (starts with 'v' followed by digits)
        if (pathParts[0].match(/^v\d+$/)) {
            pathParts.shift();
        }

        // Join the rest and remove extension
        const publicIdWithExt = pathParts.join('/');
        const publicId = publicIdWithExt.split('.')[0];

        return publicId;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};

/**
 * Deletes an image from Cloudinary using its URL
 */
export const deleteFromCloudinaryByUrl = async (url: string) => {
    const publicId = extractPublicId(url);
    if (!publicId) return null;

    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary deletion failed:', error);
        throw error;
    }
};

export default cloudinary;
