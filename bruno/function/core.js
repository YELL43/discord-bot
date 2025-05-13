module.exports.funcName = function(uuid) {
    return `function_bruno_${uuid}`;
}

module.exports.randChar = function() {
    let chars2replace = {'/': '-', '+': '_', '=': ''};
    let random_bytes = new Uint8Array(8).map(() => Math.floor(Math.random() * 256))
    let base64_hash = btoa(String.fromCharCode.apply(0, random_bytes));
    base64_hash = base64_hash.replace(/[/+=]/g, match => chars2replace[match]);
    return base64_hash;
}
   
    