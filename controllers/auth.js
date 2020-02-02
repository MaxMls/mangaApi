const bcrypt = require('bcrypt');
const models = require("../database/models");
const jwt = require('jsonwebtoken');

module.exports = {

    async defUserModel(req, res, next) {
        try {
            let token = req.body.token;
            let userObj = jwt.verify(token, process.env.JWT_SECRET);
            req.userModel = await models.user.findOne({
                where: {
                    id: userObj.id
                }
            });
        } catch (e) {
            req.userModel = null;
        }
        next();
    },
    async authLogin(req, res) { //аутентификация
        try {
            const {name, passwordHash} = req.body;

            const user = await models.user.findOne({where: {name}});

            if (!user || !bcrypt.compareSync(user.password, passwordHash)) {
                throw new Error('Invalid username or password')
            }

            const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET)
            return res.json({token: accessToken})
        } catch (e) {
            return res.status(401).json({error: e.message})
        }
    },

    authLogout(req, res) {
        return res.status(200).json({status: 'OK'})
    },

    async authProfile(req, res) {
        const {id, name} = req.userModel;
        return res.json({id, name})

    }
};
