Vole
====

Vole is a web application for sharing words, pictures and videos securely and privately with others. Data is distributed to users peer-to-peer using Bittorrent Sync.

Running
-------

    cd src
    go run vole.go

    In your browser, navigate to http://localhost:6789

Technology
----------

* [Bittorrent Sync](http://labs.bittorrent.com/experiments/sync.html)
* [Go](http://golang.org/)
* [Ember.js](http://emberjs.com/)


Building Ember.js into Vole
---------------------------

Regular expression replace:

    ```
    <nothing>

    `
    ` + "`" + `
