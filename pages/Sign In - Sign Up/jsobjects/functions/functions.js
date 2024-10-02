export default {
		SignIn: () => {
				return SignIn.run()
						.then(data => {
								// Liste des clés à conserver dans data.user.user_metadata
								const metadataKeys = ['sub', 'email', 'first_name', 'last_name', 'phone_number']; // Ajoutez ici les clés nécessaires

								// Liste des clés à conserver dans data
								const dataKeys = ['user_metadata', 'access_token', 'token_type', 'expires_in', 'expires_at', 'refresh_token']; // Inclure 'user_metadata' pour traiter ses sous-clés

								// Fonction utilitaire pour filtrer les clés
								const filterKeys = (obj, keysToInclude) => {
										return Object.keys(obj)
												.filter(key => keysToInclude.includes(key))
												.reduce((result, key) => {
														result[key] = obj[key];
														return result;
												}, {});
								};

								// Conserver les métadonnées utilisateur avec les clés spécifiées
								const userMetadata = data.user.user_metadata;
								const filteredMetadata = filterKeys(userMetadata, metadataKeys);

								// Renommer et stocker les métadonnées filtrées
								if (filteredMetadata.sub) {
										storeValue('user_id', filteredMetadata.sub);
								}
								if (filteredMetadata.email) {
										storeValue('user_email', filteredMetadata.email);
								}
								if (filteredMetadata.name) {
										storeValue('user_name', filteredMetadata.name); // Stocker 'name' s'il est inclus
								}

								// Conserver les données de user avec la clé 'user_metadata'
								const filteredUserData = filterKeys(data.user, dataKeys);
								if (filteredUserData.user_metadata) {
										// Conserver et stocker les métadonnées de user
										const userMetadataSub = filteredUserData.user_metadata.sub;
										if (userMetadataSub) {
												storeValue('user_id', userMetadataSub); // Stocker 'user_id'
										}
								}

								// Nettoyer data en excluant user_metadata
								const cleanedData = { ...data }; // Créer une copie de data pour la manipulation
								delete cleanedData.user.user_metadata; // Exclure user_metadata
								Object.keys(cleanedData.user).forEach(key => {
										storeValue(`user_${key}`, cleanedData.user[key]);
								});

								// Gérer les requêtes et les redirections
								return Promise.all([
										CountAccountsUsersEmail.run(),
										CountAccountsUsersID.run()
								]).then(([emailResult, idResult]) => {
										const emailCount = emailResult[0].count;
										const idCount = idResult[0].count;

										if (emailCount > 0 && idCount > 0) {
												setTimeout(() => navigateTo('Home'), 1000);
										} else if (emailCount > 0 && idCount === 0) {
												return UpdateAccountsUsers.run().then(() => {
														setTimeout(() => navigateTo('Home'), 1000);
												});
										} else {
												setTimeout(() => navigateTo('Account Creation'), 1000);
										}
								});
						})
						.catch(error => {
								console.error('An error occurred:', error);
								// Gérer les erreurs comme nécessaire
						});
		},

    ValidateToken: async () => {
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

