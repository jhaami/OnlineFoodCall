const express = require("express");
const router = express.Router()
const Puser = require('../models/Puser');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecrect = "mynameisAmitKumarJhaIamformNepalok"
router.post('/creatuser', [
    body('name').isLength({ min: 5 }),
    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password', 'minimum 5 charter').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let setPassword = await bcrypt.hash(req.body.password, salt);
        try {
            await Puser.create({
                name: req.body.name,
                password: setPassword,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

router.post('/loginuser',
    [

        // username must be an email
        body('email').isEmail(),
        // password must be at least 5 chars long
        body('password', 'minimum 5 charter').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await Puser.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "try to correct  email " });
            }

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "try to correct password" });
            }
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecrect)
            return res.json({ success: true, authToken: authToken });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })
module.exports = router;
