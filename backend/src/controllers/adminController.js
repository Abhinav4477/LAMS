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

export const getStates = async (req, res) => {
    try {
        const states = await State.find().sort({ name: 1 });
        return res.status(200).json(states);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteState = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "State ID is required" });
    }

    try {
        const state = await State.findByIdAndDelete(id);

        if (!state) {
            return res.status(404).json({ error: "State not found" });
        }

        return res.status(200).json({ message: "State deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const updateState = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "State ID and name are required" });
  }

  try {
    const updatedState = await State.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedState) {
      return res.status(404).json({ error: "State not found" });
    }

    return res
      .status(200)
      .json({ message: "State updated successfully", state: updatedState });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getStateById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "State ID is required" });
  }

  try {
    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    return res.status(200).json(state);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
