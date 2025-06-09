// 以下所有配置请不要删除键,可以将值改为空字符串
const 启用https = false;
let 运维配置_服务器IP = '192.168.30.92';
let 运维配置_接口地址 = `${启用https ? 'https' : 'http'}://${运维配置_服务器IP}:${启用https ? '445' : '80'}/api`;
let 运维配置_websocket地址 = `${启用https ? 'wss' : 'ws'}://${运维配置_服务器IP}:${启用https ? '445' : '80'}/resource/websocket`;

const 运维配置_Tenant_Id = '000000';
const 运维配置_Client_Id = 'e5cd7e4891bf95d1d19206ce24a7b32e';

const 运维配置_默认登录填充账号 = 'super_admin';
const 运维配置_默认登录填充密码 = 'admin123';

//自动获取IP,仅适用于前后端部署在同一服务器时,将自动获取覆盖上面配置
const 启用自动获取IP=false;

if(启用自动获取IP){
    const 协议 = window.location.protocol;
    const 主机名 = window.location.hostname;
    const 端口 = window.location.port ? `:${window.location.port}` : '';
    运维配置_服务器IP = 主机名;
    运维配置_接口地址 = `${协议}//${主机名}${端口}/prod-api`;
    运维配置_websocket地址 = `${协议 === 'https:' ? 'wss:' : 'ws:'}//${主机名}${端口}/prod-api/resource/websocket`;
}