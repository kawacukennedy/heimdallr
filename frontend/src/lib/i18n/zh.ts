// Simplified Chinese translations

import { Translation } from './en';

const zh: Translation = {
    app: {
        name: 'Heimdallr',
        tagline: '实时地理空间情报',
    },
    layers: {
        civilian: '民用航班',
        military: '军用航班',
        satellites: '卫星',
        cctv: '闭路电视',
        traffic: '道路交通',
    },
    shaders: {
        standard: '标准',
        nightVision: '夜视',
        thermal: '热成像 (FLIR)',
        crt: 'CRT 显示器',
        edgeDetection: '边缘检测',
    },
    panels: {
        controls: '控制',
        details: '详情',
        layers: '图层',
        shader: '着色器',
        bookmarks: '书签',
    },
    settings: {
        title: '设置',
        general: '常规',
        display: '显示',
        data: '数据',
        shortcuts: '快捷键',
        about: '关于',
        units: '单位',
        metric: '公制',
        imperial: '英制',
        updateInterval: '更新间隔',
        showFPS: '显示帧率',
        language: '语言',
    },
    search: {
        placeholder: '搜索地点、航班、卫星...',
        noResults: '未找到结果',
        searching: '搜索中...',
    },
    errors: {
        mapRenderFailed: '地图渲染错误',
        webglUnavailable: '此设备不支持 WebGL。',
        connectionLost: '连接已断开',
        reconnecting: '重新连接...',
    },
    time: {
        justNow: '刚才',
        minutesAgo: '{n}分钟前',
        hoursAgo: '{n}小时前',
        daysAgo: '{n}天前',
    },
};

export default zh;
