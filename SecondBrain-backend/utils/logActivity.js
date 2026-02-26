import Activity from '../models/activity.js';



 const logActivity = async (userId, type, description, resourceId = null) => {
  try {
    const activity = new Activity({
      user: userId,
      type,
      description,
      resourceId, // ✅ note._id saved here
    });
    await activity.save();
  } catch (err) {
    console.error("Activity logging error:", err.message);
  }
};
export default logActivity;