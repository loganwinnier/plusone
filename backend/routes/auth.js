"use strict";

/** Routes for authentication. */

const express = require("express");
const router = new express.Router();
const Auth = require("../helpers/auth");

/** POST /auth/login:  {login , password } => { token }
 * 
 * login is the primary form for auth email/phone-number since optional
 * choice.
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
    const { login, password } = req.body;

    const user = await Auth.authenticate(login, password);
    const token = Auth.createToken(user);
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

    const newUser = await Auth.register({ ...req.body });
    const token = Auth.createToken(newUser);
    return res.status(201).json({ token });
});


module.exports = router;