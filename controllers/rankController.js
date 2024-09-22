const Match = require('../models/Match');
const Student = require('../models/Student'); // Corrected model import for Student

// Function to get the top six male and female users based on likes and crushes received
const findTopSix = async (req, res) => {
    try {
        // Fetch all males and females from the Student collection
        const maleStudents = await Student.find({ gender: 'male' }, 'email name dp gender');
        const femaleStudents = await Student.find({ gender: 'female' }, 'email name dp gender');
        
        // Extract email lists for males and females
        const maleEmails = maleStudents.map(student => student.email); //
        const femaleEmails = femaleStudents.map(student => student.email);

        // Aggregate for top 6 male users based on likes (likedto)
        const topSixMaleLikes = await Match.aggregate([
            { $match: { likedto: { $in: maleEmails } } }, // Filter by male emails
            {
                $group: {
                    _id: "$likedto", // Group by the `likedto` field (email)
                    totalLikes: { $sum: 1 } // Count the number of occurrences for each `likedto`
                }
            },
            { $sort: { totalLikes: -1 } }, // Sort by totalLikes in descending order
            { $limit: 6 } // Limit the result to the top 6 users
        ]);

        // Aggregate for top 6 female users based on likes (likedto)
        const topSixFemaleLikes = await Match.aggregate([
            { $match: { likedto: { $in: femaleEmails } } }, // Filter by female emails
            {
                $group: {
                    _id: "$likedto", // Group by the `likedto` field (email)
                    totalLikes: { $sum: 1 } // Count the number of occurrences for each `likedto`
                }
            },
            { $sort: { totalLikes: -1 } }, // Sort by totalLikes in descending order
            { $limit: 6 } // Limit the result to the top 6 users
        ]);

        // Aggregate for top 6 male users based on crushes (crushto)
        const topSixMaleCrushes = await Match.aggregate([
            { $match: { crushto: { $in: maleEmails } } }, // Filter by male emails
            {
                $group: {
                    _id: "$crushto", // Group by the `crushto` field (email)
                    totalCrushes: { $sum: 1 } // Count the number of occurrences for each `crushto`
                }
            },
            { $sort: { totalCrushes: -1 } }, // Sort by totalCrushes in descending order
            { $limit: 6 } // Limit the result to the top 6 users
        ]);

        // Aggregate for top 6 female users based on crushes (crushto)
        const topSixFemaleCrushes = await Match.aggregate([
            { $match: { crushto: { $in: femaleEmails } } }, // Filter by female emails
            {
                $group: {
                    _id: "$crushto", // Group by the `crushto` field (email)
                    totalCrushes: { $sum: 1 } // Count the number of occurrences for each `crushto`
                }
            },
            { $sort: { totalCrushes: -1 } }, // Sort by totalCrushes in descending order
            { $limit: 6 } // Limit the result to the top 6 users
        ]);

        // Merge student details with the ranking data (for likes and crushes)
        const enrichWithStudentDetails = (rankedList, students) => {
            return rankedList.map(item => {
                const student = students.find(s => s.email === item._id);
                return {
                    ...item,
                    name: student ? student.name : "Unknown",
                    dp: student ? student.dp : "default_dp.jpg", // default image if not found
                    gender: student ? student.gender : "Unknown",
                    email: student ? student.email : "Unknown"
                };
            });
        };

        // Enrich male and female rankings with student details
        const enrichedMaleLikes = enrichWithStudentDetails(topSixMaleLikes, maleStudents);
        const enrichedFemaleLikes = enrichWithStudentDetails(topSixFemaleLikes, femaleStudents);
        const enrichedMaleCrushes = enrichWithStudentDetails(topSixMaleCrushes, maleStudents);
        const enrichedFemaleCrushes = enrichWithStudentDetails(topSixFemaleCrushes, femaleStudents);

        // Send the ranking data to the frontend
        res.status(200).json({
            topSixMaleLikes: enrichedMaleLikes,
            topSixFemaleLikes: enrichedFemaleLikes,
            topSixMaleCrushes: enrichedMaleCrushes,
            topSixFemaleCrushes: enrichedFemaleCrushes
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top users", error });
    }
};

module.exports = {
    findTopSix
};
