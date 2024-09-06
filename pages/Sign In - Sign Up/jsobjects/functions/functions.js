export default {
	
    SignIn: () => {
				return SignIn.run()
				.then(data => {
					// Liste des clés à exclure
					const excludeKeys = ['sub', 'email_verified', 'phone_verified'];
					// Traiter les métadonnées utilisateur
					const userMetadata = data.user.user_metadata;
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
					delete data.user;
					Object.keys(data).forEach(i => {
						storeValue(i, data[i]);
					});
				})
				.then(() => navigateTo('Home'));
    }
}
