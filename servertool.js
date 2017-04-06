var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var program = require('commander');

program.version('1,0,0')
    .usage('-h for help')
    .option('-u, --users', 'Get User List')
    .option('-r, --remove <username>', 'Remove User (case sensitive)')
    .option('-a, --add <username>:<password>', 'Add new user (case sensitive)', parseUser)
    .parse(process.argv);


var Connection = require('tedious').Connection;
// Very important that the password never appears in git
var config = {
  userName: "oxfordCSteam11Y16",
  password: process.env.BTP_PASSWORD,
  server: "bandtothepoledb.database.windows.net",
  options: {
    encrypt: true,
    database: "bandtothepoledb"
  }
};

if(process.env.BTP_PASSWORD == undefined){
    console.log("Must set BTP_PASSWORD");
    process.exit();
}

function parseUser(val) {
    return val.split(':');
}

if(program.users) {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
	request = new Request("SELECT USERNAME FROM Users",function(err,rowcount){
	    if(err){
		console.log(err);
	    }
	    else {
		console.log("%d users found", rowcount);
		process.exit();
	    }
	});
	
	request.on('row', function(columns){
	    console.log(columns[0].value);
	});
	
	connection.execSql(request);
    });
    connection.on('errorMessage', function(err) {
	console.log(`errorMessage: ` + JSON.stringify(err) + ' ' + (new Date).toISOString());
    });
    connection.on('error', function(err) {
	console.log('error: ' + JSON.stringify(err) + ' ' + (new Data).toISOString());
    });  
};
    

if (program.remove) {
    name = program.remove;
    if(name == undefined || name == ""){
	console.log("Could not read name");
    }
    else {
	var connection = new Connection(config);
	connection.on('connect', function(err) {
	    request = new Request("SELECT USERNAME FROM Users WHERE USERNAME = @username",function(err,rowcount) {
		if(err){
		    console.log(err);
		}
		else if(rowcount != 1){
		    console.log("User %s not found", name);
		    process.exit();
		}
		else {
		    requestDelete = new Request("DELETE FROM Users WHERE USERNAME = @username",function(err,rowcount){
			if(err){
			    console.log(err)
			}
			else console.log("User %s deleted", name);
			process.exit();
		    });
		    
		    requestDelete.addParameter('username', TYPES.VarChar, name);

		    connection.execSql(requestDelete);
		}
	    });

	    request.addParameter('username', TYPES.VarChar, name);

	    connection.execSql(request);
	});
	connection.on('errorMessage', function(err) {
	    console.log(`errorMessage: ` + JSON.stringify(err) + ' ' + (new Date).toISOString());
	});
	connection.on('error', function(err) {
	    console.log('error: ' + JSON.stringify(err) + ' ' + (new Data).toISOString());
	}); 
	
    }
};

if(program.add) {
    console.log(program.add);
    name = program.add[0];
    password = program.add[1];
    if(name == undefined || name == ""){
	console.log("Could not read name");
    }
    else if(password == undefined || password == ""){
	console.log("Could not read password");
    }
    else {
	var connection = new Connection(config);
	connection.on('connect', function(err) {
	    request = new Request("SELECT USERNAME FROM Users WHERE USERNAME = @username",function(err,rowcount) {
		if(err){
		    console.log(err);
		}
		else if(rowcount >= 1){
		    console.log("User %s already exists", name);
		    process.exit();
		}
		else {
		    requestAdd = new Request("INSERT INTO Users VALUES (@username,@password)",function(err,rowcount){
			if(err){
			    console.log(err)
			}
			else console.log("User %s added", name);
			process.exit();
		    });
		    
		    requestAdd.addParameter('username', TYPES.VarChar, name);
		    requestAdd.addParameter('password', TYPES.VarChar, password);
		    
		    connection.execSql(requestAdd);
		}
	    });

	    request.addParameter('username', TYPES.VarChar, name);

	    connection.execSql(request);
	});
	connection.on('errorMessage', function(err) {
	    console.log(`errorMessage: ` + JSON.stringify(err) + ' ' + (new Date).toISOString());
	});
	connection.on('error', function(err) {
	    console.log('error: ' + JSON.stringify(err) + ' ' + (new Data).toISOString());
	});
	
    }
};

			      
	
    

