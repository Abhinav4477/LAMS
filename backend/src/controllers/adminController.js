import State from "../models/States.js";
import District from "../models/Districts.js";

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

//get all states
export const getStates = async (req, res) => {
    try {
        const states = await State.find().sort({ name: 1 });
        return res.status(200).json(states);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//delete a state
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

//update a state
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

//get a specific state by id
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

export const addDistrict = async (req, res) => {
    const { name, stateId } = req.body;

    if (!name || !stateId) {
        return res.status(400).json({ error: "District name and state ID are required" });
    }

    try {
        const existingDistrict = await District.findOne({ name, state: stateId });

        if (existingDistrict) {
            return res.status(400).json({ error: "District already exists in this state" });
        }

        const newDistrict = new District({ name, state: stateId });
        await newDistrict.save();

        return res.status(201).json({ message: "District added successfully", district: newDistrict });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
//Function to get all districts with their associated state names
export const getDistricts = async (req, res) => {
    try {
        const districts = await District.find().populate('state', 'name').sort({ name: 1 });
        return res.status(200).json(districts);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//Function to get districts by state ID
export const getDistrictsByState = async (req, res) => {
    const { stateId } = req.params;

    if (!stateId) {
        return res.status(400).json({ error: "State ID is required" });
    }

    try {
        const districts = await District.find({ state: stateId })
            .populate("state", "name") // ✅ Add this
            .sort({ name: 1 });

        return res.status(200).json(districts);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

//delete a district
export const deleteDistrict = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "District ID is required" });
    }

    try {
        const district = await District.findByIdAndDelete(id);

        if (!district) {
            return res.status(404).json({ error: "District not found" });
        }

        return res.status(200).json({ message: "District deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//update a district
export const updateDistrict = async (req, res) => {
    const { id } = req.params;
    const { name, stateId } = req.body;

    if (!id || !name || !stateId) {
        return res.status(400).json({ error: "District ID, name, and state ID are required" });
    }

    try {
        const updatedDistrict = await District.findByIdAndUpdate(
            id,
            { name, state: stateId },
            { new: true }
        );

        if (!updatedDistrict) {
            return res.status(404).json({ error: "District not found" });
        }

        return res.status(200).json({ message: "District updated successfully", district: updatedDistrict });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

//display district by id
export const getDistrictById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "District ID is required" });
    }

    try {
        const district = await District.findById(id).populate('state', 'name');
        if (!district) {
            return res.status(404).json({ error: "District not found" });
        }
        return res.status(200).json(district);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}