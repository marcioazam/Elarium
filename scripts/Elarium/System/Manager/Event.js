class EventManager {
    static #subscriptions = new Map();

    static subscribe(eventName, callback) {
        const event = world.events[eventName].subscribe(callback);
        this.#subscriptions.set(callback, event);
        return event;
    }

    static unsubscribe(callback) {
        const event = this.#subscriptions.get(callback);
        if (event) {
            event.unsubscribe();
            this.#subscriptions.delete(callback);
        }
    }

    static clearAll() {
        this.#subscriptions.forEach(event => event.unsubscribe());
        this.#subscriptions.clear();
    }
}

// Uso:
// const onPlayerJoin = (event) => console.log(`${event.player.name} entrou!`);
// EventManager.subscribe("playerJoin", onPlayerJoin);