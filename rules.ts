import type { StrategyRule } from "./definitions.js";
export type RulesetDefinition = {
    name: string;
    ruleset: StrategyRule[];
};

export const experienceFocus = {
    name: "experienceFocus",
    ruleset: [
        // If MAL is available, always do all three
        (context, request) => {
            if (request.some(i => i.potion === "MAL")) {
                return request;
            }

            return false;
        },
        // Prioritize all doubles that involve Lye (MML, MLL)
        (context, request) => {
            const list = [];
            for (const item of request) {
                if (item.potion === "MML" || item.potion == "MLL") {
                    list.push(item);
                }
            }

            return (list.length === 0)
                ? false
                : list;
        },
        // "Bite the bullet and do a single LLL if possible"
        (context, request) => {
            const tripleLye = request.find(i => i.potion === "LLL");
            return (tripleLye) ? [tripleLye] : false;
        },
        // Unfortunate roll, do one of MMM or Aga-based ones as a fallback
        (context, request) => {
            return [request[0]];
        },
    ]
} satisfies RulesetDefinition;

export const control = {
    name: "control",
    ruleset: [
        (context, request) => request
    ]
} satisfies RulesetDefinition;
