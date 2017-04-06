#!/usr/bin/env node

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var program = require('commander');

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


program.version('1,0,0').usage('-h for help')
program.command('users').description('Get User List').action(function(){
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
    });
program.command('remove-user <name>').description('Remove User (case sensitive)').action(function(name){
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
});
program.command('add-user <username> <password>').description('Add new user (case sensitive)').action(function(name,password){
   
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
});
program.command('sessions').description('View Session List').action(function(){
    var connection = new Connection(config);
    connection.on('connect', function(err) {
	request = new Request("SELECT SessionID,Username,StartTime,EndTime FROM Sessions",function(err,rowcount){
	    if(err){
		console.log(err);
	    }
	    else {
		process.exit();
	    }
	});
	
	request.on('row', function(columns){
	    console.log("%d,%s,%s,%s",columns[0].value,columns[1].value,columns[2].value,columns[3].value);
	});
	
	connection.execSql(request);
    });
    connection.on('errorMessage', function(err) {
	console.log(`errorMessage: ` + JSON.stringify(err) + ' ' + (new Date).toISOString());
    });
    connection.on('error', function(err) {
	console.log('error: ' + JSON.stringify(err) + ' ' + (new Data).toISOString());
    });
});

program.parse(process.argv);




			      
	
    

