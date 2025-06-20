import { MongoClient } from "mongodb";
import mongoose from "mongoose";

export const fetchMessageStats = async (req, res) => {
    try {
        console.log(req.params);
        const { params } = req;
        const { district } = params;
        const client = new MongoClient(process.env.WP_DB_URI);
        await client.connect();
        const db = client.db('whatsapp')
        const collection = db.collection('prakashak_students')
        // const collection = db.collection('meta_conversations')
        // console.log(collection);
        console.log(district);
        const aggregateQuery = [];
        // aggregateQuery.push(
        //     {
        //         $facet: {
        //             totalMessages: [
        //                 {
        //                     $match: {
        //                         district,
        //                     },
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: 'meta_conversations',
        //                         let: { phone: '$phone_number' },
        //                         pipeline: [
        //                             {
        //                                 $match: {
        //                                     $expr: { $eq: ['$contact', '$$phone'] }
        //                                 }
        //                             },
        //                             // {
        //                             //     $group: {
        //                             //         _id: "$type",
        //                             //         count: { $sum: "$type" }
        //                             //     }
        //                             // }
        //                         ],
        //                         as: 'metaConversationData'
        //                     }
        //                 },
        //                 // {
        //                 //     $switch: {
        //                 //         branches: [
        //                 //             {
        //                 //                 case: { $eq: ["$metaConversationData.type", 'sent'] }, then: 'sent'
        //                 //             },
        //                 //             {
        //                 //                 case: {}, then: {}
        //                 //             },
        //                 //         ],
        //                 //         default: {}
        //                 //     }
        //                 // }

        //             ]
        //         },
        //     }
        //     // {
        //     //     $match: {
        //     //         district
        //     //     }
        //     // },
        //     // {
        //     //     $lookup: {
        //     //         from: 'meta_conversations',
        //     //         let: { phone: '$phone_number' },
        //     //         pipeline: [
        //     //             {
        //     //                 $match: {
        //     //                     $expr: { $eq: ['$contact', '$$phone'] }
        //     //                 }
        //     //             },
        //     //             {
        //     //                 $group: {
        //     //                     _id: "$type",
        //     //                     count: { $sum: "$type" }
        //     //                 }
        //     //             }
        //     //         ],
        //     //         as: 'metaConversationData'
        //     //     }
        //     // },
        // );

        aggregateQuery.push(
            {
                $lookup: {
                    from: 'prakashak_students',
                    let: { phone: '$contact' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$phone_number', '$$phone'] },
                                district
                            }
                        }
                    ],
                    as: 'studentdata'
                }
            }
        )
        const result = await collection.aggregate(aggregateQuery).toArray().catch((e) => console.error(e));
        console.log("result :: ", result);
        res.json(result);

    } catch (err) {
        console.error(err);
    }
}