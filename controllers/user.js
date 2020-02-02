const models = require("../database/models");


module.exports = {
    createUser: async (req, res) => {
        try {
            if (await models.user.findOne({where: {name: req.body.name}})) throw new Error("user already exists");

            const user = await models.user.create(
                {...req.body, role: 0}
            );
            return res.status(201).json({
                user
            });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await models.user.findAll({
                /*attributes: ['id', 'name'],*/
                offset: req.body.offset || 0,
                limit: Math.min(req.body.limit || 100, 100)
            });
            return res.status(200).json({users});
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    getUserById: async (req, res) => {
        try {
            const {userId} = req.params;
            const user = await models.user.findOne({
                where: {id: userId},
                include: [
                    {
                        model: models.title
                    }
                ]
            });
            if (user) {
                return res.status(200).json({user});
            }
            return res.status(404).send("User with the specified ID does not exists");
        } catch (error) {
            return res.status(500).send(error.message);
        }

    },
    updateUser: async (req, res) => {
        try {
            /*const {userId} = req.params;
            const [updated] = await models.user.update(req.body, {
                where: {
                    id: userId,
                    passwordHash: req.body.oldPasswordHash
                }
            });

            if (updated) {
                const updated = await models.user.findOne({where: {id: userId}});

                return res.status(200).json({user: updated});
            }*/
            throw new Error("user not found");
        } catch (error) {
            return res.status(500).send(error.message);
        }

    },
    deleteUser: async (req, res) => {

    }
};
