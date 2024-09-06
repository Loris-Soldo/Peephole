export default {

		ValidateToken: async () => {
				if (!appsmith.URL.fullPath.includes('#access_token=')) return;

				// Extraire et stocker les paramètres d'URL
				appsmith.URL.fullPath.split('#')[1].split('&').forEach(i => {
						const [key, value] = i.split('=');
						storeValue(key, value);
				});

				try {
						// Exécuter la requête GetUser
						const data = await GetUser.run();

						// Liste des clés à exclure
						const excludeKeys = ['sub', 'email_verified', 'phone_verified'];

						// Traiter les métadonnées utilisateur
						const userMetadata = data.user_metadata;
						if (userMetadata) {
								// Renommer la clé 'sub' en 'user_id' et exclure d'autres clés
								if ('sub' in userMetadata) {
										storeValue('user_id', userMetadata['sub']);
								}
								// Stocker les autres clés sauf celles dans la liste d'exclusion
								Object.keys(userMetadata).forEach(key => {
										if (!excludeKeys.includes(key)) {
												storeValue(key, userMetadata[key]);
										}
								});
						}

						// Exécuter la requête GetAccountCount
						const account = await GetAccountCount.run();

						// Condition pour rediriger selon les résultats de GetAccount
						if (account.count > 0) {
								setTimeout(() => {
										navigateTo('Home'); // Rediriger vers la première page si la condition est vraie
								}, 1000); // Attendre 1 seconde avant la redirection
						} else {
								setTimeout(() => {
										navigateTo('Account Creation'); // Rediriger vers la deuxième page sinon
								}, 1000); // Attendre 1 seconde avant la redirection
						}
				} catch (error) {
						showAlert("Error: " + error.message, "error");
				}
		}
}
