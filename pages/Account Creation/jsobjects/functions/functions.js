export default {
    UpdateUserWithAccount: async () => {
        try {
            // Exécutez la requête SQL pour créer l'account
            const result = await CreateAccount.run();
            
            // Stockage de la valeur account_id et account_name
            await storeValue('account_id', result.data[0].account_id);
            await storeValue('account_name', inp_companyName.text);
            
            // Assurez-vous que les valeurs sont stockées avant d'exécuter UpdateUser
            await UpdateUser.run();
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}