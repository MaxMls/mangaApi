const models = require("../database/models");


module.exports = {
	addNewTag: async (req, res) => {
		try {
			const tag = await models.tag.create(req.body);
			return res.status(201).json({
				tag
			});
		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},


	getAllTags: async (req, res) => {
		try {
			const tags = await models.tag.findAll(req.params);
			return res.status(201).json({ tags });
		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},
	deleteTag: async (req, res) => {
		const {tagId} = req.params;
		try {
			const tag = await models.tag.findByPk(tagId);

			if (tag) {
				const deleted = await tag.destroy()
				return res.status(204).send("tag deleted");
			}
			throw new Error("tag not found");
		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	}
};
