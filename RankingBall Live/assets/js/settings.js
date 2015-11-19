/**
 * Application Settings
 */

var appSettings = {
        everlive: {
            apiKey: 'rMFp1tqhIxWOMyKT', // Put your Backend Services API key here
            scheme: 'http',
            url: ''
        },
    
        eqatec: {
            productKey: '753e387999b64d92969e9cad8b8dead5',  // Put your EQATEC product key here
            version: '1.0.0.0' // Put your application version here
        },
        
        feedback: {
            apiKey: 'fffb0380-5a67-11e5-9d38-c95ae192f56f',  // Put your AppFeedback API key here
            options: {
                enableShake: true,
                apiUrl: 'https://platform.telerik.com/feedback/api/v1'
            }
        },

        facebook: {
            appId: '1408629486049918', // Put your Facebook App ID here
            redirectUri: 'https://www.facebook.com/connect/login_success.html' // Put your Facebook Redirect URI here
        },

        google: {
            clientId: '406987471724-q1sorfhhcbulk6r5r317l482u9f62ti8.apps.googleusercontent.com', // Put your Google Client ID here
            redirectUri: 'http://localhost' // Put your Google Redirect URI here
        },

        liveId: {
            clientId: '000000004C10D1AF', // Put your LiveID Client ID here
            redirectUri: 'https://login.live.com/oauth20_desktop.srf' // Put your LiveID Redirect URI here
        },

        adfs: {
            adfsRealm: '$ADFS_REALM$', // Put your ADFS Realm here
            adfsEndpoint: '$ADFS_ENDPOINT$' // Put your ADFS Endpoint here
        },

        messages: {
            mistSimulatorAlert: 'The social login doesn\'t work in the In-Browser Client, you need to deploy the app to a device, or run it in the simulator of the Windows Client or Visual Studio.',
            removeActivityConfirm: 'This activity will be deleted. This action can not be undone.'
        },
        androidPIN: {
            androidProjectNumber: '50458939687'
        }, // Put you Android project number here
        constants: {
            NO_API_KEY_MESSAGE: '<h3>Backend Services <strong>API Key</strong> is not set.</h3><p><span>API Key</span> links the sample mobile app to a project in Telerik Backend Services.</p><p>To set the <span>API Key</span> open the <span>/scripts/config.js</span> file and replace <strong>$EVERLIVE_API_KEY$</strong> with the <span>API Key</span> of your Backend Services project.</p>',
            EMULATOR_MODE: false
        }
};