import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });

        await newMessage.save(); //

        // todo: realtime functionality goes here socket.io
        
    } catch (error) {
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};