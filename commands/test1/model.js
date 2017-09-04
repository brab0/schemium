function test1(options) {
    console.log("I came from the test1 command!", options);
    process.exit(0);
}

module.exports = {
    test1 : test1
}