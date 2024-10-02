export default {
    InviteWorkflow: async () => {
        try {
            // Récupérer le résultat de la requête VerifyUser
            const verifyUserResult = await VerifyUser.run();
            
            // Vérifier si count > 0
            if (verifyUserResult[0].count > 0) {
                // Afficher une alerte d'erreur
                showAlert('User already exists', 'error');
            } else {
                // Exécuter la requête SQL InviteUser
                await InviteUser.run();
                
                // Réaliser la query SMTP SendInvite
                await SendInvite_notworking.run();

                // Afficher une alerte de succès avec l'adresse e-mail
                showAlert(`An invite was sent to this email`, 'success');
            }
        } catch (error) {
            // Gérer les erreurs éventuelles
            showAlert('An error occurred: ' + error.message, 'error');
        }
    }
}
