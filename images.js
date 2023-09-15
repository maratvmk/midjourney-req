const axios = require('axios');

async function getImages(token, channel, content, offset = 0) {
    const PAGE_LENGTH = 25;
    const headers = { authorization: token };
    const url = `https://discord.com/api/v9/guilds/${channel}/messages/search`

    return axios.get(url, { params: { content, offset }, headers })
        .then(response => {
            const urls = response.data.messages.map(m => m[0].attachments)
                .filter(a => a[0])
                .map(a => a[0].url)
                .filter(url => url.endsWith('.png'));

            console.log('Response:', response.data.total_results, urls[0]);

            if (urls.length > 0) {
                return urls[0];
            }
            else {
                if (offset < response.data.total_results) {
                    return new Promise(resolve => 
                        setTimeout(
                            resolve(getImages(token, channel, content, offset + PAGE_LENGTH))
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

exports.getImages = getImages;
