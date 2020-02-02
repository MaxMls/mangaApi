const {BlobServiceClient, HttpHeaders} = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
const fs = require('fs');

async function main() {


    const db = "public/db";

    Array.prototype.numericSort = function () {
        return this.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    };


    const resultDb = {}

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

            const titleInfo = {title, chapters: [], lang: 'ru'};

            fs.readdirSync(titlePath).numericSort().forEach((chapter, chapterNum) => {
                const chapterPath = `${titlePath}/${chapter}`;
                //console.log(`\t\t\t ${chapterNum.toString(36)}: ${chapter}`);

                const chapterInfo = {chapter, pagesCount: 0};

                fs.readdirSync(chapterPath).numericSort().forEach((page, pageNum) => {
                    const pagePath = `${chapterPath}/${page}`;
                    const fileInfo={
                        uploadPath: `${category}/${titleNum.toString(36)}/${chapterNum.toString(36)}/${pageNum.toString(36)}`,
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
    return;
    console.log(resultDb);


    console.log('Azure Blob storage v12 - JavaScript');
    /*    const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;`;*/
    const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=uwu;AccountKey=5isyqDG2wmPpFvG+EJ+1+2cgwtUIfVab7FumP1QPDe717zx6U+FwGOI4xDUWc/scfuUSIGrkT2dNdzVYUM0oDw==;EndpointSuffix=core.windows.net`;

    const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    ///////
    // Create a unique name for the container
    const containerName = 'images';
    console.log('\nCreating container...');
    console.log('\t', containerName);

    // Get a reference to a container
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    // Create the container
    //containerClient.getContainerClient()
    try {
        const createContainerResponse = await containerClient.create();
        console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
    } catch (e) {
    }

    const setAccessControlResponse = await containerClient.setAccessPolicy('Blob');

    console.log(setAccessControlResponse);

    /////////


    // Create a unique name for the blob
    const blobName = 'woma.jpg';

    // Get a block blob client

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('\nUploading to Azure storage as blob:\n\t', blobName);


    // Upload data to the blob
    const data = 'Hello, World!';
    //const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

    //const uploadBlobResponse = await blockBlobClient.uploadFile("D:\\Users\\Max1\\Pictures\\палитра\\__cure_gelato_and_tategami_aoi_kirakira_precure_a_la_mode_and_precure_drawn_by_kuroboshi_kouhaku__e34f7ca857237671110bc0f3ccc9cabd.jpg",{});
    //console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);


    await blockBlobClient.setHTTPHeaders({blobContentType: "image/jpeg", blobCacheControl: "public"});


}

main().then(() => console.log('Done.')).catch((ex) => console.log(ex.message));
