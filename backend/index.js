import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import multer from "multer";
import registeredUsers from "./models/registeredUsers.js";
import modelEmployeeRegister from "./models/modelEmployeeRegister.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to DB"))
    .catch(error => console.error("Problem connecting to DB:", error));

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Images");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// Registration form data handling
app.post("/register", async (req, res) => {
    try {
        const existingUser = await registeredUsers.findOne({ email: req.body.email });
        if (existingUser) {
            return res.json("Email already registered.");
        }
        const newUser = new registeredUsers(req.body);
        await newUser.save();
        res.json("User registered successfully.");
    } catch (error) {
        res.json("Registration problem.");
    }
});

// Login action handling
app.post("/login", async (req, res) => {
    try {
        const user = await registeredUsers.findOne({ email: req.body.email });
        if (user && user.cnfPassword === req.body.password) {
            res.json({ status: "success", id: user._id });
        } else {
            res.json({ status: "fail" });
        }
    } catch (error) {
        res.json({ status: "noUser" });
    }
});

// Respond user data to Dashboard component
app.get("/user/:ID", async (req, res) => {
    try {
        const user = await registeredUsers.findById(req.params.ID);
        res.json(user ? user.name : "User not found");
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.json("Problem retrieving user.");
    }
});

// Store create-employee form data
app.post("/employees", upload.single("image"), async (req, res) => {
    try {
        const existingEmployee = await modelEmployeeRegister.findOne({ email: req.body.email });
        if (existingEmployee) {
            return res.json("Email already registered.");
        }
        const newEmployee = new modelEmployeeRegister({
            ...req.body,
            image: req.file ? req.file.filename : ""
        });
        await newEmployee.save();
        res.json("Employee data saved successfully.");
    } catch (error) {
        res.json("Error saving employee data.");
    }
});

// Respond employee list
app.get("/employee-list", async (req, res) => {
    try {
        const employees = await modelEmployeeRegister.find();
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employee list:", error);
        res.json("Problem fetching employee list.");
    }
});

// Edit employee - send data
app.get("/employee-list/:ID", async (req, res) => {
    try {
        const employee = await modelEmployeeRegister.findById(req.params.ID);
        res.json(employee || "Employee not found");
    } catch (error) {
        console.error("Error retrieving employee:", error);
        res.json("Problem retrieving employee.");
    }
});

// Edit employee - update values
app.put("/employee-list/:ID", upload.single("image"), async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            ...(req.file && { image: req.file.filename })
        };
        await modelEmployeeRegister.findByIdAndUpdate(req.params.ID, updatedData);
        res.json("Employee data updated successfully.");
    } catch (error) {
        console.error("Error updating employee:", error);
        res.json("Problem updating employee.");
    }
});

// Delete employee
app.delete("/employee-list/:ID", async (req, res) => {
    try {
        await modelEmployeeRegister.findByIdAndDelete(req.params.ID);
        res.json("Employee deleted successfully.");
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.json("Problem deleting employee.");
    }
});

// Start the server
app.listen(4001, () => {
    console.log("Server listening on port 4001...");
});
