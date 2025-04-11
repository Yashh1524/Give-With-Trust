import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    // Endpoint for image uploads
    ngoImage: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                return { fileUrl: file.url };
            } catch (error) {
                console.error("Error in onUploadComplete (postImage):", error);
                throw error;
            }
        }),

    profileImage: f({
        image: {
            maxFileSize: "1MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                return { fileUrl: file.url };
            } catch (error) {
                console.error("Error in onUploadComplete (postImage):", error);
                throw error;
            }
        }),

    ngoImages: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 10,
        },
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                return { fileUrl: file.url };
            } catch (error) {
                console.error("Error in onUploadComplete (postImage):", error);
                throw error;
            }
        }),

    // Endpoint for NGO proof PDF uploads
    ngoProof: f({
        pdf: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                return { fileUrl: file.url };
            } catch (error) {
                console.error("Error in onUploadComplete (ngoProof):", error);
                throw error;
            }
        }),

    ngoMonthlyProofs: f({
        pdf: {
            maxFileSize: "4MB",
            maxFileCount: 10,
        },
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                return { fileUrl: file.url };
            } catch (error) {
                console.error("Error in onUploadComplete (ngoProof):", error);
                throw error;
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
