import { MongoClient } from "mongodb";

export const fetchMessageStats = async (req, res) => {
    try {
        const { params } = req;
        const { district } = params;
        if (!district) throw new Error('District is required in params');
        const client = new MongoClient(process.env.WP_DB_URI);
        await client.connect();
        const db = client.db('whatsapp')
        const collection = db.collection('prakashak_students')
        // db.collection('meta_conversations').createIndex({ contact: 1 });
        // db.collection('prakashak_students').createIndex({ phone_number: 1 });
        const aggregateQuery = [];
        aggregateQuery.push(
            {
                $match: { district }
            },
            {
                $lookup: {
                    from: "meta_conversations",
                    localField: "phone_number",
                    foreignField: "contact",
                    as: "messages"
                }
            },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    "messages.type": { $in: ["sent", "received"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMessages: { $sum: 1 },
                    totalMessagesSent: {
                        $sum: {
                            $cond: [{ $eq: ["$messages.type", "sent"] }, 1, 0]
                        }
                    },
                    totalMessagesReceived: {
                        $sum: {
                            $cond: [{ $eq: ["$messages.type", "received"] }, 1, 0]
                        }
                    },
                    imageMessagesSent: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$messages.type", "sent"] }, { $eq: ["$messages.message.type", "image"] }] },
                                1, 0
                            ]
                        }
                    },
                    videoMessagesSent: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$messages.type", "sent"] }, { $eq: ["$messages.message.type", "video"] }] },
                                1, 0
                            ]
                        }
                    },
                    textMessagesSent: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$messages.type", "sent"] }, { $eq: ["$messages.message.type", "text"] }] },
                                1, 0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    district: 1,
                    totalMessages: 1,
                    totalMessagesSent: 1,
                    totalMessagesReceived: 1,
                    imageMessagesSent: 1,
                    videoMessagesSent: 1,
                    textMessagesSent: 1
                }
            }
        );
        const result = await collection.aggregate(aggregateQuery).toArray().catch((e) => {
            console.error(e);
            throw new Error('Can not fetch data right now');
        });
        res.json(result[0]);

    } catch (err) {
        console.error(err);
    }
}