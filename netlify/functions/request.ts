import fetch from 'node-fetch'
import { Handler, HandlerContext } from '@netlify/functions'

const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/

export const handler = async function (event, context) {
  const ip: string = event.headers['x-nf-client-connection-ip']
  const isIpValid =  IP_ADDRESS_REGEX.test(ip)

  let detail: any = {}

  if (isIpValid) {
    await fetch(`http://ip-api.com/json/${ip}?fields=status,message,reverse,continent,country,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting`)
      .then((data) => data.json())
      .then((data) => detail = data)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ip: ip,
      detail: {
        Continent: detail.continent,
        Country: detail.country,
        Region: detail.regionName,
        City: detail.city,
        District: detail.district,
        Zip: detail.zip,
        'Latitude, Longitude': `${detail.lat}, ${detail.lon}`,
        Timezone: detail.timezone,
        'Internet Service Provider (ISP)': detail.isp,
        Organization: detail.org,
        'Autonomous System (AS)': detail.as,
        Reverse: detail.reverse,
        'Mobile': detail.mobile ? 'True' : 'False',
        'Proxy': detail.proxy ? 'True' : 'False',
        'Hosting': detail.hosting ? 'True' : 'False',
        'User Agent': event.headers['user-agent'],
        'Language': event.headers['x-language'],
        'Host': event.headers['host']
      } || { error: 'Invalid ip address'},
    })
  }
}