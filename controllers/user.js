const models = require("../database/models");

// return bool
function checkRules(type, str) {
    const r = {
        name: [
            v => !!v,
            v => /^[a-zA-Z0-9]+$/.test(v),
            v => v.length <= 20,
            v => v.length > 2
        ],
        password: [
            v => !!v,
            v => v.length <= 100,
        ]
    };

    for (const f of r[type])
        if (!f(str)) return false;
    return true;
}

module.exports = {
    createUser: async (req, res) => {
        const {name, password} = req.body;

        try {
            if (!name || !password) return res.status(500).json('require name and password');
            if (!checkRules('name', name)) return res.status(500).send("name not correct");
            if (await models.user.findOne({where: {name}})) return res.status(500).send("user already exists");
            if (!checkRules('password', name)) return res.status(500).send("password not correct");

            const user = await models.user.create( {name, password, role: 0} );

            return res.status(201).json({ user });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await models.user.findAll({
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
        const {name, password} = req.body;
        const {userId} = req.params;
        const {id} = req.userModel;
        const uptData = {};

        try {
            if(parseInt(userId) !== id) return res.status(400).send("name not correct");
            if (name !== null) {
                if (!checkRules('name', name)) return res.status(400).send("name not correct");
                if (await models.user.findOne({where: {name}})) return res.status(400).send("user already exists");
                uptData.name = name;
            }
            if (password !== null) {
                if (!checkRules('password', password)) return res.status(400).send("password not correct");
                uptData.password = password;
            }
            await models.user.update(uptData, {where: {id}});
            return res.status(200).send('ok')
        } catch (e) {
            console.error(e.message)
            return res.status(500).send(e.message);
        }

    },
    uploadAvatar: async (req, res) => {
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

        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    deleteUser: async (req, res) => {

    }
};
