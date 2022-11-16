var Jimp = require("jimp");



module.exports = async function (context, req) {
    //Print Blob Container & Path
    context.log("blobContainer:\t" + context.bindingData.blobContainer);
    context.log("blobPath:\t" + context.bindingData.blobPath);
    //Print  QueryString from URL
    context.log(req.query);
    var blob = "https://"+ process.env["StorageAccountName"] + ".blob" + process.env["StorageAccountSuffix"] + "/" + context.bindingData.blobContainer + "/" + context.bindingData.blobPath;
    queryParams = req.query;
    if(typeof req.query.sig !== 'undefined' && req.query.sig)
    {
        blob = blob + "?sp=" + req.query.sp + "&st=" + req.query.st + "&se=" + req.query.se + "&spr=" + req.query.spr + "&sv=" + req.query.sv + "&sr="+ req.query.sr + "&sig=" + encodeURIComponent(req.query.sig);  
    }
    
    //Print the total Blob URL 
    context.log(blob);
    const imageType = context.bindingData.blobPath.split(".")[1];
    try{
        //read image from azure blob storage
        const image = await Jimp.read(blob);
        if(typeof req.query.p !== 'undefined' && req.query.p)
        {
            await image.scale(Number(req.query.p), Jimp.RESIZE_BEZIER);
        }
        else if(typeof req.query.w !== 'undefined' && req.query.w)
        {
            await image.resize(Number(req.query.w), Number(req.query.h));
        }
        
        var buffer; 
        image.getBuffer(Jimp.MIME_PNG, (err, result)=>{
        buffer = result;
        });

        context.res = {
            headers: {
                "Content-Type": "image/"+imageType
            },
            isRaw: true,
            // status: 200, /* Defaults to 200 */
            body: new Uint8Array(buffer)
        };
    }
    catch{
        console.log("Error while getting the image");
        context.res = {
            headers: {
                "Content-Type": "application/json"
            },
            status: 401,
            body: "Error while getting the image"
        };
    }

    
}