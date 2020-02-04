const models = require("../database/models");


module.exports = {
    getUserHistory: async (req, res) => {

        return res.status(500).send('такого нет');
    },

    changeHistory: async (req, res) => {
        const {chaptersIds = [], isRead = false} = req.body;
        try {
            const result = await req.userModel[(isRead ? 'add' : 'remove') + 'Chapters'](chaptersIds, []);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);
            res.status(500).send(e.message);
        }

    }


};
