import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

export default function () {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '667226347064-49tq9q0l1a7d35hkuvjoes3vd7fdbuo0.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access). Required to get the `idToken` on the user object!
    });

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();
                    console.log(JSON.stringify(userInfo, null, 2))
                } catch (error: any) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        // user cancelled the login flow
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        // operation (e.g. sign in) is in progress already
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        // play services not available or outdated
                    } else {
                        // some other error happened
                    }
                }
            }}
        />
    )
}