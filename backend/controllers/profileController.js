const Therapist = require("../models/Therapist");

async function getMyProfile(req, res) {
try {
const therapist = await Therapist.findById(
req.therapistId
).select("-password_hash");


    if (!therapist) {
        return res.status(404).json({
            message: "Therapist profile not found"
        });
    }

    return res.status(200).json({
        message: "Profile retrieved successfully",
        therapist
    });
} catch (error) {
    console.error("Profile retrieval error:", error.message);

    return res.status(500).json({
        message: "Unable to retrieve profile"
    });
}


}

async function updateMyProfile(req, res) {
try {
const { qualification, specialization, bio } = req.body;


    const therapist = await Therapist.findById(
        req.therapistId
    );

    if (!therapist) {
        return res.status(404).json({
            message: "Therapist profile not found"
        });
    }

    // Generate a URL-friendly identifier from the therapist's name.
    const baseSlug = therapist.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Preserve an existing slug, or create one if missing.
    if (!therapist.slug) {
        const existingSlug = await Therapist.findOne({
            slug: baseSlug,
            _id: { $ne: therapist._id }
        });

        therapist.slug = existingSlug
            ? `${baseSlug}-${therapist._id.toString().slice(-6)}`
            : baseSlug;
    }

    therapist.qualification = qualification ?? therapist.qualification;
    therapist.specialization = specialization ?? therapist.specialization;
    therapist.bio = bio ?? therapist.bio;

    await therapist.save();

    return res.status(200).json({
        message: "Profile updated successfully",
        therapist: {
            id: therapist._id,
            name: therapist.name,
            email: therapist.email,
            qualification: therapist.qualification,
            specialization: therapist.specialization,
            bio: therapist.bio,
            slug: therapist.slug
        }
    });
} catch (error) {
    console.error("Profile update error:", error.message);

    return res.status(500).json({
        message: "Unable to update profile"
    });
}


}

module.exports = {
getMyProfile,
updateMyProfile

};
async function getPublicProfile(req, res) {
    try {
        const therapist = await Therapist.findOne({
            slug: req.params.slug
        }).select("name qualification specialization bio slug");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist profile not found"
            });
        }

        return res.status(200).json({
            therapist
        });
    } catch (error) {
        console.error("Public profile error:", error.message);

        return res.status(500).json({
            message: "Unable to retrieve public profile"
        });
    }
}

async function getPublicProfile(req, res) {
    try {
        const therapist = await Therapist.findOne({
            slug: req.params.slug
        }).select("name qualification specialization bio slug");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist profile not found"
            });
        }

        return res.status(200).json({
            therapist
        });
    } catch (error) {
        console.error("Public profile error:", error.message);

        return res.status(500).json({
            message: "Unable to retrieve public profile"
        });
    }
}

// Keep this at the very bottom!
module.exports = {
    getMyProfile,
    updateMyProfile,
    getPublicProfile
};