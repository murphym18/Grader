# MongoDB
### Setup a MongoDB server on your computer.
* Edit *mongodb.conf* so that `path` and `dbPath` point somewhere meaningful.
   * *Optional*:
         cp ./mongodb.conf /etc
* Download and run the **[MongoDB Installer](http://www.mongodb.org/downloads)**
* Setup your shell for MongoDB
   * Append your `PATH` environment variable with <MONGODB_INSTALL_DIR>/bin
   * *Optional*: Make an alias for `mongod` so you don't command line arguments.
   
    To do this, I edited `~/.bash_profile`. It now includes something like:
         export PATH="$PATH:<MONGODB_INSTALL_DIR>/bin"
         alias mongod='mongod --config <PATH_TO_CONFIG_FILE>/mongodb.conf &' 

### Starting and Stopping MongoDB
* To start MongoDB launch a terminal and type:
      mongod
* To stop MongoDB
   * Launch a terminal
   * Start the MangoDB command line tool by invoking:
         mongo
   * Then enter these commands:
         use admin
         db.shutdownServer()
         exit
* For more about starting and stopping see: [http://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/](http://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/)

### More Help
* The MangoDB website has a [Getting Started Guide](http://docs.mongodb.org/manual/core/introduction/)
