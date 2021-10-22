import http from "http";
import Chance from "chance";
import { OPEN, WebSocketServer } from "ws";
import Player from "./code/server/player";
import JoinCmd from "./code/src/dto/joinCmd";
import NameCmd from "./code/src/dto/nameCmd";

export default function multiplayer(server: http.Server): void
{

	const chance = new Chance();
	const socket = new WebSocketServer({ server: server, path: "/multiplayer" });

	const players: Map<string, Player> = new Map();

  //TODO: Store all active players
	//
	console.log('Socket was open');

	socket.on("connection", (conn) => {
		const uuid = chance.guid();
		console.log(`New connection ${uuid}`);
		let name = '';

		players.set(uuid, {})

		send({
			commandName: "connected",
			user: uuid
		});

		players.forEach((player: Player, uuid: string) => {
			send({

			})
		})

		broadcast({
			commandName: "newPlayer",
			user: uuid
		});


		//TODO: Setup keep alive 

		function broadcast(data: any) {
			socket.clients.forEach((client) => {
				if (client !== conn && client.readyState === OPEN) {
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
			parsed.user = uuid

			switch (parsed.commandName) {
				case 'name':
					handleName(parsed);
					break;
				case 'player.join':
					handleJoin(parsed);
					break;
				default:
					console.log('Unsupported cmd');
			}
		});

		conn.on("close", () => {
			console.log(`User ${uuid} disconnected...`);
			broadcast({
				commandName: 'disconnect',
				user: uuid
			})
		});

		function handleJoin(cmd: any) {
			const dto = JoinCmd.fromPayload(cmd);
			players.set(cmd.user, {
				posX: dto.posX,
				posY: dto.posY,
				speen: dto.speed,
				moveAngle: dto.angle
			})

			broadcast(cmd)
		}

		function handleName(payload: any) {
			const dto = NameCmd.fromPayload(payload)

			if (payload.user == uuid) {
				name = dto.name
			}

			players.get(payload.user).name = dto.name

			console.info(`User ${uuid} set his name to ${name}`)
			broadcast(payload)
		}

	});

};
