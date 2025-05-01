import { control, experienceFocus, type RulesetDefinition } from "./rules.js";
import { type Context, addResin, rollPotionsRequest, applyRules, calculateResults, type Combination } from "./definitions.js";

const rulesetDefinitions = [
    control,
    experienceFocus
] satisfies RulesetDefinition[];

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

        for (const original of request) {
            potionsReceived[original.potion] = (potionsReceived[original.potion] ?? 0) + 1;
        }
        for (const filtered of items) {
            potionsDone[filtered.potion] = (potionsDone[filtered.potion] ?? 0) + 1;
        }

        // console.log({
        //     ...result,
        //     potionsAvailable: request.map(i => i.potion).join(" "),
        //     potionsTaken: items.map(i => i.potion).join(" "),
        // });
    }

    const experiencePerHour = Math.floor(counters.experience / counters.time * 6000);
    const resinPerHour = {
        M: Math.floor(counters.resin.M / counters.time * 6000),
        A: Math.floor(counters.resin.A / counters.time * 6000),
        L: Math.floor(counters.resin.L / counters.time * 6000)
    };

    console.log(name, {
        // potionsReceived,
        // potionsDone,
        experiencePerHour,
        resinPerHour
    });
}
