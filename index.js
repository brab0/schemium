#!/usr/bin/env node

require('./cli')
.init({
    process_title : "schemium",    
    commands : {
        path : "commands/*.js",
        default: "help",
    }
})
.exec();