
"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const bycrpt = require("bcrypt");
const { UnauthorizedError, BadRequestError } = require("../expressError");
const { prisma } = require("../app");


class Auth {


    /** authenticate - {primary**email or phoneNumber**, inputPassword}
     * 
     * authenticates a email/phone and password
     * 
     * returns user object or throws error
     */
    static async authenticate(primary, inputPassword) {
        let user = null;
        let type;
        if (primary.includes("@")) {
            type = "email";
            user = await prisma.user.findFirst({
                where: {
                    email: primary,

                },
            }).catch((err) => {
                console.error("failed to find user");
                return res.json({
                    error: {
                        message: `Unable to find user ${ req.username }`,
                        status: 400
                    }
                });
            });
        } else {
            type = "phone";
            user = await prisma.user.findFirst({
                where: {
                    email: primary,

                },
            }).catch((err) => {
                console.error("failed to find user");
                return res.json({
                    error: {
                        message: `Unable to find user ${ req.username }`,
                        status: 400
                    }
                });
            });
        }

        if (user) {

            const valid = await bycrpt.compare(inputPassword, user.password);
            if (valid) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError(`invalid ${ type } or password`);
    }


    /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

    static async register(userInfo) {
        const duplicateCheck = user = await prisma.user.findMany({
            where: {
                email: userInfo.email,
                phone: userInfo.phoneNumber
            }
        });

        if (duplicateCheck.length) throw new
            BadRequestError('Email or phone number are already registered');

        const hashedPassword = await bcrypt.hash(userInfo.password, BCRYPT_WORK_FACTOR);

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