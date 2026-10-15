
import cloudinary from "./cloudinary.js";
import { Readable } from "stream";

const uploadToCloudinary = (
    buffer,
    folder = "foryoum/profile-pictures"
) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result);
                }
            );

        Readable.from([buffer]).pipe(uploadStream);
    });
};

export default uploadToCloudinary;