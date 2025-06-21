import { MongoClient } from "mongodb";

export const fetchUserTrainingSummary = async (req, res) => {
    try {
        const client = new MongoClient(process.env.DB_URI);
        await client.connect();
        const db = client.db('thinkzone')
        const collection = db.collection('transTchTraining');
        const aggregateQuery = [];
        aggregateQuery.push(
            {
                $match: {
                    contentStatus: "complete",
                    quiz1Status: "complete",
                    assignmentStatus: "complete",
                    feedbackStatus: "complete",
                    // topicIsComplete: true
                }
            },
            {
                $lookup: {
                    from: "master_user",
                    localField: "userid",
                    foreignField: "userid",
                    as: "userInfo"
                }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "masterTchTrainingModules",
                    localField: "moduleId",
                    foreignField: "moduleId",
                    as: "moduleInfo"
                }
            },
            { $unwind: { path: "$moduleInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "masterTchTrainingSubmodules",
                    localField: "submoduleId",
                    foreignField: "submoduleId",
                    as: "submoduleInfo"
                }
            },
            { $unwind: { path: "$submoduleInfo", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: {
                        userId: "$userid",
                        userName: "$userInfo.username",
                        moduleId: "$moduleId",
                        moduleName: "$moduleInfo.moduleName",
                        submoduleId: "$submoduleId",
                        submoduleName: "$submoduleInfo.submoduleName"
                    },
                    topics: {
                        $push: {
                            topicId: "$topicId",
                            topicName: "$topicName",
                            status: "completed"
                        }
                    },
                    completionDate: { $max: "$createdOn" }
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$_id.userId",
                        userName: "$_id.userName"
                    },
                    totalCompletedModules: { $addToSet: "$_id.moduleId" },
                    totalCompletedSubmodules: { $addToSet: "$_id.submoduleId" },
                    totalCompletedTopics: { $sum: { $size: "$topics" } },
                    trainingDetails: {
                        $push: {
                            moduleId: "$_id.moduleId",
                            moduleName: "$_id.moduleName",
                            status: "completed",
                            completionDate: "$completionDate",
                            completedSubmodules: [
                                {
                                    submoduleId: "$_id.submoduleId",
                                    submoduleName: "$_id.submoduleName",
                                    status: "completed",
                                    completionDate: "$completionDate",
                                    completedTopics: "$topics"
                                }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    userId: "$_id.userId",
                    userName: "$_id.userName",
                    _id: 0,
                    totalCompletedModules: { $size: "$totalCompletedModules" },
                    totalCompletedSubmodules: { $size: "$totalCompletedSubmodules" },
                    totalCompletedTopics: 1,
                    trainingDetails: 1,
                }
            },
            {
                $sort: {
                    userId: 1
                }
            }
        );
        const result = await collection.aggregate(aggregateQuery).toArray().catch((e) => {
            console.error(e);
            throw new Error('Can not fetch data right now');
        });
        res.json(result);

    } catch (err) {
        console.error(err);
    }
}
