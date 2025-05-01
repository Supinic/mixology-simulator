import { control, experienceFocus } from "./rules.js";
import { type Context, rollPotionsRequest, applyRules, calculateResults } from "./definitions.js";

const rulesets = [
    control,
    experienceFocus
];

for (const ruleset of rulesets) {
    const context: Context = {
        activity: "active",
        paste: { M: 0, A: 0, L: 0 },
        resin: { M: 0, A: 0, L: 0 }
    };

    const counters = {
        time: 0,
        experience: 0,
        resin: { M: 0, A: 0, L: 0 }
    };

    for (let i = 0; i < 1e6; i++) {
        const request = rollPotionsRequest();
        const items = applyRules(context, request, ruleset);
        const result = calculateResults(context, items);

        counters.time += result.time.crafting + result.time.preparing + result.time.walking;
        counters.experience += result.experience;
        counters.resin.M += result.resin.M;
        counters.resin.A += result.resin.A;
        counters.resin.L += result.resin.L;

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

    console.log({
        experiencePerHour,
        resinPerHour
    });
}
