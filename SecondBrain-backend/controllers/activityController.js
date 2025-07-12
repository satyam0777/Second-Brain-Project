import Activity from '../models/activity.js';


export const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10); 

    res.json(activities); 
  } catch (err) {
    console.error("Error fetching activities", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};