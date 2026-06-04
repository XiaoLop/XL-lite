const headers = new Headers({
    'content-type': 'application/json',
});

enum VideoPlatformType {
    MixDrop = 'MixDrop',
    BoodStream = 'BoodStream',
    BigShare = 'BigShare',
    KrakenFiles = 'krakenfiles',
    StreamTape = 'streamTape',
    Vidara = 'vidara',
    Vinovo = 'vinovo',
    Voe = 'voe',
    Unknown = 'Unknown',
}

interface VideoItem {
    id: string | number; // 根据实际数据结构调整类型
    [key: string]: any; // 允许其他属性
}

interface ApiResponse {
    code: number;
    data: {
        list: VideoItem[];
        [key: string]: any; // 允许其他数据字段
    };
}

async function main() {
    const query = new URLSearchParams({
        pageNum: '1',
        pageSize: '30',
        platform: VideoPlatformType.Voe,
    });

    const url =
        'https://video.xlbrowserpro.top/api/videoLink/public/list?' +
        query.toString();

    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    const result = (await response.json()) as ApiResponse;

    result.data.list.map((item) =>
        console.log(`https://video.xlbrowserpro.top/watch/${item.id}`),
    );
}

main().catch(console.error);
