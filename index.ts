import rulesetDefinitions from "./rules.js";
import { rewards } from "./rewards.js";
import {
    type Context,
    type Combination,
    addResin,
    rollPotionsRequest,
    applyRules,
    calculateResults
} from "./definitions.js";

const targetItem = rewards.find(i => i.short === "storage");

for (const { name, ruleset } of rulesetDefinitions) {
    const potionsReceived: Partial<Record<Combination, number>> = {};
    const potionsDone: Partial<Record<Combination, number>> = {};

    const context: Context = {
        activity: "active",
        paste: { M: 0, A: 0, L: 0 },
        resin: { M: 0, A: 0, L: 0 }
    };

    const counters = {
        time: 0,
        experience: 0,
        paste: { M: 0, A: 0, L: 0 },
        resin: { M: 0, A: 0, L: 0 }
    };

    for (let i = 0; i < 1e6; i++) {
        const request = rollPotionsRequest();
        const items = applyRules(context, request, ruleset);
        const result = calculateResults(context, items);

        counters.time += result.time.crafting + result.time.preparing + result.time.walking;
        counters.experience += result.experience;

        addResin(counters.resin, result.resin);
        addResin(counters.paste, result.pasteUsed);

        for (const original of request) {
            potionsReceived[original.potion] = (potionsReceived[original.potion] ?? 0) + 1;
        }
        for (const filtered of items) {
            potionsDone[filtered.potion] = (potionsDone[filtered.potion] ?? 0) + 1;
        }

        // if (targetItem) {
        //     if (targetItem.price.M <= counters.resin.M && targetItem.price.A <= counters.resin.A && targetItem.price.L <= counters.resin.L) {
        //         break;
        //     }
        // }

        // console.log({
        //     ...result,
        //     potionsAvailable: request.map(i => `${i.station} ${i.potion}`).join(" "),
        //     potionsTaken: items.map(i => `${i.station} ${i.potion}`).join(" "),
        // });
    }

    const experiencePerHour = Math.floor(counters.experience / counters.time * 6000);
    const resinPerHour = {
        M: Math.floor(counters.resin.M / counters.time * 6000),
        A: Math.floor(counters.resin.A / counters.time * 6000),
        L: Math.floor(counters.resin.L / counters.time * 6000),
    };

    console.log(name, {
        // potionsReceived,
        // potionsDone,
        pasteUsed: counters.paste,
        timeSpent: counters.time,
        experiencePerHour,
        resinPerHour,
        totalResinPerHour: resinPerHour.M + resinPerHour.A + resinPerHour.L
    });
}
