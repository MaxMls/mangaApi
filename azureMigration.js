const {BlobServiceClient} = require('@azure/storage-blob');
const fs = require('fs');
const fse = require('fs-extra');
const Bottleneck = require("bottleneck");


async function main() {
    const db = "public/db";

    Array.prototype.numericSort = function () {
        return this.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    };

    const parsedImagesFormat = ".jpg";

    const lastIndex = fs.existsSync('migrateOptions/lastIndex.json') ? JSON.parse(fs.readFileSync('migrateOptions/lastIndex.json')) : {};
    const resultDb = fs.existsSync('migrateOptions/resultDb.json') ? JSON.parse(fs.readFileSync('migrateOptions/resultDb.json')) : {};
    const existTitles = fs.existsSync('migrateOptions/existTitles.json') ? JSON.parse(fs.readFileSync('migrateOptions/existTitles.json')) : [];

    Array.prototype.filterExists = function () {
        return this.filter((title) => !existTitles.includes(title));
    };

    const resultUploadList = [];

    fs.readdirSync(db).forEach(category => {
        const categoryPath = `${db}/${category}`;
        // console.log(category);
        if (resultDb[category] === undefined) resultDb[category] = [];

        if (lastIndex[category] === undefined) lastIndex[category] = 0;

        fs.readdirSync(categoryPath).filterExists().forEach((title) => {
            const titlePath = `${categoryPath}/${title}`;
            const titleDbName = lastIndex[category].toString(36);
            lastIndex[category] += 1;
            existTitles.push(title);
            // console.log(`\t ${titleNum.toString(36)}: ${title}`);

            const titleInfo = {
                title,
                lang: 'ru',
                category,
                db: titleDbName,
                chapters: []
            };

            fs.readdirSync(titlePath).numericSort().forEach((chapter, chapterNum) => {
                const chapterPath = `${titlePath}/${chapter}`;
                // console.log(`\t\t\t ${chapterNum.toString(36)}: ${chapter}`);

                const chapterDbName = chapterNum.toString(36);
                const chapterInfo = {chapter, pagesCount: 0};

                fs.readdirSync(chapterPath).numericSort().forEach((page, pageNum) => {
                    const pagePath = `${chapterPath}/${page}`;
                    const pageDbName = pageNum.toString(36);
                    const fileInfo = {
                        uploadPath: `${category}/${titleDbName}/${chapterDbName}/${pageDbName}${parsedImagesFormat}`,
                        localPath: pagePath,
                    };
                    // console.log(`\t\t\t\t ${pageNum.toString(36)}: ${page}`);
                    // console.log(pagePath);
                    chapterInfo.pagesCount++;
                    resultUploadList.push(fileInfo);
                });

                titleInfo.chapters.push(chapterInfo)
            });
            resultDb[category].push(titleInfo);
        });
    });

    console.log(resultUploadList);
    console.log(resultDb);
    console.log(lastIndex);

    // commit and save
    fse.outputFileSync('migrateOptions/resultDb.json', JSON.stringify(resultDb), 'utf8');
    fse.outputFileSync('migrateOptions/existTitles.json', JSON.stringify(existTitles), 'utf8');
    fse.outputFileSync('migrateOptions/lastIndex.json', JSON.stringify(lastIndex), 'utf8');

    // \Kage no Jitsuryokusha ni Naritakute 1 2 главы
   // return; // for debug

    console.log('Azure Blob storage v12 - JavaScript');
    const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=uwu;AccountKey=5isyqDG2wmPpFvG+EJ+1+2cgwtUIfVab7FumP1QPDe717zx6U+FwGOI4xDUWc/scfuUSIGrkT2dNdzVYUM0oDw==;EndpointSuffix=core.windows.net`;
    const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);


    const containerName = 'images';
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    if (!(await containerClient.exists())) {
        await containerClient.create();
        await containerClient.setAccessPolicy('Blob');
    }

    // Create a unique name for the blob
    function uploadFile(f) {
        let file = f;
        return new Promise(async function (resolve, reject) {
            try {
                const blobName = file.uploadPath;
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                const ex = await blockBlobClient.exists();
                // console.log(ex);
                if (ex) {
                    resolve();
                    return;
                }
                await blockBlobClient.uploadFile(file.localPath);
                await blockBlobClient.setHTTPHeaders({
                    blobContentType: "image/jpeg",
                    blobCacheControl: "public"
                });
                console.log('uploaded:', file.uploadPath)
            } catch (e) {
                console.log(e.message);
                reject(e.message);
                return;
            }
            resolve();
        })
    }

    const limiter = new Bottleneck({ maxConcurrent: 20 });

    const throttledUploadFile = limiter.wrap(uploadFile);

    const allThePromises = resultUploadList.map(file => throttledUploadFile(file))
    await Promise.all(allThePromises);

}

main().then(() => console.log('Done.')).catch((ex) => console.log(ex.message));
