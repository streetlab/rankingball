/*!
 * 
 * WebSocket wrapper
 * 
 */

var RemoteDataManager = {
	
	init: function(address, connectionHandler, disconnectionHandler, messageHandler, logHandler) {
		this.address = address;
		this.socket = null;
		this.connected = false;
		this.connectionHandler = connectionHandler;
		this.disconnectionHandler = disconnectionHandler;
		this.messageHandler = messageHandler;
		this.logHandler = logHandler;
	},
	
	connect: function() {
		
		RemoteDataManager.log("connect : 1");
		
		if ("WebSocket" in window) {
			this.socket = new WebSocket(this.address);
		
//			RemoteDataManager.log("Socket Status : " + socket.readyState);
			RemoteDataManager.log("Socket Status : connecting...");
			
			this.socket.onopen = function() {
				RemoteDataManager.log("socket opened");
				RemoteDataManager.connected = true;
				if (RemoteDataManager.connectionHandler) {
					RemoteDataManager.connectionHandler();
				}
			};
			
			this.socket.onmessage = function(e) {
				RemoteDataManager.log("message received : " + e.data);
				if (RemoteDataManager.messageHandler) {
					RemoteDataManager.messageHandler(e.data);
				}
			};
			
			this.socket.onclose = function() {
				RemoteDataManager.log("socket closed!!!!!!!");
				RemoteDataManager.connected = false;
				if (RemoteDataManager.disconnectionHandler) {
					RemoteDataManager.disconnectionHandler();
				}
			};
		}
		else {
			this.log("WebSocket is not supported");
		}
	},

	disconnect: function() {
		if (this.connected
		&& this.socket
		&& this.socket.readyState == WebSocket.OPEN) {
			RemoteDataManager.log("closing socket");
			this.socket.close();
		}
	},

	send: function(m) {
		
		log("isConnected : " + this.connected + ", readyState :" + this.socket.readyState + ", msg : " + m);
		
		if (this.connected
		&& this.socket
		&& this.socket.readyState == WebSocket.OPEN) {
			this.log("sending message : " + m);
			this.socket.send(m);
		}
	},
	
	isConnected: function() {
		return this.connected;
	},
	
	log: function(s) {
		if (this.logHandler) {
			this.logHandler("test log : " + s);
		}
	}
};
