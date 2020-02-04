const models = require("../models");
const fs = require('fs');

const resultDb = JSON.parse(fs.readFileSync('migrateOptions/resultDb.json'));


// Синхронизация с локальной базой
module.exports = {

    sync: async () => {
        //return ;
        const titles = [...resultDb.c, ...resultDb.m];

        for (const t of titles) {

            if (await models.title.findOne({where: {name: t.title}})) continue;

            const title = await models.title.create({
                name: t.title,
                description: "none",
                chaptersCount: t.chapters.length,
                lang: t.lang,
                db: t.db,
                category: t.category
            });
            console.log(t);
            for (let [i, c] of t.chapters.entries()) {
                const chapter = await models.chapter.create({
                    name: c.chapter,
                    pagesCount: c.pagesCount,
                    titleId: title.id,
                    db: i.toString(36)
                })

            }


        }


    }
};
