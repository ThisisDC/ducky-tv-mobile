import axios from 'axios';

const URL_CHANNELS = 'https://www.kool.to/channels';

export async function fetchChannels() {
  const response = await axios({method: 'get', url: URL_CHANNELS});
  console.log(response.data);
  return response.data;
}

export function getStreamUrl(channel_id) {
  return `https://www.kool.to/play/${channel_id}/index.m3u8`;
}
