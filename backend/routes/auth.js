"use strict";

/** Routes for authentication. */
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");
const { PrismaClient: prisma } = require("../server");
/** POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
    user = await prisma.user.findUniqueOrThrow({
        where: {
            select: {
                phoneNumber: true,
                email: true
            },
            include: {
                password: true,
                firstName: true,
                lastName: true,
                events: true,
                matches: true,
                profile: true
            }
        }
    }).catch((err) => {
        console.error("failed to find user");
        return res.json({
            error: {
                message: `Unable to find user ${ req.username }`,
                status: 400
            }
        });
    });


    const user = await User.authenticate(user.email, user.password);
    const token = createToken(user);
    return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
});


module.exports = router;