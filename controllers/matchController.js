const Match = require('../models/Match');
const Student = require('../models/Student'); // Corrected the model import

// Post a like
const postLike = async (req, res) => {
    const { likedby, likedto } = req.body;
    try {
        const existingMatch = await Match.findOne({
            $or: [
                { likedby, likedto },
                { dislikedby: likedby, dislikedto: likedto }
            ]
        });

        if (existingMatch) {
            existingMatch.likedby = likedby;
            existingMatch.likedto = likedto;
            existingMatch.dislikedby = undefined;
            existingMatch.dislikedto = undefined;
            existingMatch.dateTime = new Date();
            await existingMatch.save();
        } else {
            const response = await Match.findOneAndUpdate(
                { likedby, likedto },
                { likedby, likedto, dateTime: new Date() },
                { upsert: true, new: true }
            );
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ message: "Error posting like", error });
    }
};

// Post a dislike
const postDislike = async (req, res) => {
    const { dislikedby, dislikedto } = req.body;
    try {
        const existingMatch = await Match.findOne({
            $or: [
                { dislikedby, dislikedto },
                { likedby: dislikedby, likedto: dislikedto }
            ]
        });

        if (existingMatch) {
            existingMatch.dislikedby = dislikedby;
            existingMatch.dislikedto = dislikedto;
            existingMatch.likedby = undefined;
            existingMatch.likedto = undefined;
            existingMatch.dateTime = new Date();
            await existingMatch.save();
        } else {
            const response = await Match.findOneAndUpdate(
                { dislikedby, dislikedto },
                { dislikedby, dislikedto, dateTime: new Date() },
                { upsert: true, new: true }
            );
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ message: "Error posting dislike", error });
    }
};

// Post a crush
const postCrush = async (req, res) => {
    const { crushby, crushto } = req.body;
    try {
        const response = await Match.findOneAndUpdate(
            { crushby, crushto }, 
            { crushby, crushto, dateTime: new Date() }, 
            { upsert: true, new: true }
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error posting crush", error });
    }
};

// Get crush likes and power couples
const getCrushLikes = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const matches = await Match.find();
        const mutualMatches = [];
        const powerCouples = [];
        const seenMatches = new Set(); // To avoid duplicate entries

        for (const match of matches) {
            // Check for mutual likes
            if ((match.likedby === email || match.likedto === email) && !seenMatches.has(match._id.toString())) {
                const reverseMatch = matches.find(m => 
                    m.likedby === match.likedto && m.likedto === match.likedby
                );

                if (reverseMatch) {
                    const userA = await Student.findOne({ email: match.likedby });
                    const userB = await Student.findOne({ email: match.likedto });
                    mutualMatches.push({
                        userA: {
                            email: userA.email,
                            name: userA.name,
                            dp: userA.dp,
                            lastMessage: userA.lastMessage,
                            lastSeen: userA.lastSeen,
                        },
                        userB: {
                            email: userB.email,
                            name: userB.name,
                            dp: userB.dp,
                            lastMessage: userB.lastMessage,
                            lastSeen: userB.lastSeen,
                        },
                        type: 'match',
                    });
                    seenMatches.add(reverseMatch._id.toString());
                }
            }

            // Check for power couples (mutual crushes required)
            if ((match.crushby === email || match.crushto === email) && !seenMatches.has(match._id.toString())) {
                const reverseCrush = matches.find(m => 
                    m.crushby === match.crushto && m.crushto === match.crushby
                );

                if (reverseCrush) {
                    const userA = await Student.findOne({ email: match.crushby });
                    const userB = await Student.findOne({ email: match.crushto });
                    powerCouples.push({
                        userA: {
                            email: userA.email,
                            name: userA.name,
                            dp: userA.dp,
                            lastMessage: userA.lastMessage,
                            lastSeen: userA.lastSeen,
                        },
                        userB: {
                            email: userB.email,
                            name: userB.name,
                            dp: userB.dp,
                            lastMessage: userB.lastMessage,
                            lastSeen: userB.lastSeen,
                        },
                        type: 'power couple',
                    });
                    seenMatches.add(reverseCrush._id.toString());
                }
            }
        }

        res.status(200).json({ mutualMatches, powerCouples });
    } catch (error) {
        res.status(500).json({ message: "Error fetching matches", error });
    }
};

module.exports = {
    postLike,
    postDislike,
    postCrush,
    getCrushLikes
};
