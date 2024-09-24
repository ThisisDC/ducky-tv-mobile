import axios from 'axios';

const URL_CHANNELS = 'https://www.kool.to/channels';
export const DEFAULT_CHANNEL_IMAGE =
  'https://static.vecteezy.com/system/resources/previews/028/153/831/original/tv-icon-in-trendy-flat-style-isolated-on-white-background-tv-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg';

export async function initialFetch() {
  const response = await axios({method: 'get', url: URL_CHANNELS});
  const channels = [];
  const countries = ['Global'];

  response.data.forEach(channel => {
    channels.push({...channel, name: channel.name.slice(0, -2)});
    if (!countries.includes(channel.country)) {
      countries.push(channel.country);
    }
  });

  return {channels, countries};
}

export function getStreamUrl(channel_id) {
  return `https://www.kool.to/play/${channel_id}/index.m3u8`;
}
