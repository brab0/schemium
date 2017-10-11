Schemium
==============
Build Command Line Interface applications on a simple way.

## Instalation
    $ npm install schemium -g

## Usage (`--help`)
    Usage: schemium <command> [<option>]

    command, c        add a new command

    init, i           Create a new CLI project
    --path, -p        path to create

    project, p        projects
    --use, -u
    --list, -ls
    --add, -a
    --remove, -rm

## Roadmap
```
    scm init --name "shooter-cli"
    scm command --add "add" --template "prompt"
    scm command --add "list" --template "list"
    scm command --add "fire"
    scm publish

    scm init --name "angularjs-cli"
    scm command --add "init"
    scm command --add "add" --template "prompt"
    scm publish

    scm init --name "uimmer-cli"
    scm module --add **
    scm module --add **/frontend
    scm add scm-angularjs@brab0:ng
    scm remove scm-angularjs
    my-cli new@ng --template "blank"
    my-cli ng:add --module "sample" --test --service --controller --view
    my-cli console ng
    my-cli@ng> add  --module "sample"
```

## License
```
MIT License

Copyright (c) 2017 Rodrigo Brabo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
