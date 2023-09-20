const axios = require('axios');
const PAGE_SIZE = 25;
const MAX_FILE_SIZE = 5000000; // TODO increase to 8MB after upgrading plan in Make

async function getImages(token, channel, content, visitedPages = new Set()) {
    const headers = { authorization: token };
    const url = `https://discord.com/api/v9/guilds/${channel}/messages/search`;

    const response = await axios.get(url, { params: { content, offset: 0 }, headers });
    console.log('total res: ', response.data.total_results);
    const pages = Math.floor(response.data.total_results / PAGE_SIZE);

    let randomOffset;
    do {
        randomOffset = Math.floor(Math.random() * pages);
    } while(visitedPages.has(randomOffset))

    visitedPages.add(randomOffset);

    return axios.get(url, { params: { content, offset: randomOffset * PAGE_SIZE }, headers })
        .then(response => {
            const urls = response.data.messages.map(m => m[0].attachments)
                .map(a => a[0])
                .filter(a => a && a.content_type == 'image/png' && a.size < MAX_FILE_SIZE);

            console.log('Response:', urls);

            if (urls.length > 0) {
                return getRandomElementsFromArray(urls, 10);
            }
            else {
                if (visitedPages.size < pages) {
                    return new Promise(resolve => 
                        setTimeout(
                            resolve(getImages(token, channel, content, visitedPages))
                        , 1000)
                    );
                }
                else {
                    return;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getRandomElementsFromArray(arr, numElements) {
    if (numElements >= arr.length) {
        return arr;
    }

    let result = [];
    let indices = new Set();

    while (indices.size < numElements) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        if (!indices.has(randomIndex)) {
            indices.add(randomIndex);
        }
    }

    indices.forEach(index => {
        result.push(arr[index]);
    });

    return result;
}


exports.getImages = getImages;
