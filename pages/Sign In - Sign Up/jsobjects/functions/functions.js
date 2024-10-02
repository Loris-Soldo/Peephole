export default {
		SignIn: () => {
				return SignIn.run()
						.then(data => {
					
								// Conserver les données d'authentification
								storeValue('access_token', data['access_token']);
								storeValue('token_type', data['token_type']);
								storeValue('expires_in', data['expires_in']);
								storeValue('expires_at', data['expires_at']);
								storeValue('refresh_token', data['refresh_token']);

								// Conserver les métadonnées utilisateur avec les clés spécifiées
								const userMetadata = data.user.user_metadata;
								storeValue('user_id', userMetadata['sub']);
								storeValue('first_name', userMetadata['first_name']);
								storeValue('last_name', userMetadata['last_name']);
								storeValue('user_email', userMetadata['email']);
								storeValue('phone_number', userMetadata['phone_number']);

					
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

        // Extraire de l'URL et stocker les données d'authentification
        appsmith.URL.fullPath.split('#')[1].split('&').forEach(i => {
            const [key, value] = i.split('=');
            storeValue(key, value);
        });

        // Extraire les métadonnées utilisateur
        const data = GetUser.run();

				// Conserver les métadonnées utilisateur avec les clés spécifiées
				const userMetadata = data.user_metadata;
				storeValue('user_id', userMetadata['sub']);
				storeValue('first_name', userMetadata['first_name']);
				storeValue('last_name', userMetadata['last_name']);
				storeValue('user_email', userMetadata['email']);
				storeValue('phone_number', userMetadata['phone_number']);
			
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
    }
}

