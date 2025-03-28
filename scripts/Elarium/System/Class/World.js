
export class WorldWrapper {
    constructor() {
        throw new Error("World é uma classe estática e não pode ser instanciada.");
    }

    static BloodMoon = false;
}