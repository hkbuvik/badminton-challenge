$$ = window.$$ || {};

$$.FirebaseController = (() => {

    const authUILoaderPanel = document.getElementById('firebaseui-auth-panel');
    const authUILoader = document.getElementById('firebaseui-auth-loader');

    const config = {
        apiKey: "AIzaSyDBst8ifSwfFN98GKYOt4Gz0NzgWYlOynw",
        authDomain: "badminton-challenge.firebaseapp.com",
        databaseURL: "https://badminton-challenge.firebaseio.com",
        projectId: "badminton-challenge",
        storageBucket: "badminton-challenge.appspot.com",
        messagingSenderId: "960935592116",
        appId: "1:960935592116:web:44dab7d766bbb2405957e1"
    };

    return {
        init: init,
    };

    function init(onUserSignedIn) {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("User " + user.email + " is signed in");
                onUserSignedIn(user);
                authUILoaderPanel.style.display = 'none';
            } else {
                console.log("No user is signed in");
                new firebaseui.auth.AuthUI(firebase.auth())
                    .start(
                        '#firebaseui-auth-container',
                        {
                            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
                            signInFlow: 'popup',
                            signInOptions: [{
                                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                                signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                            }],
                            callbacks: {
                                signInSuccessWithAuthResult: (authResult) => {
                                    if(!authResult.user.displayName || authResult.user.displayName.length === 0){
                                        $$.UserProfileController.show();
                                    }
                                    onUserSignedIn(authResult.user);
                                    // Return false to not redirect automatically.
                                    return false;
                                }
                            }
                        });
            }
            authUILoader.style.display = 'none';
        });
    }

})();
