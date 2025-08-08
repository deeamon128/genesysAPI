export async function getGenesysAccessToken() {
    const clientId = process.env.GENESYS_CLIENT_ID!;
    const clientSecret = process.env.GENESYS_CLIENT_SECRET!;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('Fetching token with:', {
        url: 'https://login.eu.purecloud.com/oauth/token',
        basicAuth,
    });

    const response = await fetch('https://login.eu.purecloud.com/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Failed to get access token:', error);
        throw new Error('Token fetch failed');
    }

    const data = await response.json();
    return data.access_token;
}
