require('dotenv/config');
const axios = require('axios');

const url = 'https://discord.com/api/v9/guilds/662267976984297473/messages/search';
const headers = {
    'Authorization': process.env.AUTH_TOKEN
};

main();

async function main() {
    console.log(await getImages(0))
}

async function getImages(offset, content = 'red blood cells') {
    const PAGE_LENGTH = 25;
    return axios.get(url, { params: { offset, content }, headers })
        .then(response => {
            const urls = response.data.messages.map(m => m[0].attachments)
                .filter(a => a[0])
                .map(a => a[0].url)
                .filter(url => url.endsWith('.png'));

            console.log('Response:', response.data.total_results, urls);

            if (urls.length > 0) {
                return urls[0];
            }
            else {
                if (offset < response.data.total_results) {
                    return new Promise(resolve => setTimeout(
                            resolve(getImages(offset + PAGE_LENGTH))
                        , 1000));
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

