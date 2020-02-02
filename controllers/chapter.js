const models = require("../database/models");


async function getLangId(langCode) {
	const lang = await models.lang.findOne({where: {code: langCode}});
	if (lang) return lang.id;
	throw new Error("lang not found");
}


module.exports = {
	postChapter: async (req, res) => {
		const {titleId, langCode} = req.params;
		try {
			const langId = (await models.lang.findOrCreate({where: {code: langCode}}))[0].id;
			req.body.langId = langId;
			req.body.titleId = titleId;
			const chapter = await models.chapter.create(req.body);
			await models.title.update(
				{chaptersCount: models.sequelize.literal('"chaptersCount" + 1')},
				{where: {id: titleId}}
			);
			await models.titlesLangs.findOrCreate({where: {titleId, langId}});
			return res.status(201).json({chapter});

		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},

	getChapters: async (req, res) => {
		const {titleId, langCode, offset, limit} = req.params;

		try {
			const langId = await getLangId(langCode)

			const chapters = await models.chapter.findAll({
				where: {titleId, langId}, offset: offset || 0, limit: Math.min(limit || 100, 100)
			});

			return res.status(201).json({
				chapters
			});
		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},
	getChapterOfTitleByNum: async (req, res) => {
		const {titleId, langCode, chapterNum} = req.params;
		try {
			const langId = await getLangId(langCode)

			const chapter = await models.chapter.findOne({where: {chapterNum, langId, titleId}});
			if (chapter) {
				return res.status(200).json({chapter});
			}
			return res.status(404).send("chapter with the specified num does not exists");
		} catch (error) {
			return res.status(500).send(error.message);
		}
	},
	updateChapter: async (req, res) => {
		const {titleId, langCode, chapterNum} = req.params;
		try {
			const langId = await getLangId(langCode);

			const linesChanged = await models.chapter.update(req.body, {where: {chapterNum, langId, titleId}});
			return res.status(200).json({linesChanged: linesChanged});

		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},
	deleteChapter: async (req, res) => {
		const {titleId, langCode, chapterNum} = req.params;
		try {
			const langId = await getLangId(langCode)

			const deleted = await models.chapter.destroy({
				where: {chapterNum, langId, titleId}
			});


			let title = await models.title.findByPk(titleId);

			if (title.chaptersCount <= 1) {
				await models.titlesLangs.destroy({where: {titleId, langId}});
			}

			await title.update({chaptersCount: models.sequelize.literal('"chaptersCount" - 1')});

			if (deleted) {
				return res.status(204).send("Chapter deleted");
			}
		} catch (error) {
			return res.status(500).send(error.message);
		}
	}
};
