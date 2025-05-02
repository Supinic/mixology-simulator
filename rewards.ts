import { ResinObject } from "./definitions.js";

type Reward = {
    name: string;
    short: string;
    price: ResinObject;
};

export const rewards = [
    {
        name: "Apprentice potion pack",
        short: "pack1",
        price: { M: 420, A: 70, L: 30 }
    },
    {
        name: "Adept potion pack",
        short: "pack2",
        price: { M: 180, A: 440, L: 70 }
    },
    {
        name: "Expert potion pack",
        short: "pack3",
        price: { M: 410, A: 320, L: 480 }
    },
    {
        name: "Prescription goggles",
        short: "goggles",
        price: { M: 8600, A: 7000, L: 9350 }
    },
    {
        name: "Alchemist labcoat",
        short: "outfit-top",
        price: { M: 2250, A: 2800, L: 3700 }
    },
    {
        name: "Alchemist pants",
        short: "outfit-bottom",
        price: { M: 2250, A: 2800, L: 3700 }
    },
    {
        name: "Alchemist gloves",
        short: "outfit-gloves",
        price: { M: 2250, A: 2800, L: 3700 }
    },
    {
        name: "Reagent pouch",
        short: "pouch",
        price: { M: 13800, A: 11200, L: 15100 }
    },
    {
        name: "Potion storage",
        short: "storage",
        price: { M: 7750, A: 6300, L: 8950 }
    },
    {
        name: "Chugging barrel",
        short: "barrel",
        price: { M: 17250, A: 14000, L: 18600 }
    },
    {
        name: "Alchemist's amulet",
        short: "amulet",
        price: { M: 6900, A: 5650, L: 7400 }
    },
    {
        name: "Aldarium",
        short: "aldarium",
        price: { M: 80, A: 60, L: 90 }
    },
] satisfies Reward[];
