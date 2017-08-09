{
    "name": "projects",
    "version": "0.0.1",
    "description": "",
    "main": "./bin/projects.js",
    "bin": {
        "projects": "./bin/projects.js"
    },
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "git+"
    },
    "keywords": [
        ""
    ],
    "author": "",
    "license": "ISC",
    "homepage": "#readme",
    "bugs": {
        "url": "/issues"
    },
    "dependencies": {
        "cli-builder-api": "^0.0.5"
    },
    "cliBuilder": {
        "commands": {
            "path": "commands/*.js"
        }
    }
}