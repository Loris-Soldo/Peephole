export default {
    ValidateToken: () => {
        if (!appsmith.URL.fullPath.includes('#access_token=')) return;

        // Extraire et stocker les paramètres d'URL
        appsmith.URL.fullPath.split('#')[1].split('&').forEach(i => {
            const [key, value] = i.split('=');
            storeValue(key, value); // Stocke la valeur sans attendre la promesse
        });

        // Exécuter la requête GetUser
        const data = GetUser.run();

        // Liste des clés à exclure
        const excludeKeys = ['sub', 'email', 'email_verified', 'phone_verified'];

        // Traiter les métadonnées utilisateur
        const userMetadata = data.user_metadata;
        if (userMetadata) {
            // Renommer la clé 'sub' en 'user_id' et exclure d'autres clés
            if ('sub' in userMetadata) {
                storeValue('user_id', userMetadata['sub']);
            }
            if ('email' in userMetadata) {
                storeValue('user_email', userMetadata['email']);
            }

            // Stocker les autres clés sauf celles dans la liste d'exclusion
            Object.keys(userMetadata).forEach(key => {
                if (!excludeKeys.includes(key)) {
                    storeValue(key, userMetadata[key]);
                }
            });
        }

        // Exécuter les requêtes pour vérifier les données dans accounts_users
        const count_email = CountAccountsUsersEmail.run();
        const count_id = CountAccountsUsersID.run();

        // Condition pour rediriger selon les résultats des requêtes
        if (count_email[0].count > 0 && count_id[0].count > 0) {
            setTimeout(() => {
                navigateTo('Home'); // Rediriger vers la première page si la condition est vraie
            }, 1000); // Attendre 1 seconde avant la redirection
        } else if (count_email[0].count > 0 && count_id[0].count == 0) {
            UpdateAccountsUsers.run();
            setTimeout(() => {
                navigateTo('Home'); // Rediriger vers la première page après l'exécution de la requête
            }, 1000); // Attendre 1 seconde avant la redirection
        } else {
            setTimeout(() => {
                navigateTo('Account Creation'); // Rediriger vers la deuxième page sinon
            }, 1000); // Attendre 1 seconde avant la redirection
        }
    }
}

