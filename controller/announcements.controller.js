import { isValidObjectId } from "mongoose";
import { Announcements } from "../models/announcements.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAnnouncement = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const announcement = await Announcements.create({
        content,
        owner: req.user?._id
    });

    if (!announcement) {
        throw new ApiError(500, "Something went wrong while creating the announcement");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, announcement, "Announcement created successfully"));
});

const getUserAnnouncements = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const announcements = await Announcements.find({ owner: userId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, announcements, "User announcements fetched successfully"));
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(announcementId)) {
        throw new ApiError(400, "Invalid announcement id");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const announcement = await Announcements.findById(announcementId);

    if (!announcement) {
        throw new ApiError(404, "Announcement not found");
    }

    if (announcement.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this announcement");
    }

    announcement.content = content;
    await announcement.save();

    return res
        .status(200)
        .json(new ApiResponse(200, announcement, "Announcement updated successfully"));
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;

    if (!isValidObjectId(announcementId)) {
        throw new ApiError(400, "Invalid announcement id");
    }

    const announcement = await Announcements.findById(announcementId);

    if (!announcement) {
        throw new ApiError(404, "Announcement not found");
    }

    if (announcement.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this announcement");
    }

    await Announcements.findByIdAndDelete(announcementId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Announcement deleted successfully"));
});

export {
    createAnnouncement,
    getUserAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};