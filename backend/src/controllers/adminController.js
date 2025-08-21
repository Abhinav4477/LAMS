import State from "../models/States.js";

//Function to add a new state
export const addState = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "State name is required" });
    }

    try {
        const existingState = await State.findOne({ name });

        if (existingState) {
            return res.status(400).json({ error: "State already exists" });
        }

        const newState = new State({ name });
        await newState.save();

        return res.status(201).json({ message: "State added successfully", state: newState });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}