import { Program } from "../models/Program.js";
// GET /api/programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.status(200).json(programs);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// POST /api/programs
export const createProgram = async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
