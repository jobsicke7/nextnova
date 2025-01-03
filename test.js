const { google } = require('googleapis');
const readline = require('readline');
const oauth2Client = new google.auth.OAuth2(
    '1070674122128-4sin0vaui6664gkl8487jidle0e1a1po.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/api/auth/callback/google'
);

// 권한 scope 설정
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// 인증 URL 생성
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('인증 URL:', authUrl);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return;
        }
        oauth2Client.setCredentials(token);
        console.log('Access Token:', token);
        rl.close();
    });
});