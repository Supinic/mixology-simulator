import { randomInt } from "crypto";

const typedEntries = <T extends object> (object: T): [keyof T, T[keyof T]][] => (
    Object.entries(object) as [keyof T, T[keyof T]][]
);
const typedFromEntries = <T extends string | number | symbol, U> (entries: [T, U][]): Record<T, U> => (
    Object.fromEntries(entries) as Record<T, U>
);

type Resin = "Mox" | "Aga" | "Lye";
type ShortType = "M" | "A" | "L";
type Combination = "MMM" | "AAA" | "LLL" | "MMA" | "MML" | "AAM" | "ALA" | "MLL" | "ALL" | "MAL";

type PotionData = {
    name: string;
    level: number;
    experience: number;
    weight: number;
    points: Record<ShortType, number>;
};

export const potionsDefinition = {
    AAA: {
        name: "Alco-Augmentator",
        level: 60,
        experience: 190,
        weight: 5,
        points: {M: 0, A: 20, L: 0}
    },
    MMM: {
        name: "Mammoth-Might Mix",
        level: 60,
        experience: 190,
        weight: 5,
        points: {M: 20, A: 0, L: 0}
    },
    LLL: {
        name: "Liplack Liquor",
        level: 60,
        experience: 190,
        weight: 5,
        points: {M: 0, A: 0, L: 20}
    },
    MMA: {
        name: "Mystic Mana Amalgam",
        level: 63,
        experience: 215,
        weight: 4,
        points: {M: 20, A: 10, L: 0}
    },
    MML: {
        name: "Marley's Moonlight",
        level: 66,
        experience: 240,
        weight: 4,
        points: {M: 20, A: 0, L: 10}
    },
    AAM: {
        name: "Azure Aura Mix",
        level: 69,
        experience: 265,
        weight: 4,
        points: {M: 10, A: 20, L: 0}
    },
    ALA: {
        name: "Aqualux Amalgam",
        level: 72,
        experience: 290,
        weight: 4,
        points: {M: 0, A: 20, L: 10}
    },
    MLL: {
        name: "Megalite Liquid",
        level: 75,
        experience: 315,
        weight: 4,
        points: {M: 10, A: 0, L: 20}
    },
    ALL: {
        name: "Anti-Leech Lotion",
        level: 78,
        experience: 340,
        weight: 4,
        points: {M: 0, A: 10, L: 20}
    },
    MAL: {
        name: "Mixalot",
        level: 81,
        experience: 365,
        weight: 3,
        points: {M: 20, A: 20, L: 20}
    }
} as const satisfies Record<Combination, PotionData>;

type CraftingStation = "Crystallizer" | "Homogenizer" | "Concentrator";
type ShortCraft = "Cr" | "Ho" | "Co";
const craftingStations = ["Cr", "Ho", "Co"] as const;

export const craftingTimes: Record<ShortCraft, { lazy: number; active: number | number[]; }> = {
    Co: { lazy: Infinity, active: 7 },
    Cr: { lazy: Infinity, active: 9 },
    Ho: { lazy: Infinity, active: [6, 8] }
};

export const determineTravelTime = (stations: ShortCraft[]): number => {
    if (stations.length === 0 || stations.length > 3) {
        throw new Error("Assert error: Stations length outside of range <1, 3>");
    }

    if (stations.every(i => i === stations.at(0))) {
        return 4; // All stations are the same, trivial
    }

    const [first, second, third] = stations;
    if (stations.length === 3 && first !== second && second !== third) {
        return 6; // singles: potion -> crystal -> conc -> homo -> belt
    }

    if (stations.some(i => i === "Co") && stations.some(i => i === "Cr")) {
        return 6; // order doesn't matter, always 6t
    }
    else if (stations.some(i => i === "Co") && stations.some(i => i === "Ho")) {
        return 4; // potion -> conc -> homo -> belt
    }
    else if (stations.some(i => i === "Cr") && stations.some(i => i === "Ho")) {
        return 5; // potion -> crystal -> homo -> belt
    }

    throw new Error(`Assert error: Unreachable station combination: ${stations.join("")} `);
}

type Craft = {
    potion: Combination;
    station: ShortCraft;
};
type PotionRequest = [Craft, Craft, Craft];
type FilteredRequest = [Craft] | [Craft, Craft] | [Craft, Craft, Craft];

let currentWeight = 0;
const weightEntries: [Combination, number][] = typedEntries(potionsDefinition).map(i => {
    const [key, def] = i;
    currentWeight += def.weight;
    return [key, currentWeight];
});
const maxWeight = currentWeight;

export const rollPotionsRequest = (): PotionRequest => {
    const result: Craft[] = [];
    for (let i = 0; i < 3; i++) {
        const stationIndex = randomInt(0, craftingStations.length);
        const station = craftingStations[stationIndex];

        let potion: Combination | null = null;
        const randomWeight = randomInt(0, maxWeight + 1);
        for (const [combination, potionWeight] of weightEntries) {
            if (randomWeight <= potionWeight) {
                potion = combination;
                break;
            }
        }

        if (!potion) {
            throw new Error(`No potion was rolled, weight = ${randomWeight}`);
        }

        result.push({ station, potion });
    }

    return result as PotionRequest;
}

type StrategyRule = unknown;
export const applyRules = (request: PotionRequest, rules: StrategyRule[]): FilteredRequest => {
    // ... todo ...
}
