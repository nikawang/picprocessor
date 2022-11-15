var Jimp = require("jimp");



module.exports = async function (context, req) {
    // const orgUrl = req.originalUrl;
    // const blobPath = orgUrl.split('ImageProcessor')[1].split('?')[0]
    // context.log(blobPath);
    context.log(context.bindingData.blobContainer);
    context.log(context.bindingData.blobPath);

    context.log(req.query);
    var blob = "https://"+ process.env["StorageAccountName"] + ".blob" + process.env["StorageAccountSuffix"] + "/" + context.bindingData.blobContainer + "/" + context.bindingData.blobPath;
    queryParams = req.query;
    if(typeof req.query.sig !== 'undefined' && req.query.sig)
    {
        blob = blob + "?sp=" + req.query.sp + "&st=" + req.query.st + "&se=" + req.query.se + "&spr=" + req.query.spr + "&sv=" + req.query.sv + "&sr="+ req.query.sr + "&sig=" + encodeURIComponent(req.query.sig);  
    }
    
    context.log(blob);
    const image = await Jimp.read(blob);
    // const image = await Jimp.read('https://ausstorageaccounta.blob.core.windows.net/privpic/pexels-photo-sample.jpeg?sp=r&st=2022-11-15T03:49:20Z&se=2022-11-15T11:49:20Z&spr=https&sv=2021-06-08&sr=c&sig=zrvpenz9UYJniPK817Jn185VrgzdvrSX7Vpazw3RHfg%3D');
    // await image.resize(150, 150);

    if(typeof req.query.p !== 'undefined' && req.query.p)
    {
        await image.scale(Number(req.query.p), Jimp.RESIZE_BEZIER);
    }
    else if(typeof req.query.w !== 'undefined' && req.query.w)
    {
        await image.resize(Number(req.query.w), Number(req.query.h));
    }
    
    // await image.scale(0.5, Jimp.RESIZE_BEZIER);
    // await image.writeAsync(`test/${Date.now()}_0.5.png`);

    var buffer; 
    image.getBuffer(Jimp.MIME_PNG, (err, result)=>{
       buffer = result;
    });

    context.res = {
        headers: {
            "Content-Type": "image/png"
        },
        isRaw: true,
        // status: 200, /* Defaults to 200 */
        body: new Uint8Array(buffer)
    };
}