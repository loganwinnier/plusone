"use strict";

/** Routes for authentication. */

const express = require("express");
const router = new express.Router();
const Auth = require("../helpers/auth");
const { BadRequestError } = require("../expressError");
const { validateRegister, validateLogin } = require("../middleware/validation");


/** POST /auth/login:  {login , password } => { token }
 * 
 * login is the primary form for auth email/phone-number since optional
 * choice.
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", validateLogin, async function (req, res, next) {
    if (res.locals.errors) return res.json({ error: res.locals.errors.details[0].message });

    const password = req.body.password;
    const primary = req.body.email ? req.body.email : req.body.phoneNumber;
    console.log(primary);
    if (!primary) return res.json({ error: new BadRequestError("email or phone required") });

    try {
        const user = await Auth.authenticate(primary, password);
        console.log("Authenticated User");
        const token = Auth.createToken(user);
        return res.json({ token });
    } catch (err) {
        console.error("failed to authenticate", err);
        return res.json({ error: err });
    }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", validateRegister, async function (req, res, next) {
    if (res.locals.errors) return res.json({ error: res.locals.errors.details[0].message });
    try {
        console.log("THIS DA locals data", res.locals.data);
        const newUser = await Auth.register(res.locals.data);
        const token = Auth.createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return res.json({ error: err });
    }
});


module.exports = router;