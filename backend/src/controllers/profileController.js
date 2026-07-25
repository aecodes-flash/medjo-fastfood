import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile.", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, homeAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, email, phone, homeAddress }, 
      { returnDocument: 'after', runValidators: true } // Updated option & added schema validation
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      user: {
        id:          user._id,
        username:    user.username,
        email:       user.email,
        role:        user.role,
        phone:       user.phone,
        homeAddress: user.homeAddress,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile.", error: error.message });
  }
};  