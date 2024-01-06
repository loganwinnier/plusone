
"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const bcrypt = require("bcrypt");
const { UnauthorizedError, BadRequestError } = require("../expressError");
const { prisma } = require("../prisma");
const { BCRYPT_WORK_FACTOR } = require("../config");


class Auth {


    /** authenticate - {primary**email or phoneNumber**, inputPassword}
     * 
     * authenticates a email/phone and password
     * 
     * returns user object or throws error
     */
    static async authenticate(primary, inputPassword) {
        console.log(primary, inputPassword);
        let user = null;
        let type = null;
        console.log("In authenticate");
        if (primary.includes("@")) {
            console.log("email block");
            type = "email";
            try {
                user = await prisma.user.findUniqueOrThrow({
                    where: {
                        email: primary,
                    },
                });
                console.log(user);
            } catch (err) {
                console.log("failed to find user");
                throw new BadRequestError(`No account with ${ type } ${ primary }`);
            };

        } else {
            type = "phone";
            console.log("phone block");
            try {
                user = await prisma.user.findUniqueOrThrow({
                    where: {
                        phoneNumber: primary,
                    },
                });
                console.log(user);
            } catch (err) {
                console.log("failed to find user");
                throw new BadRequestError(`No account with ${ type } ${ primary }`);
            };
        };

        if (user) {
            console.log("I have a user");
            const valid = await bcrypt.compare(inputPassword, user.password);
            if (valid) {
                delete user.password;
                return user;
            }
        }
        console.log("Unauthorized");
        throw new UnauthorizedError(`invalid ${ type } or password`);
    }


    /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

    static async register(userInfo) {
        const duplicateCheck = await prisma.user.findMany({
            where: {
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber
            }
        });

        if (duplicateCheck.length) throw new
            BadRequestError('Email or phone number are already registered');

        const hashedPassword = await bcrypt.hash(userInfo.password, BCRYPT_WORK_FACTOR);

        try {
            const user = await prisma.user.create({
                data: {
                    isAdmin: false,
                    email: userInfo.email,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    password: hashedPassword,
                    phoneNumber: userInfo.phoneNumber
                }
            });

            delete user.password;
            return user;
        } catch (err) {
            throw new BadRequestError("Please fill out required fields");
        }
    }


    static async createProfile(data) {
        const profile = await prisma.user.create({
            data: {
                ...data,
            },
            include: { user: true }
        });

        return profile;
    };


    /** return signed JWT {username, isAdmin} from user data. */
    static createToken(user) {
        console.assert(user.isAdmin !== undefined,
            "createToken passed user without isAdmin property");

        let payload = {
            email: user.email,
            phone: user.phoneNumber,
            isAdmin: user.isAdmin || false,
        };

        return jwt.sign(payload, SECRET_KEY);
    }

}

module.exports = Auth;