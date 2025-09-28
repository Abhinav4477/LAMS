import State from "../models/States.js";
import District from "../models/Districts.js";
import Location from "../models/Location.js";
import Category from "../models/Category.js";
import User from "../models/Users.js";
import ServiceProvider from "../models/ServiceProvider.js";

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
//Function to add a new location
export const addLocation = async (req, res) => {
    const { name, districtId } = req.body;

    if (!name || !districtId) {
        return res.status(400).json({ error: "Location name and district ID are required" });
    }

    try {
        const existingLocation = await Location.findOne({ name, district: districtId });

        if (existingLocation) {
            return res.status(400).json({ error: "Location already exists in this district" });
        }

        const newLocation = new Location({ name, district: districtId });
        await newLocation.save();

        return res.status(201).json({ message: "Location added successfully", location: newLocation });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//Function to get all locations with their associated district and state names
export const getAllLocations = async (req, res) => {
  try {
    // Populate district and state
    const locations = await Location.find()
      .populate({
        path: "district",
        select: "name state", // get district name and state reference
        populate: { path: "state", select: "name" } // populate state name
      })
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch locations", error: error.message });
  }
};

//Fuction to delete a location
export const deleteLocation = async (req, res) => { 
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Location ID is required" });
  }

  try {
    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    return res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

//Fuction to update a location
export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, districtId } = req.body;

  if (!id || !name || !districtId) {
    return res.status(400).json({ error: "Location ID, name, and district ID are required" });
  }

  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { name, district: districtId },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    return res
      .status(200)
      .json({ message: "Location updated successfully", location: updatedLocation });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
//Function to get location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find location and populate district and state details
    const location = await Location.findById(id)
      .populate({
        path: "district",
        populate: { path: "state" },
      });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get locations filtered by district (and optionally by state)
export const getLocationsByDistrict = async (req, res) => {
 try {
 const { districtId } = req.params; // get districtId from URL param
 if (!districtId)
 { return res.status(400).json({ message: "District ID is required" }); } // Fetch locations that belong to this district 
const locations = await Location.find({ district: districtId }).populate({ path: "district",
 populate: { path: "state" }, 
});
 res.json(locations); }
 catch (error)
 { console.error(error); res.status(500).json({ message: "Failed to fetch locations" });
 } 
};
//Function to add a new category
export const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
//Function to get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

//Function to delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

//Function to update a category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "Category ID and name are required" });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

//Function to get a specific category by id
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}


// ✅ Get all unverified service provider requests
export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find()
      .populate("user", "username email"); // only populate user info now

    const requests = providers.map((p) => ({
      providerId: p._id,
      username: p.user?.username || "N/A",
      email: p.user?.email || "N/A",
      is_verified: p.is_verified,
    }));

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ Verify a service provider
// PUT /api/admin/verifyserviceprovider/:id
export const verifyServiceProvider = async (req, res) => {
  const { id } = req.params;
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      id,
      { is_verified: true },
      { new: true } // important: return the updated object
    );
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    return res.status(200).json({ message: "Provider verified", provider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ Revoke verification
// PUT /api/admin/revokeserviceprovider/:id
export const revokeServiceProvider = async (req, res) => {
  const { id } = req.params;
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      id,
      { is_verified: false },
      { new: true } // important
    );
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    return res.status(200).json({ message: "Provider revoked", provider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
