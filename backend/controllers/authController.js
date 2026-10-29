const bcrypt = require("bcryptjs");
const Therapist = require("../models/Therapist");

async function registerTherapist(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingTherapist = await Therapist.findOne({
            email: normalizedEmail
        });

        if (existingTherapist) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        const password_hash = await bcrypt.hash(password, 12);

        const therapist = await Therapist.create({
            name: name.trim(),
            email: normalizedEmail,
            password_hash
        });

        return res.status(201).json({
            message: "Therapist registered successfully",
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
}

async function loginTherapist(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const therapist = await Therapist.findOne({
            email: normalizedEmail
        }).select("+password_hash");

        if (!therapist) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            therapist.password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = require("jsonwebtoken").sign(
            { therapistId: therapist._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Login failed"
        });
    }
}

module.exports = { registerTherapist, loginTherapist };