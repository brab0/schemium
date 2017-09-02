function test(options) {
    console.log("I came from the test command!", options);
    process.exit(0);
}

module.exports = {
    test : test
}