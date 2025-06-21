import mongoose from "mongoose";
import User from "./users.model.js";

export class UserDBOperations {
    static async getAllData(dbQuery, $limit, $skip) {
        await mongoose.connect(process.env.DB_URI);
        if ($limit || $skip) {
            const limit_value = $limit ? $limit : 10;
            const skip_value = $skip ? $skip : 0;
            return User.find(dbQuery).skip(skip_value).limit(limit_value);
        } else {
            return User.find(dbQuery);
        }
    }
    static async createDatum(dbBody) {
        await mongoose.connect(process.env.DB_URI);
        return User.create(dbBody);
    }
}