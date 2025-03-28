class UIBuilder {
    static showMainMenu(player) {
        const form = new ActionFormData()
            .title("Menu Principal")
            .button("Loja")
            .button("Missões")
            .button("Sair");

        form.show(player).then(response => {
            if (response.selection === 0) UIBuilder.showShop(player);
        });
    }

    static showShop(player) {
        // Implemente a UI da loja
    }
}

// Uso:
// world.events.playerInteract.subscribe(({ player }) => {
//     UIBuilder.showMainMenu(player);
// });