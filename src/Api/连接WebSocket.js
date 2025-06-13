import Store from '@/store/main.js';
import { Tenant_Id, Client_Id } from '@/系统常量.js';
import { 消息, 提示框 } from '@/常用方法.js';

let 重连次数 = 1;
let ws;

export function 连接WebSocket() {
	ws = new WebSocket(`${运维配置_websocket地址}?clientid=${Client_Id}&Authorization=Bearer ${Store.state.token}`);
	ws.onopen = (e) => {
		重连次数 = 1;
		// 消息(`webscoket已连接`, 2);
		ws.send(JSON.stringify({ type: 'ping', time: Date.now() }));
	};

	ws.onerror = (e) => {
		消息('webscoket连接错误,原因如下:', -1);
		消息(e, -1);
	};

	ws.onclose = (e) => {
		消息(`webscoket连接断开,错误码: ${e.code},正在尝试第${重连次数}次重连`, 4);
		ws = null;
		if (重连次数 <= 3) {
			setTimeout(() => {
				连接WebSocket();
			}, 3000);
		} else {
			消息(`webscoket重连失败`, 4);
			return;
		}
		重连次数++;
	};

	ws.onmessage = (e) => {
		try {
			const 消息 = JSON.parse(e.data);
			console.log('websocket消息', 消息);
			Store.commit('setState', {
				key: 'websocket消息',
				value: 消息,
			});
		} catch (e) {
			提示框(`服务器发送了未定义无法解析的消息: ${e.data}`, 1, 'alert', '无法解析的消息');
		}
	};
}
