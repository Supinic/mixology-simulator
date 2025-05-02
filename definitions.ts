import { randomInt } from "crypto";

const typedEntries = <T extends object> (object: T): [keyof T, T[keyof T]][] => (
    Object.entries(object) as [keyof T, T[keyof T]][]
);
const typedFromEntries = <T extends string | number | symbol, U> (entries: [T, U][]): Record<T, U> => (
    Object.fromEntries(entries) as Record<T, U>
);

type FullResin = "Mox" | "Aga" | "Lye";
type Resin = "M" | "A" | "L";
export type Combination = "MMM" | "AAA" | "LLL" | "MMA" | "MML" | "AAM" | "ALA" | "MLL" | "ALL" | "MAL";

type PotionData = {
    name: string;
    level: number;
    experience: number;
    weight: number;
    resin: Record<Resin, number>;
    cost: Record<Resin, number>;
};

export const potionsDefinition = {
    AAA: {
        name: "Alco-Augmentator",
        level: 60,
        experience: 190,
        weight: 5,
        resin: { M: 0, A: 20, L: 0 },
        cost: { M: 0, A: 30, L: 0 }
    },
    MMM: {
        name: "Mammoth-Might Mix",
        level: 60,
        experience: 190,
        weight: 5,
        resin: { M: 20, A: 0, L: 0 },
        cost: { M: 30, A: 0, L: 0 }
    },
    LLL: {
        name: "Liplack Liquor",
        level: 60,
        experience: 190,
        weight: 5,
        resin: { M: 0, A: 0, L: 20 },
        cost: { M: 0, A: 0, L: 30 }
    },
    MMA: {
        name: "Mystic Mana Amalgam",
        level: 63,
        experience: 215,
        weight: 4,
        resin: { M: 20, A: 10, L: 0 },
        cost: { M: 20, A: 10, L: 0 }
    },
    MML: {
        name: "Marley's Moonlight",
        level: 66,
        experience: 240,
        weight: 4,
        resin: { M: 20, A: 0, L: 10 },
        cost: { M: 20, A: 0, L: 10 }
    },
    AAM: {
        name: "Azure Aura Mix",
        level: 69,
        experience: 265,
        weight: 4,
        resin: { M: 10, A: 20, L: 0 },
        cost: { M: 10, A: 20, L: 0 }
    },
    ALA: {
        name: "Aqualux Amalgam",
        level: 72,
        experience: 290,
        weight: 4,
        resin: { M: 0, A: 20, L: 10 },
        cost: { M: 0, A: 20, L: 10 }
    },
    MLL: {
        name: "Megalite Liquid",
        level: 75,
        experience: 315,
        weight: 4,
        resin: { M: 10, A: 0, L: 20 },
        cost: { M: 10, A: 0, L: 20 }
    },
    ALL: {
        name: "Anti-Leech Lotion",
        level: 78,
        experience: 340,
        weight: 4,
        resin: { M: 0, A: 10, L: 20 },
        cost: { M: 0, A: 10, L: 20 }
    },
    MAL: {
        name: "Mixalot",
        level: 81,
        experience: 365,
        weight: 3,
        resin: { M: 20, A: 20, L: 20 },
        cost: { M: 10, A: 10, L: 10 }
    }
} as const satisfies Record<Combination, PotionData>;

type FullStation = "Crystallizer" | "Homogenizer" | "Concentrator";
type Station = "Cr" | "Ho" | "Co";
const craftingStations = ["Cr", "Ho", "Co"] as const satisfies Station[];

type CraftingTime = { lazy: number; active: number /* | number[] */ }
export const craftingTimes = {
    Co: { lazy: Infinity, active: 7 },
    Cr: { lazy: Infinity, active: 9 },
    Ho: { lazy: Infinity, active: 7 /* technically [6, 8] but averages to 7 */ }
} as const satisfies Record<Station, CraftingTime>;

export const determineTravelTime = (stations: Station[]): number => {
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
    station: Station;
};
type PotionRequest = [Craft, Craft, Craft];
type FilteredRequest = Craft[];

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
        const randomWeight = randomInt(1, maxWeight + 1);
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

export type Context = {
    activity: "lazy" | "active";
    paste: Record<Resin, number>;
    resin: Record<Resin, number>;
};
export type StrategyRule = (context: Context, request: PotionRequest) => FilteredRequest | false;
export const applyRules = (context: Context, request: PotionRequest, rules: StrategyRule[]): FilteredRequest => {
    let currentRequest: FilteredRequest = request;
    for (const rule of rules) {
        const ruleResult = rule(context, request);
        if (ruleResult === false) {
            continue;
        }

        return ruleResult;
    }

    return currentRequest;
}

const percentageMultiplier = { 1: 1.0, 2: 1.2, 3: 1.4 };
const isValidItemAmount = (input: number): input is 1 | 2 | 3 => (input >= 1 && input <= 3);
const BELT_TO_LEVERS_WALK_TIME = 4; // 4 ticks to walk from the delivery conveyor back to the resin levers

export type ResinObject = Record<Resin, number>;
export const addResin = <const T extends ResinObject> (mutated: T, added: ResinObject): void => {
    mutated.M += added.M;
    mutated.A += added.A;
    mutated.L += added.L;
};

export const calculateResults = (context: Context, request: FilteredRequest) => {
    const stations = request.map(i => i.station);
    const walkingTime = determineTravelTime(stations) + BELT_TO_LEVERS_WALK_TIME + 1;

    let preparingTime = 0;
    let craftingTime = 0;
    let experience = 0;
    const baseResin = { M: 0, A: 0, L: 0 };

    for (const item of request) {
        const potionData = potionsDefinition[item.potion];

        const potionResin = potionData.resin;
        addResin(baseResin, potionResin);

        experience += potionData.experience;

        preparingTime += 3 + 2; // 3 ticks to mix, 2 ticks to grab
        craftingTime += craftingTimes[item.station][context.activity] + 1; // 1 tick to begin crafting
    }

    const itemAmount = request.length;
    if (!isValidItemAmount(itemAmount)) {
        throw new Error(`Invalid item amount: ${itemAmount}`);
    }

    const bonus = percentageMultiplier[itemAmount];
    const resin = {
        M: baseResin.M * bonus,
        A: baseResin.A * bonus,
        L: baseResin.L * bonus
    };

    return {
        resin,
        experience,
        itemAmount,
        baseResin,
        bonus,
        time: {
            walking: walkingTime,
            preparing: preparingTime,
            crafting: craftingTime
        }
    };
}
