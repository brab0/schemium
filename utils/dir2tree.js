'use strict';

const path = require('path');
const archy = require('archy');
const glob = require('glob');

function add_node_to_tree(tree, parent_dir, node_to_add) {
    if (parent_dir === tree.label) {
        tree.nodes.push({
            label: node_to_add,
            nodes: []
        });
    } else {
        tree.nodes.forEach((t_node) => {
            if (typeof t_node === 'object' && t_node.label === parent_dir) {
                t_node.nodes.push({
                    label: node_to_add,
                    nodes: []
                });
            } else if (typeof t_node === 'object' && t_node.label !== parent_dir) {
                add_node_to_tree(t_node, parent_dir, node_to_add);
            }
        });
    }
}

function dir_tree_creator(opts) {
    return new Promise((resolve, reject) => {    
        const def_ignore = ['node_modules/**', '.git/**'];
        
        opts.label = opts.label ? opts.label : path.basename(opts.root);
        opts.ignore = (opts.ignore && Array.isArray(opts.ignore)) ? opts.ignore.concat(def_ignore) : def_ignore;  

        var tree = {
            label: opts.label,
            nodes: []
        };

        get(opts.root, opts.ignore).forEach(files => {     
            var parent_dir = path.parse(files).dir;
            
            if (parent_dir === opts.root) {
                add_node_to_tree(tree, opts.label, path.basename(files));
            } else {
                add_node_to_tree(tree, path.basename(parent_dir), path.basename(files));
            }        
        });
                
        resolve(archy(tree).trim());
    });
}

function get(pattern, excludes){      
    var files = glob.sync(pattern + '/**');

    if (excludes) {
        return files.filter(function(file){
            return !excludes.some(function(exclude){                    
                return new RegExp(exclude.replace('**','(.*)')).test(file)
            })
        })
    } else {
        return files;
    }
}

module.exports = dir_tree_creator;
