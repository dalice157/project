export interface txt {
    id: string;
    sender: number;
    message?: string;
    imageMessage?: string;
    msgMoreStatus: boolean;
    msgFunctionStatus: boolean;
    recallStatus: boolean;
    recallPopUp: boolean;
    time: string;
    msgType: number;
    [propName: string]: any;
}

// textPlugin ondata 處理數據
export interface IProcessData {
    date: string;
    from: string;
    msg: string;
    what: string;
    text: any;
    whisper: boolean;
    [propName: string]: any;
}

// janus transactions response
export interface ITransactions {
    [propName: string]: any;
    participants: [
        {
            username: string;
            display?: string;
        }
    ];
    textroom: string;
    transaction: string;
}

// janus attach Plugin 成功
export interface IAttachPlugin {
    plugin: string;
    detached: boolean;
    id: number;
    [propName: string]: any;
}

export interface IMessageList {
    Format: string;
    MsgContent: string;
    MsgType: number;
    [propName: string]: any;
}

export interface IData {
    [propName: string]: any;
}

export interface IDataview {
    byteLength: number;
    buffer: {
        byteLength: number;
    };
    getUint8: any;
}
