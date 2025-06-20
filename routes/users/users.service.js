import { UserDBOperations } from "./users.class.js";
import { comparePassword } from "./utils/comparePassword.js";
import { generateAccesstoken } from "./utils/generateAccesstoken.js";
import { hashPassword } from "./utils/hashPassword.js";
import { verifyAccesstoken } from "./utils/verifyAccesstoken.js";

export const registerUser = async (req, res, next) => {
    try {
        const { body } = req;
        console.log("BODY____", body);
        const { username, email, password, role, district, registeredAt } = body;

        /**
         * @todo Validation for username & email & password format
        */
        if (email.indexOf("@") === -1 || email.charAt(1) === '@') {
            throw new Error('Invalid email.');
        }




        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) throw new Error('Error during password hashing');
        const existingEmail = await UserDBOperations.getAllData({ email }, 1, 0);
        if (existingEmail && existingEmail.length > 0) {
            throw new Error('Email is already in use.')
        }
        const existingUsername = await UserDBOperations.getAllData({ username }, 1, 0);
        if (existingUsername && existingUsername.length > 0) {
            throw new Error('Username is already in use.')
        }
        const newUser = await UserDBOperations.createDatum({
            username,
            email,
            password: hashedPassword,
            role: role ? role : 'user',
            district,
            registeredAt: registeredAt ? new Date(registeredAt) : new Date()
        });
        newUser.password = undefined;
        res.json(newUser);
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const { body } = req;
        const { username, email, password } = body;
        if (!username && !email) throw new Error('Provide your username or email.');
        if (!password) throw new Error('Password is required');

        const dbQuery = {};
        if (username) dbQuery.username = username;
        else dbQuery.email = email;

        const existingUser = await UserDBOperations.getAllData(dbQuery, 1, 0);
        if (!existingUser || existingUser.length === 0) {
            throw new Error('User does not exists');
        }

        const isValidPassword = await comparePassword(password, existingUser[0].password);
        if (!isValidPassword) {
            throw new Error('Invalid Password');
        }
        console.log(existingUser[0]);
        const accessToken = generateAccesstoken(existingUser[0]);
        if (!accessToken) {
            throw new Error('Error while generating accesstoken.');
        }
        existingUser[0].password = undefined;
        res.json({
            accessToken,
            user: existingUser[0]
        });
    } catch (err) {
        next(err);
    }
}

export const fetchProfile = async (req, res, next) => {
    try {
        const { headers } = req;
        const { authorization } = headers;
        if (!authorization) throw new Error('Invalid login attempt, accesstoken should be provided in headers.')
        const decodedObj = verifyAccesstoken(authorization.slice(7));
        if (decodedObj) {
            res.json({
                username: decodedObj.username,
                email: decodedObj.email,
                role: decodedObj.role,
                createdAt: decodedObj.createdAt
            });
        }

    } catch (err) {
        next(err);
    }
}