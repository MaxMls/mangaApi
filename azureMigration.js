const {BlobServiceClient, HttpHeaders} = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
const fs = require('fs');

async function main() {


    const db = "public/db";

    Array.prototype.numericSort = function () {
        return this.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    };


    const resultDb = {}
    const parsedImagesFormat = ".jpg"

    // for (let i=0; i<1000; i++) console.log( i.toString(36));

//return;
    const resultUploadList = [];

    fs.readdirSync(db).forEach(category => {
        const categoryPath = `${db}/${category}`;
        console.log(category);
        resultDb[category] = [];

        fs.readdirSync(categoryPath).forEach((title, titleNum) => {
            const titlePath = `${categoryPath}/${title}`;
            //console.log(`\t ${titleNum.toString(36)}: ${title}`);
            const titleDbName = titleNum.toString(36);

            const titleInfo = {
                title,
                lang: 'ru',
                db: `${category}/${titleDbName}`,
                category,
                chapters: []
            };

            fs.readdirSync(titlePath).numericSort().forEach((chapter, chapterNum) => {
                const chapterPath = `${titlePath}/${chapter}`;
                //console.log(`\t\t\t ${chapterNum.toString(36)}: ${chapter}`);

                const chapterDbName = chapterNum.toString(36);
                const chapterInfo = {chapter, pagesCount: 0};

                fs.readdirSync(chapterPath).numericSort().forEach((page, pageNum) => {
                    const pagePath = `${chapterPath}/${page}`;
                    const pageDbName = pageNum.toString(36);
                    const fileInfo = {
                        uploadPath: `${category}/${titleDbName}/${chapterDbName}/${pageDbName}${parsedImagesFormat}`,
                        localPath: pagePath,
                    };
                    //console.log(`\t\t\t\t ${pageNum.toString(36)}: ${page}`);
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
    //console.log(resultDb);
    //return;


    console.log('Azure Blob storage v12 - JavaScript');
    /*    const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;`;*/
    const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=uwu;AccountKey=5isyqDG2wmPpFvG+EJ+1+2cgwtUIfVab7FumP1QPDe717zx6U+FwGOI4xDUWc/scfuUSIGrkT2dNdzVYUM0oDw==;EndpointSuffix=core.windows.net`;
    const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);


    const containerName = 'images';
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    /*try {
        const createContainerResponse = await containerClient.create();
    } catch (e) {}
*/
    //const setAccessControlResponse = await containerClient.setAccessPolicy('Blob');
    //console.log(setAccessControlResponse);
    /////////

    // Create a unique name for the blob
    function uploadFile(f) {
        let file = f;
        return new Promise(async function (resolve, reject) {
            try {
                const blobName = file.uploadPath;
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                const ex = await blockBlobClient.exists();
                console.log(ex);
                if (ex) {
                    resolve();
                    return;
                }
                await blockBlobClient.uploadFile(file.localPath);
                await blockBlobClient.setHTTPHeaders({blobContentType: "image/jpeg", blobCacheControl: "public"});
                console.log('uploaded:', file.uploadPath)
            } catch (e) {
                console.log(e.message)
                reject(e.message)
                return;
            }
            resolve();
        })
    }

    for (const file of resultUploadList) {
        await uploadFile(file);
    }

}

main().then(() => console.log('Done.')).catch((ex) => console.log(ex.message));
