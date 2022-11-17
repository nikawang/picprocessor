module.exports = async function (context, inputEventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${inputEventHubMessages}`);
    
    inputEventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${message}`);
        context.bindings.outputEventHubMessage = message;
    });
};