import ws from "ws";
import http from "http";
import Chance from "chance";

module.exports = (server: http.Server) => {

	const chance = new Chance();
	const socket = new ws.Server({ server: server, path: "/multiplayer" });

  //TODO: Store all active players
	//
	console.log('Socket was open');

	socket.on("connection", (conn) => {
		const uuid = chance.guid();
		console.log(`New connection ${uuid}`);
		let name = '';

		send({
			commandName: "connected",
			user: uuid
		});

		broadcast({
			commandName: "newPlayer",
			user: uuid
		});


		//TODO: Setup keep alive 

		function broadcast(data: any) {
			socket.clients.forEach((client) => {
				if (client !== conn && client.readyState === ws.OPEN) {
					client.send(JSON.stringify(data));
				}
			});
		}

		function send(data: any) {
			conn.send(JSON.stringify(data));
		}

		conn.on("message", (data) => {
			console.log(`rcv: "${data}", from: ${uuid}`)
			const parsed = JSON.parse(data);

			switch (parsed.commandName) {
				case 'name':
					handleName(parsed);
					break;
				default:
					console.log('Unsupported cmd');
			}
			// ...
		});

		conn.on("close", () => {
			console.log(`User ${uuid} disconnected...`);
			broadcast({
				commandName: 'disconnect',
				user: uuid
			})
		});

		function handleName(cmd: Object ) {
		  //TODO: Validation
			name = cmd.name
			console.info(`User ${uuid} set his name to ${name}`)
			cmd.user = uuid
			broadcast(cmd)
		}

	});

};
