import MenuItem from "../models/MenuItem.js";

// GET /api/menu?search=burger&category=Burgers
export const getAllMenuItems = async (req, res) => {
  try {
    // Get search query and category from URL params
    // Example: /api/menu?search=burger&category=Burgers
    const { search, category } = req.query;

    // Build the filter object dynamically
    let filter = {};

    // If search query exists → search in name and description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },        // "i" = case insensitive
        { description: { $regex: search, $options: "i" } },  // searches description too
      ];
    }

    // If category exists → filter by category
    if (category && category !== "All") {
      filter.category = category;
    }

    // Find items matching the filter
    const menuItems = await MenuItem.find(filter);

    res.status(200).json(menuItems);

  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// READ - Get single item by ID
export const getSingleMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu item.", error: error.message });
  }
};

// CREATE
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }
    const item = await MenuItem.create({ name, description, price, category, image, available });
    res.status(201).json({ message: "Menu item created.", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu item.", error: error.message });
  }
};

// UPDATE
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.status(200).json({ message: "Menu item updated.", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu item.", error: error.message });
  }
};

// DELETE
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.status(200).json({ message: "Menu item deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu item.", error: error.message });
  }
};