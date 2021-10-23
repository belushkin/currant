import http from "http";
import Chance from "chance";
import { OPEN, WebSocketServer } from "ws";
import JoinCmd from "./code/src/dto/joinCmd";
import NameCmd from "./code/src/dto/nameCmd";
import MoveCmd from "./code/src/dto/moveCmd";
import EnemySpawner from "./code/src/server/emenySpawner";
import FoodSpawner from "./code/src/server/foodSpawner";
import CoinSpawner from "./code/src/server/coinSpawner";
import HeartSpawner from "./code/src/server/heartSpawner";
import {WORLD_HEIGHT, WORLS_WIDTH} from "./code/src/constants";
import Enemy from "./code/src/server/enemy";
import Food from "./code/src/server/Food";
import Player from "./code/src/server/player";
import Coin from "./code/src/server/coin";
import Heart from "./code/src/server/heart";

export default function multiplayer(server: http.Server): void
{

	const chance = new Chance();
	const socket = new WebSocketServer({ server: server, path: "/multiplayer" });

	const players: Map<string, Player> = new Map();
	const enemies: Map<string, Enemy> = new Map();
	const food: Map<string, Food> = new Map();
	const coins: Map<string, Coin> = new Map();
	const hearts: Map<string, Heart> = new Map();
	
	const enemySpawner: EnemySpawner = new EnemySpawner(players, WORLS_WIDTH, WORLD_HEIGHT);
	const foodSpawner: FoodSpawner = new FoodSpawner(players, WORLS_WIDTH, WORLD_HEIGHT);
	const coinSpawner: CoinSpawner = new CoinSpawner(players, WORLS_WIDTH, WORLD_HEIGHT);
	const heartSpawner: HeartSpawner = new HeartSpawner(players, WORLS_WIDTH, WORLD_HEIGHT);

	enemySpawner.start((enemy: Enemy) => {
		if (enemies.size > 200) return;

		const uuid = chance.guid();
		enemies.set(uuid, enemy);
		const cmd = {
			commandName: 'enemy.spawn',
			posX: enemy.posX,
			posY: enemy.posY,
			targetUuid: enemy.target.uuid,
			uuid: uuid,
		}
		broadcastAll(cmd)
	})

	foodSpawner.start((item: Food) => {
		if (food.size > players.size * 40) return;

		const uuid = chance.guid();
		food.set(uuid, item);
		broadcastAll({
			commandName: 'food.spawn',
			posX: item.posX,
			posY: item.posY,
			uuid: uuid
		});

	})

	coinSpawner.start((item: Coin) => {
		if (coins.size > players.size * 20) return;

		const uuid = chance.guid();
		coins.set(uuid, item);
		broadcastAll({
			commandName: 'coin.spawn',
			posX: item.posX,
			posY: item.posY,
			uuid: uuid
		});
	})

	heartSpawner.start((item: Heart) => {
		if (hearts.size > players.size * 10) return;

		const uuid = chance.guid();
		hearts.set(uuid, item);
		broadcastAll({
			commandName: 'heart.spawn',
			posX: item.posX,
			posY: item.posY,
			uuid: uuid
		});
	})

	function broadcastAll(data: any) {
		const msg = JSON.stringify(data)
		console.log(`bca: ${msg}`)
		socket.clients.forEach((client) => {
			if (client.readyState === OPEN) {
				client.send(msg);
			}
		});
	}

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

		console.log('Total ' + players.size + ' players right now');

		players.forEach((player: Player, uuid: string) => {
			const joinCmd = new JoinCmd(player.posX, player.posY, player.moveAngle, player.speed);
			joinCmd.commandName = 'player.join';
			joinCmd.user = uuid;
			const nameCmd = new NameCmd(player.name);
			nameCmd.commandName = 'name';
			nameCmd.user = uuid;

			send(joinCmd);
			send(nameCmd);
			send({
				commandName: 'player.move',
				user: uuid,
				posX: player.posX,
				posY: player.posY,
				angle: player.moveAngle,
				speed: player.speed
			});
		})

		coins.forEach((item: Coin, uuid: string) => {
			send({
				commandName: 'coin.spawn',
				posX: item.posX,
				posY: item.posY,
				uuid: uuid
			})
		});

		food.forEach((item: Food, uuid: string) => {
			send({
				commandName: 'food.spawn',
				posX: item.posX,
				posY: item.posY,
				uuid: uuid
			})
		});

		hearts.forEach((item: Heart, uuid: string) => {
			send({
				commandName: 'heart.spawn',
				posX: item.posX,
				posY: item.posY,
				uuid: uuid
			})
		});

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
				case 'name':					handleName(parsed); break;
				case 'player.join':		handleJoin(parsed); break;
				case 'player.move':		handleMove(parsed); break;
				case 'coin.taken':		handleCoinTaken(parsed); break;
				case 'food.eaten':		handleFoodEaten(parsed); break;
				case 'heart.taken':		handleHeartTaken(parsed); break;
				case 'game.end':			handleGameEnd(parsed); break;
				case 'player.shot':   broadcast(parsed); break;
				default:
					console.log('Unsupported cmd');
			}
		});

		conn.on("close", () => {
			console.log(`User ${uuid} disconnected...`);
			players.delete(uuid);

			broadcast({
				commandName: 'disconnect',
				user: uuid
			})
		});

		function handleMove(cmd: any) {
			const dto = MoveCmd.fromPayload(cmd)
			const player = players.get(cmd.user);
			player.posX = dto.posX;
			player.posY = dto.posY;
			player.moveAngle = dto.angle;
			player.speed = dto.speed;

			players.set(cmd.user, player);
			broadcast(cmd);
		}

		function handleJoin(cmd: any) {
			const dto = JoinCmd.fromPayload(cmd);
			players.set(cmd.user, {
				name: '',
				uuid: cmd.user,
				posX: dto.posX,
				posY: dto.posY,
				speed: dto.speed,
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

		function handleCoinTaken(payload: any) {
			coins.delete(payload.uuid);
//			broadcast(payload);
		}

		function handleHeartTaken(payload: any) {
			hearts.delete(payload.uuid);
//			broadcast(payload);
		}

		function handleFoodEaten(payload: any) {
			food.delete(payload.uuid);
//			broadcast(payload);
		}

		function handleGameEnd(payload: any) {
			console.log(`Player ${name} got ${payload.score} points!`);
			players.delete(payload.user)
			enemies.forEach((enemy, enemyUUID) => {
				if (enemy.target.uuid == payload.user) {
					broadcast({
						commandName: 'enemy.killed',
						uuid: enemyUUID,
						user: uuid
					});
					enemies.delete(enemyUUID);
				}
			});
			broadcast(payload);
		}

	});

};

