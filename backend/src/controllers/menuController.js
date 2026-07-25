import MenuItem from "../models/MenuItem.js";

// GET /api/menu?search=burger&category=Burgers
export const getAllMenuItems = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    // .populate pulls in the linked Inventory doc so we can read its quantity
    const menuItems = await MenuItem.find(filter).populate('inventoryItem');

    // attach inStock/stockQty, then strip inventoryItem so we don't leak cost price etc. to customers
    const withStock = menuItems.map(item => {
      const obj = item.toObject();
      if (obj.inventoryItem) {
        obj.inStock = obj.inventoryItem.quantity > 0;
        obj.stockQty = obj.inventoryItem.quantity;
      } else {
        obj.inStock = true; // not linked to inventory — always orderable
      }
      delete obj.inventoryItem;
      return obj;
    });

    res.status(200).json(withStock);

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