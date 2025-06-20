import User from "./users.model.js";

export class UserDBOperations {
    static async getAllData(dbQuery, $limit, $skip) {
        if ($limit || $skip) {
            const limit_value = $limit ? $limit : 10;
            const skip_value = $skip ? $skip : 0;
            return User.find(dbQuery).skip(skip_value).limit(limit_value);
        } else {
            return User.find(dbQuery);
        }
    }
    static async createDatum(dbBody) {
        return User.create(dbBody);
    }
}